import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ViewState } from './types';
import { POPULAR_COURSES, FEATURES } from './data';

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

// Multi-Page Views
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import TestimonialsPage from './components/TestimonialsPage';
import ContactPage from './components/ContactPage';

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
              
              {/* Teaser Featured Programs Preview Grid */}
              <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-bold text-[#1E4F8A] uppercase tracking-widest bg-[#1E4F8A]/10 px-4 py-1.5 rounded-full inline-block">
                      Featured Programs
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
                      Preview Our Academic Syllabus
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 font-normal">
                      Acquire professional-grade engineering capabilities designed to level up your technology stack.
                    </p>
                  </div>

                  {/* 3 Featured Courses */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {POPULAR_COURSES.slice(0, 3).map((course) => (
                      <div key={course.id} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                          <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                          <div className="p-6 space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1E4F8A] px-2.5 py-1 rounded-md">
                              {course.category}
                            </span>
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{course.title}</h3>
                            <p className="text-xs text-gray-500 font-normal leading-relaxed line-clamp-2">{course.description}</p>
                          </div>
                        </div>
                        <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-gray-500 border-t border-gray-50 mt-4">
                          <span>{course.duration}</span>
                          <span className="text-[#41B883] font-bold">★ {course.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-12">
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-[#13294B] hover:bg-[#1E4F8A] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span>Explore All Academic Programs</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Teaser Portal Features Preview Section */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-bold text-[#41B883] uppercase tracking-widest bg-[#41B883]/10 px-4 py-1.5 rounded-full inline-block">
                      Next-Gen System
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
                      LMS Dashboard Capabilities
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 font-normal">
                      A modern student administration portal built with enterprise safety, real-time grades, and code submissions.
                    </p>
                  </div>

                  {/* 3 Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURES.slice(0, 3).map((feat) => {
                      const IconComponent = (LucideIcons as any)[feat.iconName] || LucideIcons.CheckCircle2;
                      return (
                        <div key={feat.id} className="bg-white p-8 rounded-2xl border border-gray-150/60 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                          <div className="p-3 bg-gray-50 border border-gray-100 text-[#1E4F8A] w-12 h-12 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">{feat.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">{feat.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center mt-12">
                    <button
                      onClick={() => setCurrentView('features')}
                      className="inline-flex items-center space-x-2 px-8 py-4 bg-transparent hover:bg-gray-50 text-[#13294B] border border-gray-250 font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <span>View All Portal Features</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              <CallToAction onNavigate={(v) => setCurrentView(v)} />
            </motion.div>
          )}

          {/* Dedicated Courses View */}
          {currentView === 'courses' && (
            <motion.div
              key="courses-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0 pt-20 sm:pt-28 animate-fade"
            >
              <div className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#13294B]/5 via-white to-white border-b border-gray-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E4F8A]/5 rounded-full filter blur-3xl -z-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                  <span className="inline-flex items-center space-x-2 bg-[#1E4F8A]/10 text-[#1E4F8A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Academic Programs Catalog</span>
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-[#13294B] tracking-tight leading-tight max-w-3xl mx-auto">
                    Acquire Practical <span className="bg-gradient-to-r from-[#1E4F8A] to-[#41B883] bg-clip-text text-transparent">Engineering Mastery</span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Syllabus tracks reviewed by the academic senate, featuring live workspaces, automated GPA updates, and verifiable graduation badges.
                  </p>
                </div>
              </div>

              <CoursesSection
                onEnroll={handleEnrollCourse}
                enrolledCourseIds={session?.role === 'student' ? (session.registeredCourses || []) : []}
                isLoggedIn={!!session}
                onNavigateToAuth={(tab) => setCurrentView(tab)}
              />
            </motion.div>
          )}

          {/* Dedicated About Page View */}
          {currentView === 'about' && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutPage />
            </motion.div>
          )}

          {/* Dedicated Features Page View */}
          {currentView === 'features' && (
            <motion.div
              key="features-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeaturesPage />
            </motion.div>
          )}

          {/* Dedicated Testimonials Page View */}
          {currentView === 'testimonials' && (
            <motion.div
              key="testimonials-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TestimonialsPage />
            </motion.div>
          )}

          {/* Dedicated Contact Page View */}
          {currentView === 'contact' && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactPage />
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
