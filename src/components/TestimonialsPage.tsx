import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Sparkles, UserPlus, CheckCircle2, ChevronRight, Share2 } from 'lucide-react';
import Testimonials from './Testimonials';
import { TESTIMONIALS } from '../data';

interface CustomReview {
  id: string;
  name: string;
  course: string;
  rating: number;
  feedback: string;
  avatar: string;
  date: string;
}

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<CustomReview[]>([]);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formCourse, setFormCourse] = useState('Modern Web Development');
  const [formRating, setFormRating] = useState(5);
  const [formFeedback, setFormFeedback] = useState('');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load reviews from localStorage on mount, seeding with default TESTIMONIALS
  useEffect(() => {
    const stored = localStorage.getItem('techskull_custom_reviews');
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse custom reviews, resetting:', err);
      }
    } else {
      // Seed default
      const seeded: CustomReview[] = TESTIMONIALS.map((t, idx) => ({
        ...t,
        date: new Date(Date.now() - idx * 24 * 60 * 60 * 1000 * 3).toLocaleDateString()
      }));
      setReviews(seeded);
      localStorage.setItem('techskull_custom_reviews', JSON.stringify(seeded));
    }
  }, []);

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formFeedback.trim()) return;

    const newReview: CustomReview = {
      id: `custom-${Date.now()}`,
      name: formName,
      course: formCourse,
      rating: formRating,
      feedback: formFeedback,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formName)}`,
      date: new Date().toLocaleDateString()
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('techskull_custom_reviews', JSON.stringify(updated));

    // Reset form
    setFormName('');
    setFormFeedback('');
    setFormRating(5);

    setSuccessMsg('Your feedback has been published to the student registry guestbook!');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const alumniCompanies = [
    { name: 'Google', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&h=40&q=80' },
    { name: 'Meta', logo: 'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?auto=format&fit=crop&w=120&h=40&q=80' },
    { name: 'Stripe', logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=120&h=40&q=80' },
    { name: 'Netflix', logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=120&h=40&q=80' }
  ];

  return (
    <div className="pt-20 sm:pt-28">
      {/* Page Header */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#13294B]/5 via-white to-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E4F8A]/5 rounded-full filter blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Alumni Registry Reviews</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#13294B] tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Real Stories, <span className="bg-gradient-to-r from-[#1E4F8A] to-[#41B883] bg-clip-text text-transparent">Measured Success</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Hear directly from graduates who transitioned into software roles, deployed cloud portals, and mastered data frameworks.
          </motion.p>
        </div>
      </section>

      {/* Embedded Testimonials Slider / Grid */}
      <Testimonials />

      {/* Live Guestbook Section */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Live Reviews List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#13294B]">TechSkull Guestbook</h2>
                  <p className="text-xs text-gray-500 mt-1">Live updates submitted by current enrolled students.</p>
                </div>
                <div className="flex items-center space-x-1.5 bg-[#41B883]/10 text-[#22724D] px-3 py-1 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 bg-[#41B883] rounded-full animate-ping" />
                  <span>{reviews.length} Total Logs</span>
                </div>
              </div>

              {/* Scrollable Container for reviews */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                <AnimatePresence initial={false}>
                  {reviews.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-5 rounded-2xl border border-gray-150/60 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={r.avatar} 
                            alt={r.name} 
                            className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-gray-900">{r.name}</h4>
                            <p className="text-xs text-[#1E4F8A] font-semibold">{r.course}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium block mt-1">{r.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-normal leading-relaxed">
                        "{r.feedback}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Leave a Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150/60 shadow-md space-y-6">
                <div className="space-y-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-max">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#13294B]">Publish Feedback</h3>
                  <p className="text-xs text-gray-500 font-normal">
                    Are you a TechSkull graduate? Share your academic feedback with the registrar to guide new admissions.
                  </p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Liam Sterling"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 outline-none transition-all"
                    />
                  </div>

                  {/* Course Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Academic Program</label>
                    <select
                      value={formCourse}
                      onChange={(e) => setFormCourse(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 outline-none transition-all bg-white"
                    >
                      <option value="Modern Web Development">Modern Web Development</option>
                      <option value="Python Programming Essentials">Python Programming Essentials</option>
                      <option value="Cloud & DevOps Certification">Cloud & DevOps Certification</option>
                      <option value="UI/UX Design Masterclass">UI/UX Design Masterclass</option>
                      <option value="Cybersecurity Fundamentals">Cybersecurity Fundamentals</option>
                      <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    </select>
                  </div>

                  {/* Interactive Star Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Rating Allocation</label>
                    <div className="flex items-center space-x-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setFormRating(starValue)}
                          className="text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${starValue <= formRating ? 'fill-current' : 'text-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Review Content</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Describe your student portal and syllabus experience..."
                      value={formFeedback}
                      onChange={(e) => setFormFeedback(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Message Banner success */}
                  {successMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start space-x-2 text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#13294B] hover:bg-[#1E4F8A] text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>Submit Review</span>
                    <Share2 className="w-4 h-4" />
                  </button>

                </form>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Corporate Alumni Logos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
            Our Graduates Work with Leaders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {alumniCompanies.map((c, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="font-mono text-xl font-black text-gray-800 tracking-wider">
                  {c.name}
                </span>
                <span className="text-[9px] text-[#41B883] font-bold tracking-widest uppercase">Certified</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
