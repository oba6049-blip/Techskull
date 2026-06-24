import { motion } from 'motion/react';
import { PORTAL_FEATURES } from '../data';

export default function PortalFeatures() {
  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-36">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-extrabold text-[#41B883] uppercase tracking-widest bg-[#41B883]/10 px-4 py-1.5 rounded-full inline-block">
            Portal Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
            Comprehensive LMS Integration
          </h2>
          <p className="text-base text-gray-600 font-normal">
            Take a deep dive into the functional features designed to support students both on and off campus.
          </p>
        </div>

        {PORTAL_FEATURES.map((feat, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={feat.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`}
            >
              {/* Image Block */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'} relative`}
              >
                {/* Decorative border */}
                <div className="absolute -inset-3 rounded-2xl bg-[#1E4F8A]/5 blur-lg -z-1" />
                
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 aspect-video lg:aspect-[4/3]">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Frosted Glass Overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-[#13294B] shadow-sm">
                    {feat.subtitle}
                  </div>
                </div>
              </motion.div>

              {/* Text Block */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-4`}
              >
                <div className="h-1 w-12 bg-[#41B883]" />
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#13294B] tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">
                  {feat.subtitle}
                </p>
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </motion.div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
