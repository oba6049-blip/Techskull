import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, GraduationCap, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
  userRole?: 'student' | 'admin';
}

export default function Navbar({
  currentView,
  onNavigate,
  isLoggedIn,
  onLogout,
  userName,
  userRole
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home' as ViewState, href: '#home' },
    { label: 'Courses', view: 'courses' as ViewState, href: '#courses' },
    { label: 'About', view: 'about' as ViewState, href: '#about' },
    { label: 'Features', view: 'features' as ViewState, href: '#features' },
    { label: 'Testimonials', view: 'testimonials' as ViewState, href: '#testimonials' },
    { label: 'Contact', view: 'contact' as ViewState, href: '#contact' },
  ];

  const handleItemClick = (view: ViewState, href: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
    
    // If navigating back to homepage, scroll to the corresponding anchor
    if (view === 'home' || view === 'courses' || view === 'about' || view === 'features' || view === 'testimonials' || view === 'contact') {
      setTimeout(() => {
        const element = document.getElementById(href.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-100/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleItemClick('home', '#home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="p-2 bg-[#13294B] rounded-xl text-[#41B883] transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-[#13294B] dark:text-white flex items-center gap-1">
              Tech<span className="text-[#41B883]">Skull</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === 'home' && window.location.hash === item.href;
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick('home', item.href)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1E4F8A] transition-colors relative"
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#41B883]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {isLoggedIn ? (
              <div id="navbar-user-controls" className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentView === 'dashboard'
                      ? 'bg-[#13294B] text-white'
                      : 'border border-gray-200 text-[#13294B] hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-accent" />
                  <span>{userRole === 'admin' ? 'Admin Console' : 'Dashboard'}</span>
                </button>
                <div className="h-6 w-[10px] bg-gray-200"></div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 font-bold">
                  <span className="font-medium max-w-[120px] truncate">{userName}</span>
                  {userRole === 'admin' && (
                    <span className="bg-red-50 text-red-700 font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wider border border-red-100">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-semibold text-[#13294B] hover:text-[#1E4F8A] transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => onNavigate('register')}
                  className="flex items-center space-x-1 px-5 py-2.5 bg-[#13294B] hover:bg-[#1E4F8A] text-white text-sm font-semibold rounded-xl tracking-wide shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Register</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`p-2 rounded-lg ${
                  currentView === 'dashboard' ? 'bg-[#13294B] text-white' : 'text-gray-600 bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#13294B] focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick('home', item.href)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#13294B] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                {isLoggedIn ? (
                  <div className="px-4 py-2 space-y-3">
                    <div className="text-sm font-medium text-gray-500">
                      Logged in as: <span className="text-[#13294B] font-bold">{userName}</span> {userRole === 'admin' && <span className="text-red-600 font-extrabold uppercase text-[10px] bg-red-50 px-1 py-0.5 rounded">Admin</span>}
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#13294B] text-white rounded-lg font-semibold cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{userRole === 'admin' ? 'Go to Admin Console' : 'Go to Student Dashboard'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4 space-y-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('login');
                      }}
                      className="w-full block text-center py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('register');
                      }}
                      className="w-full block text-center py-3 bg-[#13294B] hover:bg-[#1E4F8A] text-white text-base font-semibold rounded-lg shadow-md"
                    >
                      Register Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
