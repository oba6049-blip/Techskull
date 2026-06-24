import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { FEATURES } from '../data';

export default function FeaturesSection() {
  const headingVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }
    })
  };

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#13294B]/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headingVariants}
            className="text-sm font-extrabold text-[#41B883] uppercase tracking-widest bg-[#41B883]/10 px-4 py-1.5 rounded-full"
          >
            Campus Technologies
          </motion.span>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headingVariants}
            className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight"
          >
            Streamlined Dual-System Integration
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headingVariants}
            className="text-base sm:text-lg text-gray-600 font-normal"
          >
            Everything a dedicated student needs to achieve professional academic growth, merged beautifully in an offline-ready single ecosystem platform.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            // Dynamically resolve lucide icons securely
            const IconComponent = (LucideIcons as any)[feature.iconName] || LucideIcons.HelpCircle;

            return (
              <motion.div
                key={feature.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={cardVariants}
                className="group relative bg-white hover:bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Visual Accent Top-Border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1E4F8A] to-[#41B883] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon Sphere */}
                <div className="mb-6 inline-flex items-center justify-center p-4 bg-accent/10 text-accent rounded-2xl group-hover:bg-navy group-hover:text-accent transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-[#13294B] mb-3 group-hover:text-[#1E4F8A] transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {feature.description}
                </p>

                {/* Interactive Subtle Arrow */}
                <div className="mt-6 flex items-center text-xs font-bold text-[#13294B] opacity-40 group-hover:opacity-100 group-hover:text-[#41B883] transition-all duration-300">
                  <span className="mr-1">Standard Feature Module</span>
                  <LucideIcons.Check className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
