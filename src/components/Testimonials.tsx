import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#13294B]/[0.015] relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute top-10 left-10 text-gray-200/20 pointer-events-none transform -rotate-12">
        <Quote className="w-48 h-48" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <span className="text-sm font-extrabold text-[#41B883] uppercase tracking-widest bg-[#41B883]/10 px-4 py-1.5 rounded-full inline-block">
            Student Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
            Loved by Ambitious Learners
          </h2>
          <p className="text-base text-gray-600 font-normal">
            Read first-hand accounts from certified students who optimized their semesters with TechSkull.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-55px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* 5-star rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4.5 h-4.5 ${
                        i < test.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Feedback body */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal italic">
                  "{test.feedback}"
                </p>
              </div>

              {/* Student Metadata footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center space-x-3.5">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1E4F8A]/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#13294B]">
                    {test.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold">{test.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
