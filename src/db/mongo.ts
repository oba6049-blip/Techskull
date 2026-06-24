import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { POPULAR_COURSES } from '../data';

// Helper storage path for local fallback persistence
const FALLBACK_FILE_PATH = path.join(process.cwd(), 'dist', 'fallback_database.json');

// Interface for persistent items
interface DatabaseContainer {
  users: any[];
  courses: any[];
  submissions: any[];
}

let client: MongoClient | null = null;
let db: Db | null = null;
let isMockMode = false;

// Fallback in-memory and local file database state
let fallbackDb: DatabaseContainer = {
  users: [
    {
      role: 'student',
      name: "Alex Mercer",
      email: "alex.mercer@techskull.edu",
      studentId: "TS-2026-8809",
      department: "Computer Science & Engineering",
      registeredCourses: [],
      completedAssignments: {}
    },
    {
      role: 'admin',
      name: "Adeyemi Faridah",
      email: "adeyemifaridah23@gmail.com",
      password: "subair@09",
      employeeId: "ADM-2026-9901",
      department: "Computer Science & Engineering"
    }
  ],
  courses: [],
  submissions: []
};

// Try loading fallback database from disk if it exists
function loadFallback() {
  try {
    const parentDir = path.dirname(FALLBACK_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (fs.existsSync(FALLBACK_FILE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8'));
      if (parsed.users && parsed.courses && parsed.submissions) {
        parsed.submissions = parsed.submissions.filter((sub: any) => sub.id !== 'sub-1' && sub.id !== 'sub-2');
        parsed.courses = parsed.courses.filter((course: any) => !['web-dev', 'python-prog', 'cloud-comp', 'ui-ux-design', 'cybersecurity', 'ai-machine-learning'].includes(course.id));
        
        // Ensure adeyemifaridah23@gmail.com is the ONLY admin in fallback registry
        parsed.users = (parsed.users || []).filter((u: any) => u.role !== 'admin' || u.email.toLowerCase().trim() === 'adeyemifaridah23@gmail.com');
        const adminUser = parsed.users.find((u: any) => u.email.toLowerCase().trim() === 'adeyemifaridah23@gmail.com');
        if (!adminUser) {
          parsed.users.push({
            role: 'admin',
            name: "Adeyemi Faridah",
            email: "adeyemifaridah23@gmail.com",
            password: "subair@09",
            employeeId: "ADM-2026-9901",
            department: "Computer Science & Engineering"
          });
        } else {
          adminUser.role = 'admin';
          adminUser.password = 'subair@09';
          adminUser.name = "Adeyemi Faridah";
        }
        
        fallbackDb = parsed;
        saveFallback();
      }
    } else {
      saveFallback();
    }
  } catch (error) {
    console.warn('Unable to load fallback database file: ', error);
  }
}

function saveFallback() {
  try {
    const parentDir = path.dirname(FALLBACK_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(fallbackDb, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write local database file: ', error);
  }
}

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️ [Database] MONGODB_URI is not declared page variable. Booting lightweight local store fallback.');
    isMockMode = true;
    loadFallback();
    return { isMockMode: true, client: null, db: null };
  }

  try {
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db();
    isMockMode = false;
    console.log('✅ [Database] Connection established securely with MongoDB!');

    // Initialize/Seed standard records inside the live cluster database collections if empty
    const collections = await db.listCollections().toArray();
    const hasUsers = collections.some(c => c.name === 'users');
    const hasCourses = collections.some(c => c.name === 'courses');
    const hasSubmissions = collections.some(c => c.name === 'submissions');

    if (!hasUsers) {
      await db.collection('users').insertMany(fallbackDb.users);
    } else {
      // Ensure adeyemifaridah23@gmail.com is the ONLY admin in the collection
      await db.collection('users').deleteMany({ role: 'admin', email: { $ne: 'adeyemifaridah23@gmail.com' } });
      const adminExists = await db.collection('users').findOne({ email: 'adeyemifaridah23@gmail.com' });
      if (!adminExists) {
        await db.collection('users').insertOne({
          role: 'admin',
          name: "Adeyemi Faridah",
          email: "adeyemifaridah23@gmail.com",
          password: "subair@09",
          employeeId: "ADM-2026-9901",
          department: "Computer Science & Engineering"
        });
      } else {
        await db.collection('users').updateOne(
          { email: 'adeyemifaridah23@gmail.com' },
          { $set: { role: 'admin', password: 'subair@09', name: "Adeyemi Faridah" } }
        );
      }
    }
    if (!hasCourses) {
      if (fallbackDb.courses.length > 0) {
        await db.collection('courses').insertMany(fallbackDb.courses);
      }
    } else {
      // Clean up existing seeded mock courses from live collection
      await db.collection('courses').deleteMany({ id: { $in: ['web-dev', 'python-prog', 'cloud-comp', 'ui-ux-design', 'cybersecurity', 'ai-machine-learning'] } });
    }
    if (!hasSubmissions) {
      if (fallbackDb.submissions.length > 0) {
        await db.collection('submissions').insertMany(fallbackDb.submissions);
      }
    } else {
      // Clean up existing seeded mock submissions from live collection
      await db.collection('submissions').deleteMany({ id: { $in: ['sub-1', 'sub-2'] } });
    }

    return { isMockMode: false, client, db };
  } catch (err: any) {
    console.warn('❌ [Database] Failed to connect to configured MongoDB cluster:', err);
    
    const errMessage = String(err?.message || err || '');
    if (errMessage.toLowerCase().includes('tls') || errMessage.toLowerCase().includes('ssl') || errMessage.toLowerCase().includes('alert') || errMessage.toLowerCase().includes('80')) {
      console.log('💡 [Database Diagnosis] Detected SSL/TLS Handshake Error (Alert Number 80). This is almost certainly because the IP address of this Cloud Run container is not whitelisted on your MongoDB Atlas IP Access list.');
      console.log('👉 To fix this, please follow these steps:');
      console.log('   1. Sign in to your MongoDB Atlas Account.');
      console.log('   2. Navigate to "Security" -> "Network Access" in the left sidebar.');
      console.log('   3. Click "add IP Address".');
      console.log('   4. Choose "Allow Access from Anywhere" (adds 0.0.0.0/0).');
      console.log('   5. Save the changes and wait 30 seconds for Atlas to update your cluster firewall rules.');
    }

    console.log('⚠️ [Database] Gracefully falling back to integrated local database registry to ensure absolute continuous uptime.');
    isMockMode = true;
    loadFallback();
    return { isMockMode: true, client: null, db: null };
  }
}

// Database helper proxies and endpoints query managers
export const dbService = {
  getIsMockMode() {
    return isMockMode;
  },

  async getUsers() {
    if (isMockMode || !db) {
      return fallbackDb.users;
    }
    return await db.collection('users').find({}).toArray();
  },

  async findUserByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMockMode || !db) {
      return fallbackDb.users.find(u => u.email.toLowerCase().trim() === cleanEmail) || null;
    }
    return await db.collection('users').findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
  },

  async createUser(user: any) {
    user.email = user.email.toLowerCase().trim();
    if (isMockMode || !db) {
      fallbackDb.users.push(user);
      saveFallback();
      return user;
    }
    await db.collection('users').insertOne(user);
    return user;
  },

  async updateUser(email: string, updates: any) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMockMode || !db) {
      fallbackDb.users = fallbackDb.users.map(u => {
        if (u.email.toLowerCase().trim() === cleanEmail) {
          return { ...u, ...updates };
        }
        return u;
      });
      saveFallback();
      return true;
    }
    await db.collection('users').updateOne(
      { email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } },
      { $set: updates }
    );
    return true;
  },

  async getCourses() {
    if (isMockMode || !db) {
      return fallbackDb.courses;
    }
    return await db.collection('courses').find({}).toArray();
  },

  async createCourse(course: any) {
    if (isMockMode || !db) {
      fallbackDb.courses.push(course);
      saveFallback();
      return course;
    }
    await db.collection('courses').insertOne(course);
    return course;
  },

  async getSubmissions() {
    if (isMockMode || !db) {
      return fallbackDb.submissions;
    }
    return await db.collection('submissions').find({}).toArray();
  },

  async createSubmission(submission: any) {
    if (isMockMode || !db) {
      fallbackDb.submissions.push(submission);
      saveFallback();
      return submission;
    }
    await db.collection('submissions').insertOne(submission);
    return submission;
  },

  async updateSubmission(id: string, updates: any) {
    if (isMockMode || !db) {
      fallbackDb.submissions = fallbackDb.submissions.map(sub => {
        if (sub.id === id) {
          return { ...sub, ...updates };
        }
        return sub;
      });
      saveFallback();
      return true;
    }
    await db.collection('submissions').updateOne({ id }, { $set: updates });
    return true;
  },

  async deleteCourse(id: string) {
    if (isMockMode || !db) {
      fallbackDb.courses = fallbackDb.courses.filter(c => c.id !== id);
      saveFallback();
      return true;
    }
    await db.collection('courses').deleteOne({ id });
    return true;
  },

  async deleteUser(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMockMode || !db) {
      fallbackDb.users = fallbackDb.users.filter(u => u.email.toLowerCase().trim() !== cleanEmail);
      saveFallback();
      return true;
    }
    await db.collection('users').deleteOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });
    return true;
  }
};
