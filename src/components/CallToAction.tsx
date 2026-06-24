import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface CallToActionProps {
  onNavigate: (view: ViewState) => void;
}

export default function CallToAction({ onNavigate }: CallToActionProps) {
  const handleScrollToCourses = () => {
    onNavigate('courses');
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-[#13294B] to-[#1E4F8A] px-6 py-12 sm:p-16 rounded-[2rem] overflow-hidden text-center shadow-xl border border-white/10"
        >
          {/* Ambient accent background circle */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#41B883]/10 rounded-full filter blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />

          {/* Foreground items */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Start Learning with TechSkull Today
            </h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
              Create your secure student account instantly to claim your placement, review requirements, and attend your first lectures.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                id="cta-register-btn"
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-[#41B883] hover:bg-[#349c6e] text-[#13294B] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="cta-courses-btn"
                onClick={handleScrollToCourses}
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white font-bold rounded-xl border border-white/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Courses
              </button>
            </div>
            
            {/* Disclaimer */}
            <p className="text-xs text-blue-200/60 font-medium">
              Free basic enrollment test tier available for high school graduating classes. Full safety guaranteed.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
