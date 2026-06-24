import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState } from './types';

// Components imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import CoursesSection from './components/CoursesSection';
import HowItWorks from './components/HowItWorks';
import PortalFeatures from './components/PortalFeatures';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import AuthView from './components/AuthView';
import ContactSection from './components/ContactSection';
import StudentDashboardView from './components/StudentDashboardView';
import AdminDashboardView from './components/AdminDashboardView';

interface UserSession {
  role: 'student' | 'admin';
  name: string;
  email: string;
  studentId?: string;
  employeeId?: string;
  department: string;
  registeredCourses?: string[];
  completedAssignments?: { [key: string]: { fileName: string; submittedAt: string } };
  githubLink?: string;
  vercelLink?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [session, setSession] = useState<UserSession | null>(null);

  // Automatically scroll to top on routing changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const handleAuthSuccess = (profile: UserSession) => {
    setSession(profile);
    // Automatically redirect to dashboard upon successful register/login
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentView('home');
  };

  const handleUpdateProfile = async (updates: { githubLink?: string; vercelLink?: string }) => {
    if (session && session.role === 'student') {
      const updatedSession = {
        ...session,
        ...updates
      };
      setSession(updatedSession);

      try {
        const response = await fetch(`/api/users/${encodeURIComponent(session.email)}/profile`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (!response.ok) {
          console.warn('Backend profile update returned a non-ok response.');
        }
      } catch (err) {
        console.error('Failed to sync profile updates with MongoDB:', err);
      }
    }
  };

  const handleEnrollCourse = async (courseId: string) => {
    if (!session) {
      setCurrentView('register');
      return;
    }

    if (session.role === 'admin') {
      // Admins are faculty registrar members; they don't enroll in student courses
      return;
    }

    const currentCourses = session.registeredCourses || [];
    // Append course if not already enrolled
    if (!currentCourses.includes(courseId)) {
      const updated = [...currentCourses, courseId];
      
      // Real backend persistence trigger
      try {
        const response = await fetch(`/api/users/${encodeURIComponent(session.email)}/enroll`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId })
        });
        if (response.ok) {
          const data = await response.json();
          setSession({
            ...session,
            registeredCourses: data.registeredCourses
          });
          return;
        }
      } catch (err) {
        console.warn('Backend enrollment sync skipped, falling back to instant frontend cache:', err);
      }

      setSession({
        ...session,
        registeredCourses: updated
      });
    }
  };

  const handleUpdateDashboardCourses = async (courseIds: string[]) => {
    if (session && session.role === 'student') {
      setSession({
        ...session,
        registeredCourses: courseIds
      });

      // Synchronize state list to backend
      try {
        for (const cId of courseIds) {
          await fetch(`/api/users/${encodeURIComponent(session.email)}/enroll`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId: cId })
          });
        }
      } catch (err) {
        console.error('Course enrollment list sync: ', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-white text-[#222222] selection:bg-[#41B883]/35 antialiased">
      
      {/* Sticky Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        isLoggedIn={!!session}
        onLogout={handleLogout}
        userName={session?.name}
        userRole={session?.role}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* Main Landing Page View */}
          {currentView === 'home' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-0"
            >
              <Hero onNavigate={(v) => setCurrentView(v)} />
              <StatsSection />
              <FeaturesSection />
              
              {/* Interactive Catalog Section */}
              <CoursesSection
                onEnroll={handleEnrollCourse}
                enrolledCourseIds={session?.role === 'student' ? (session.registeredCourses || []) : []}
                isLoggedIn={!!session}
                onNavigateToAuth={(tab) => setCurrentView(tab)}
              />

              <HowItWorks />
              <PortalFeatures />
              <Testimonials />
              
              {/* Contact Inquiry Section */}
              <ContactSection />
              
              <CallToAction onNavigate={(v) => setCurrentView(v)} />
            </motion.div>
          )}

          {/* Standalone Route switches (Auth Screen) */}
          {(currentView === 'login' || currentView === 'register') && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <AuthView
                initialTab={currentView === 'login' ? 'login' : 'register'}
                onAuthSuccess={handleAuthSuccess}
                onCancel={() => setCurrentView('home')}
              />
            </motion.div>
          )}

          {/* Dashboard Profile view */}
          {currentView === 'dashboard' && session && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
            >
              {session.role === 'admin' ? (
                <AdminDashboardView
                  userProfile={{
                    role: session.role,
                    name: session.name,
                    email: session.email,
                    employeeId: session.employeeId,
                    department: session.department
                  }}
                  onLogout={handleLogout}
                />
              ) : (
                <StudentDashboardView
                  userProfile={{
                    name: session.name,
                    email: session.email,
                    studentId: session.studentId || '',
                    department: session.department,
                    registeredCourses: session.registeredCourses || [],
                    completedAssignments: session.completedAssignments || {},
                    githubLink: session.githubLink || '',
                    vercelLink: session.vercelLink || ''
                  }}
                  onUpdateCourses={handleUpdateDashboardCourses}
                  onUpdateProfile={handleUpdateProfile}
                  onLogout={handleLogout}
                />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Directory */}
      <Footer onNavigate={(v) => setCurrentView(v)} />

    </div>
  );
}
