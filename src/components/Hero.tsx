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
      className="relative pt-32 pb-24 sm:pt-40 sm:pb-36 overflow-hidden bg-[#13294B] text-white"
    >
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://imgur.com/C6AXKeH.png')",
          backgroundPosition: "center 25%"
        }}
      />
      {/* Gradient Overlay for superior text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#13294B] via-[#13294B]/90 to-[#13294B]/40 lg:to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-[#41B883]/20 text-[#41B883] border border-[#41B883]/30 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Next-Gen Student Academic Experience</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
              >
                Learn Today. <br />
                <span className="bg-gradient-to-r from-[#41B883] to-emerald-400 bg-clip-text text-transparent">
                  Build Tomorrow.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
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
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-[#41B883] hover:bg-[#38a373] text-[#13294B] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-browse-courses-btn"
                onClick={() => onNavigate('courses')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Browse Courses</span>
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-6 sm:pt-8 border-t border-white/10 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center lg:justify-start text-xs sm:text-sm text-gray-300 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#41B883] rounded-full" /> Authorized by University Senate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-400 rounded-full" /> Fully Encryption Safe
              </span>
            </motion.div>
          </div>

          {/* Right column left open to display background image beautifully */}
          <div className="lg:col-span-5" />

        </div>
      </div>
    </section>
  );
}
