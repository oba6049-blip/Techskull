import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { TIMELINE_STEPS } from '../data';

export default function HowItWorks() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#13294B] text-white overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#1E4F8A]/20 rounded-full filter blur-3xl -z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4">
          <span className="text-sm font-extrabold text-[#41B883] uppercase tracking-widest bg-[#41B883]/10 px-4 py-1.5 rounded-full inline-block">
            Portal Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="text-base text-gray-300 font-normal">
            A chronological timeline detailing your digital lifecycle from account creation to academic rewards.
          </p>
        </div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative"
        >
          {/* Horizontal Line connector (Hidden on Mobile) */}
          <div className="hidden lg:block absolute top-[52px] left-10 right-10 h-0.5 bg-gradient-to-r from-teal-500/10 via-[#41B883]/50 to-indigo-500/10 -z-1" />

          {/* Steps container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {TIMELINE_STEPS.map((item, idx) => {
              const IconComponent = (LucideIcons as any)[item.iconName] || LucideIcons.Check;
              return (
                <motion.div
                  key={item.step}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circle number button containing Lucide Icon */}
                  <div className="relative mb-6">
                    {/* Ring glow on hover */}
                    <div className="absolute -inset-2 rounded-full bg-[#41B883]/0 group-hover:bg-[#41B883]/10 transition-colors duration-300 -z-1 scale-110" />

                    <div className="w-24 h-24 bg-[#1E4F8A]/60 border-2 border-white/20 group-hover:border-[#41B883] text-[#41B883] group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-105">
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 bg-[#41B883] text-[#13294B] w-7 h-7 rounded-full text-xs font-black flex items-center justify-center border border-[#13294B]">
                      {item.step}
                    </div>
                  </div>

                  {/* Body labels */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#41B883] transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal max-w-[180px]">
                    {item.description}
                  </p>

                  {/* Step arrow indicator (Visible on non-desktop) */}
                  {idx < 5 && (
                    <div className="lg:hidden mt-6 text-[#41B883]/40 flex items-center justify-center">
                      <LucideIcons.ArrowDown className="w-5 h-5 md:hidden" />
                      <LucideIcons.ArrowRight className="hidden md:block lg:hidden w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
