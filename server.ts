import express from 'express';
import path from 'path';
import { connectToMongoDB, dbService } from './src/db/mongo.js';
import dotenv from 'dotenv';

// Load environment configurations
dotenv.config();

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Connect Database securely on initialization
  const dbStatus = await connectToMongoDB();

  // API ROUTS
  // 1. Get running database connection status
  app.get('/api/db-status', (req, res) => {
    res.json({
      connected: !dbService.getIsMockMode(),
      mode: dbService.getIsMockMode() ? 'Fallback local JSON Store' : 'Cloud MongoDB Atlas Clusters'
    });
  });

  // 1b. Get active Google Authentication URL
  app.get('/api/auth/google/url', (req, res) => {
    const role = req.query.role || 'student';
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    let dynamicCallbackUrl = '';
    if (process.env.APP_URL) {
      const cleanAppUrl = process.env.APP_URL.replace(/\/$/, '');
      dynamicCallbackUrl = `${cleanAppUrl}/api/auth/google/callback`;
    } else {
      const rawProtocol = ((req.headers['x-forwarded-proto'] as string) || '').split(',')[0].trim();
      const rawHost = ((req.headers['x-forwarded-host'] as string) || req.headers.host || '').split(',')[0].trim();
      
      const isLocalhost = rawHost.includes('localhost') || rawHost.includes('127.0.0.1');
      const protocol = isLocalhost ? (rawProtocol || 'http') : 'https';
      const host = rawHost;
      
      const dynamicOrigin = `${protocol}://${host}`;
      dynamicCallbackUrl = `${dynamicOrigin}/api/auth/google/callback`;
    }

    // Check if real credentials are not set or are default placeholders
    if (!clientId || clientId === 'google-client-id-here' || !clientSecret || clientSecret === 'google-client-secret-here') {
      return res.status(400).json({
        error: 'MISSING_CREDENTIALS',
        message: 'Google OAuth Single Sign-On is not configured. Please supply your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET variables inside the Workspace settings config.',
        callbackUrl: dynamicCallbackUrl
      });
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(dynamicCallbackUrl)}&response_type=code&scope=openid%20profile%20email&state=${encodeURIComponent(role as string)}&prompt=select_account`;

    res.json({ url: googleAuthUrl });
  });

  // 1c. Google OAuth Callback Endpoint
  app.get('/api/auth/google/callback', async (req, res) => {
    const { code, state: role } = req.query;

    if (!code) {
      return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_SSO_FAILURE', error: 'Google authentication was cancelled by the user.' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    let redirectUri = '';
    if (process.env.APP_URL) {
      const cleanAppUrl = process.env.APP_URL.replace(/\/$/, '');
      redirectUri = `${cleanAppUrl}/api/auth/google/callback`;
    } else {
      const rawProtocol = ((req.headers['x-forwarded-proto'] as string) || '').split(',')[0].trim();
      const rawHost = ((req.headers['x-forwarded-host'] as string) || req.headers.host || '').split(',')[0].trim();
      
      const isLocalhost = rawHost.includes('localhost') || rawHost.includes('127.0.0.1');
      const protocol = isLocalhost ? (rawProtocol || 'http') : 'https';
      const host = rawHost;
      redirectUri = `${protocol}://${host}/api/auth/google/callback`;
    }

    try {
      // 1. Exchange authorization code for tokens
      const tokenExchangeResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId || '',
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenExchangeResponse.ok) {
        const errBody = await tokenExchangeResponse.text();
        throw new Error(`Google token exchange failed: ${errBody}`);
      }

      const tokenData = await tokenExchangeResponse.json() as any;
      const accessToken = tokenData.access_token;

      // 2. Fetch user profile from Verified Google endpoints
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to retrieve verified user identity from Google Accounts profile API.');
      }

      const googleProfile = await userInfoResponse.json() as any;
      const email = googleProfile.email;
      const name = googleProfile.name;

      if (!email || !name) {
        throw new Error('Google identity did not container required primary email and full name assertions.');
      }

      // 3. Sync profile with database
      let user = await dbService.findUserByEmail(email);
      const userRole = (role as string) || 'student';

      if (userRole === 'admin' && email.toLowerCase().trim() !== 'adeyemifaridah23@gmail.com') {
        return res.send(`
          <html>
            <body class="bg-slate-50 flex items-center justify-center min-h-screen font-sans">
              <div style="text-align: center; padding: 40px; border-radius: 20px; background: white; border: 1px solid #EAEAEA; max-width: 400px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <h3 style="color: #EF4444; margin-bottom: 8px;">Access Denied</h3>
                <p style="color: #666; font-size: 13px; line-height: 1.5;">Only adeyemifaridah23@gmail.com is authorized to access the system as an administrator.</p>
                <button onclick="window.close()" style="margin-top: 15px; padding: 8px 16px; background: #13294B; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 12px;">Close Window</button>
              </div>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'GOOGLE_SSO_FAILURE', error: 'Only adeyemifaridah23@gmail.com is authorized to access the system as an administrator.' }, '*');
                }
              </script>
            </body>
          </html>
        `);
      }
      
      if (!user) {
        // Automatically register fresh user profile in MongoDB
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        
        user = {
          role: userRole,
          name: name,
          email: email.toLowerCase().trim(),
          department: 'Computer Science & Engineering',
          createdAt: new Date().toISOString()
        };

        if (userRole === 'admin') {
          user.employeeId = `ADM-GGL-${randomNum}`;
        } else {
          user.studentId = `TS-GGL-${randomNum}`;
          user.registeredCourses = [];
          user.completedAssignments = {};
        }

        await dbService.createUser(user);
      } else {
        // Update user role to match selected Google SSO role
        if (user.role !== userRole) {
          user.role = userRole;
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          if (userRole === 'admin' && !user.employeeId) {
            user.employeeId = `ADM-GGL-${randomNum}`;
          } else if (userRole === 'student' && !user.studentId) {
            user.studentId = `TS-GGL-${randomNum}`;
            if (!user.registeredCourses) user.registeredCourses = [];
            if (!user.completedAssignments) user.completedAssignments = {};
          }
          await dbService.updateUser(email, {
            role: user.role,
            employeeId: user.employeeId || null,
            studentId: user.studentId || null,
            registeredCourses: user.registeredCourses || [],
            completedAssignments: user.completedAssignments || {}
          });
        }
      }

      // 4. Send user context back to application parent frame
      res.send(`
        <html>
          <body class="bg-slate-50 flex items-center justify-center min-h-screen font-sans">
            <div style="text-align: center; padding: 40px; border-radius: 20px; background: white; border: 1px solid #EAEAEA; max-width: 400px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h3 style="color: #13294B; margin-bottom: 8px;">Authenticating with TechSkull...</h3>
              <p style="color: #666; font-size: 13px; line-height: 1.5;">Securing academic Single Sign-On session. Please wait...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'GOOGLE_SSO_SUCCESS', 
                  user: ${JSON.stringify(user)} 
                }, '*');
                setTimeout(() => {
                  window.close();
                }, 1000);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error('Google OAuth callback error details:', error);
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'GOOGLE_SSO_FAILURE', 
                  error: ${JSON.stringify(error.message || 'Verification rejected')} 
                }, '*');
                setTimeout(() => {
                  window.close();
                }, 4000);
              } else {
                document.body.innerHTML = '<h3>Authentication process rejected.</h3><p>' + ${JSON.stringify(error.message)} + '</p>';
              }
            </script>
          </body>
        </html>
      `);
    }
  });

  // 2. Google OAuth Integration endpoint
  app.post('/api/auth/google', async (req, res) => {
    const { email, name, role, department } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Google authentication payload received with missing parameters.' });
    }

    try {
      let user = await dbService.findUserByEmail(email);
      const userRole = role || 'student';

      if (userRole === 'admin' && email.toLowerCase().trim() !== 'adeyemifaridah23@gmail.com') {
        return res.status(403).json({ error: 'Only adeyemifaridah23@gmail.com is authorized to access the system as an administrator.' });
      }
      
      if (!user) {
        // Automatically register fresh user profile in MongoDB
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        
        user = {
          role: userRole,
          name: name,
          email: email.toLowerCase().trim(),
          department: department || 'Computer Science & Engineering',
          createdAt: new Date().toISOString()
        };

        if (userRole === 'admin') {
          user.employeeId = `ADM-GGL-${randomNum}`;
        } else {
          user.studentId = `TS-GGL-${randomNum}`;
          user.registeredCourses = [];
          user.completedAssignments = {};
        }

        await dbService.createUser(user);
      } else {
        // Update user role to match selected Google SSO role
        if (user.role !== userRole) {
          user.role = userRole;
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          if (userRole === 'admin' && !user.employeeId) {
            user.employeeId = `ADM-GGL-${randomNum}`;
          } else if (userRole === 'student' && !user.studentId) {
            user.studentId = `TS-GGL-${randomNum}`;
            if (!user.registeredCourses) user.registeredCourses = [];
            if (!user.completedAssignments) user.completedAssignments = {};
          }
          await dbService.updateUser(email, {
            role: user.role,
            employeeId: user.employeeId || null,
            studentId: user.studentId || null,
            registeredCourses: user.registeredCourses || [],
            completedAssignments: user.completedAssignments || {}
          });
        }
      }

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Database registration failure during Google single sign-on.' });
    }
  });

  // 3. Register user
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Please specify name, credential email, passkey password, and role.' });
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      if (role === 'admin' && cleanEmail !== 'adeyemifaridah23@gmail.com') {
        return res.status(403).json({ error: 'Only adeyemifaridah23@gmail.com is authorized to register as an administrator.' });
      }
      if (role === 'admin' && password !== 'subair@09') {
        return res.status(403).json({ error: 'The administrator account must be registered with the authorized secure password.' });
      }

      const existingUser = await dbService.findUserByEmail(cleanEmail);
      if (existingUser) {
        return res.status(400).json({ error: 'An account has already been registered with this institutional email.' });
      }

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const user: any = {
        role,
        name,
        email: cleanEmail,
        password, // Simulating credential pairing secure check in sandbox
        department: department || 'Computer Science & Engineering',
        createdAt: new Date().toISOString()
      };

      if (role === 'admin') {
        user.employeeId = `ADM-2026-${randomNum}`;
      } else {
        user.studentId = `TS-2026-${randomNum}`;
        user.registeredCourses = [];
        user.completedAssignments = {};
      }

      await dbService.createUser(user);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failure.' });
    }
  });

  // 4. Student/Admin authenticate logic
  app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please submit your registered email and secure passkey token.' });
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      if (role === 'admin' && cleanEmail !== 'adeyemifaridah23@gmail.com') {
        return res.status(403).json({ error: 'Only adeyemifaridah23@gmail.com can be authenticated as an administrator.' });
      }

      const user = await dbService.findUserByEmail(cleanEmail);
      if (!user) {
        return res.status(400).json({ error: 'No matching user credentials found in registry.' });
      }

      if (user.role !== role) {
        return res.status(400).json({ error: `Identified system profile is registered as a ${user.role}, not an ${role}.` });
      }

      // Password comparison
      if (role === 'admin') {
        if (password !== 'subair@09') {
          return res.status(403).json({ error: 'Invalid admin security token entered.' });
        }
      } else if (password && user.password && user.password !== password) {
        return res.status(403).json({ error: 'Invalid passkey security token entered.' });
      }

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Authentication backend database error.' });
    }
  });

  // 5. Course Catalog retrieval
  app.get('/api/courses', async (req, res) => {
    try {
      const list = await dbService.getCourses();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Launch new Course (Admin authority only)
  app.post('/api/courses', async (req, res) => {
    const { title, description, duration, level, category, image, rating } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Course title and curriculum description is required.' });
    }

    try {
      const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newlyCreated = {
        id: newId,
        title,
        description,
        duration: duration || '8 Weeks',
        level: level || 'Beginner',
        category: category || 'Development',
        rating: Number(rating) || 4.8,
        image: image || 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=600&q=80'
      };

      await dbService.createCourse(newlyCreated);
      res.json({ success: true, course: newlyCreated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. Get submissions (Admin to review all, Students retrieve their file list)
  app.get('/api/submissions', async (req, res) => {
    const { studentEmail } = req.query;
    try {
      let list = await dbService.getSubmissions();
      if (studentEmail) {
        list = list.filter((s: any) => s.studentEmail.toLowerCase().trim() === (studentEmail as string).toLowerCase().trim());
      }
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. Submit assignment task (Student)
  app.post('/api/submissions', async (req, res) => {
    const { studentName, studentEmail, studentId, courseId, courseTitle, assignmentName, fileName } = req.body;
    if (!studentEmail || !courseTitle || !fileName) {
      return res.status(400).json({ error: 'Missing necessary assignment identification tags.' });
    }

    try {
      const submissionId = `sub-${Math.floor(1000 + Math.random() * 9000)}`;
      const submission = {
        id: submissionId,
        studentName,
        studentEmail,
        studentId,
        courseTitle,
        assignmentName,
        fileName,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Pending'
      };

      await dbService.createSubmission(submission);

      // Add to student's user profile completedAssignments tracking state
      const user = await dbService.findUserByEmail(studentEmail);
      if (user) {
        const completed = user.completedAssignments || {};
        completed[courseId] = {
          fileName,
          submittedAt: new Date().toISOString().substring(0, 10)
        };
        await dbService.updateUser(studentEmail, { completedAssignments: completed });
      }

      res.json({ success: true, submission });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. Post assessment grade (Admin authority)
  app.patch('/api/submissions/:id', async (req, res) => {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    try {
      await dbService.updateSubmission(id, {
        status: 'Graded',
        grade,
        feedback
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9.5. Update student profile social links (GitHub & Vercel)
  app.patch('/api/users/:email/profile', async (req, res) => {
    const { email } = req.params;
    const { githubLink, vercelLink } = req.body;

    try {
      const user = await dbService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Student/User profile not found.' });
      }

      const updates: any = {};
      if (githubLink !== undefined) updates.githubLink = githubLink;
      if (vercelLink !== undefined) updates.vercelLink = vercelLink;

      await dbService.updateUser(email, updates);
      res.json({ success: true, updates });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update student profile.' });
    }
  });

  // 10. Enroll student inside a course list
  app.patch('/api/users/:email/enroll', async (req, res) => {
    const { email } = req.params;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'Missing course id target.' });
    }

    try {
      const user = await dbService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Student registration record not found.' });
      }

      const registered = user.registeredCourses || [];
      if (!registered.includes(courseId)) {
        registered.push(courseId);
        await dbService.updateUser(email, { registeredCourses: registered });
      }

      res.json({ success: true, registeredCourses: registered });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. Get all registered system users/students (Admin)
  app.get('/api/users', async (req, res) => {
    try {
      const list = await dbService.getUsers();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 12. Create student manually from academic administration (Admin)
  app.post('/api/users', async (req, res) => {
    const { name, email, role, department, studentId, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Please submit student name and institutional email.' });
    }

    try {
      const existingUser = await dbService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'A user profile is already registered with this email.' });
      }

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const user: any = {
        role: role || 'student',
        name,
        email: email.toLowerCase().trim(),
        password: password || 'WelcomeTS2026',
        department: department || 'Computer Science & Engineering',
        createdAt: new Date().toISOString()
      };

      if (user.role === 'admin') {
        user.employeeId = `ADM-2026-${randomNum}`;
      } else {
        user.studentId = studentId || `TS-2026-${randomNum}`;
        user.registeredCourses = [];
        user.completedAssignments = {};
      }

      await dbService.createUser(user);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 13. Update student user details directly (Admin)
  app.patch('/api/users/:email', async (req, res) => {
    const { email } = req.params;
    const { name, department, registeredCourses, role, studentId } = req.body;

    try {
      const user = await dbService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (department !== undefined) updates.department = department;
      if (registeredCourses !== undefined) updates.registeredCourses = registeredCourses;
      if (role !== undefined) updates.role = role;
      if (studentId !== undefined) updates.studentId = studentId;

      await dbService.updateUser(email, updates);
      res.json({ success: true, updates });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 14. Delete user profile entirely (Admin)
  app.delete('/api/users/:email', async (req, res) => {
    const { email } = req.params;
    try {
      await dbService.deleteUser(email);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 15. Delete syllabus course record (Admin)
  app.delete('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await dbService.deleteCourse(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite development / Production handling
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind server listener
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Server] Portal Server booted up securely online on port ${PORT}`);
  });
}

bootstrap();
