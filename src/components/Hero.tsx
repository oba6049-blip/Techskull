import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { ViewState } from '../types';
import CountUp from './CountUp';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const handleScrollTo = (id: string, view: ViewState) => {
    onNavigate(view);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section
      id="home"
      className="relative pt-24 sm:pt-32 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#13294B]/5 via-white to-white"
    >
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1E4F8A]/5 rounded-full filter blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-12 left-12 w-64 h-64 bg-[#41B883]/10 rounded-full filter blur-3xl -z-10 pointer-events-none" />

      {/* Grid Pattern Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-[#41B883]/10 text-[#22724D] dark:text-[#41B883] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Next-Gen Student Academic Experience</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#13294B] leading-tight tracking-tight"
              >
                Learn Today. <br />
                <span className="bg-gradient-to-r from-[#1E4F8A] to-[#41B883] bg-clip-text text-transparent">
                  Build Tomorrow.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                Register, enroll in courses, submit assignments, and track your academic progress all from one modern student portal. Experience learning optimized for the digital landscape.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                id="hero-get-started-btn"
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-[#13294B] hover:bg-[#1E4F8A] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-browse-courses-btn"
                onClick={() => onNavigate('courses')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#13294B] font-bold rounded-xl border border-gray-200/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Browse Courses</span>
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-6 sm:pt-8 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center lg:justify-start text-xs sm:text-sm text-gray-500 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#41B883] rounded-full" /> Authorized by University Senate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#1E4F8A] rounded-full" /> Fully Encryption Safe
              </span>
            </motion.div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-lg lg:max-w-none"
            >
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#1E4F8A]/10 to-[#41B883]/10 blur-xl opacity-70 -z-10" />

              {/* The illustration block */}
              <div className="relative bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <img
                  src="/src/assets/images/student_hero_illustration_1782133181994.jpg"
                  alt="TechSkull Student Learning Community"
                  className="w-full h-auto rounded-xl sm:rounded-2xl object-cover transform hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Floating micro-badges */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-2">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#41B883] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#41B883]"></span>
                  </span>
                  <span className="text-xs font-semibold text-[#13294B]"><CountUp end={142} suffix=" students online" /></span>
                </div>

                <div className="absolute top-6 right-6 bg-[#13294B]/95 text-white backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2">
                  <Play className="w-4.5 h-4.5 text-[#41B883] fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">LMS Active Session</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
