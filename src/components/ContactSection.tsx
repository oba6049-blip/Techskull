import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Mail, Phone, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Admission Enquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !message) {
      setValidationError('Please populate all fields prior to sending.');
      return;
    }

    setIsSubmitted(true);
    // Reset Form
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setCategory('Admission Enquiry');
    }, 1000);
  };

  return (
    <section id="contact-panel" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <span className="text-sm font-extrabold text-[#1E4F8A] uppercase tracking-widest bg-[#1E4F8A]/10 px-4 py-1.5 rounded-full inline-block">
                Campus Helpline
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
                Get in Touch With Our Registrar
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                Have specific concerns regarding course schedules, credit conversions, or exam structures? Send down an inquiry note and our registry office will respond in 24 hours.
              </p>
            </div>

            {/* Quick cards */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#13294B]/5 text-[#13294B] rounded-xl shrink-0">
                  <MapPin className="w-5 h-5 text-[#1E4F8A]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#13294B] text-sm">Main Campus Address</h4>
                  <p className="text-xs text-gray-500 font-medium">809 Science Center Blvd, Suite 200, Tech-District</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#13294B]/5 text-[#13294B] rounded-xl shrink-0">
                  <Phone className="w-5 h-5 text-[#1E4F8A]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#13294B] text-sm">Registry Helpline</h4>
                  <p className="text-xs text-gray-500 font-medium">+1 (800) 555-SKULL (Mon-Fri 8AM-5PM)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#13294B]/5 text-[#13294B] rounded-xl shrink-0">
                  <Mail className="w-5 h-5 text-[#1E4F8A]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#13294B] text-sm">Academics Registry</h4>
                  <p className="text-xs text-gray-500 font-medium">registry@techskull.edu</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100/50 text-[11px] text-[#22724D] font-bold inline-flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#41B883]" />
              <span>Full student privacy rules are respected at all times.</span>
            </div>
          </div>

          {/* Right Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#13294B]/[0.015] p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm relative">
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <h3 className="text-xl font-bold text-[#13294B] mb-2">Send Registry Inquiry</h3>

                    {validationError && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{validationError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Alex Mercer"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] bg-white transition-all"
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="alex@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Inquiry category selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Inquiry Subject</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] transition-all appearance-none cursor-pointer"
                      >
                        <option value="Admission Enquiry">Admission & Entry Enquiry</option>
                        <option value="Course Enrolments">Course Schedule Verification</option>
                        <option value="LMS support">LMS Assignment Submissions Support</option>
                        <option value="Special Case Exception">Special Circumstance Request</option>
                      </select>
                    </div>

                    {/* Message textarea */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 block tracking-wider">Your Inquiry details</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="State your query clearly here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] bg-white transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-[#13294B] hover:bg-[#1E4F8A] text-white text-xs font-bold rounded-xl tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Dispatch Message</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-[#13294B]">Registry Note Dispatched!</h3>
                      <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out, <span className="font-bold">{name}</span>. We have assigned ticket category <span className="text-indigo-600 font-bold">{category}</span> to your query.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-[#13294B] font-bold rounded-xl text-xs uppercase tracking-wide transition-colors"
                      >
                        Submit another ticket
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
