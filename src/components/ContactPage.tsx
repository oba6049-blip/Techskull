import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Sparkles, ChevronDown, ChevronUp, HelpCircle, Clock, Building, MessageSquare } from 'lucide-react';
import ContactSection from './ContactSection';

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How do I register a student profile on TechSkull?',
      answer: 'Simply navigate to the Register link in our main navigation. You can sign up using traditional email verification or use Google SSO (Continue with Google) for seamless instant credentials onboarding.'
    },
    {
      question: 'Are the course certificates fully accredited?',
      answer: 'Yes. TechSkull Institute of Applied Sciences runs fully-structured courses approved by academic boards. Digital completion credentials contain cryptographic hashes easily shareable on LinkedIn and portfolios.'
    },
    {
      question: 'Can I enroll in multiple academic programs simultaneously?',
      answer: 'Absolutely. TechSkull supports modular self-paced learnings. You can reserve slot seats in any active catalog tracks, and all assignments will compile cleanly inside your specific dashboard channels.'
    },
    {
      question: 'How does assignment submission and grading operate?',
      answer: 'Once enrolled, your Student Dashboard lists active task requirements. You can upload assignments directly inside the submission drawer. Instructors compile and publish scorecard grades in real-time, instantly updating your GPA tracking widget.'
    },
    {
      question: 'How do I reach out for direct student advisory support?',
      answer: 'Our registrar teams are available 9:00 AM - 5:00 PM EST. Use the contact desk form on this page or email registry@techskull.edu for enrollment audits, syllabus extensions, or account assistance.'
    }
  ];

  const departments = [
    {
      name: 'Admissions & Registrar Office',
      room: 'Main Academic Block, Suite 101',
      email: 'registry@techskull.edu',
      hours: 'Mon - Fri, 9 AM - 5 PM EST',
      icon: Building,
    },
    {
      name: 'Sandbox Technical Helpdesk',
      room: 'Science Center Blvd, Lab 405-D',
      email: 'sandbox@techskull.edu',
      hours: 'Mon - Sat, 8 AM - 8 PM EST',
      icon: HelpCircle,
    },
    {
      name: 'Institutional Partnerships Desk',
      room: 'Science Center Blvd, Suite 210',
      email: 'partners@techskull.edu',
      hours: 'Mon - Fri, 10 AM - 4 PM EST',
      icon: Mail,
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="pt-20 sm:pt-28">
      {/* Header Banner */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#13294B]/5 via-white to-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E4F8A]/5 rounded-full filter blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Support Center</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#13294B] tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Contact our <span className="bg-gradient-to-r from-[#1E4F8A] to-[#41B883] bg-clip-text text-transparent">Academic Registrar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Have enrollment inquiries, syllabus issues, or dashboard concerns? Reach our advisors for professional technical guidelines.
          </motion.p>
        </div>
      </section>

      {/* Main Form Section */}
      <ContactSection />

      {/* Campus Offices & Depts */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-[#13294B] tracking-tight">Academic Department Hubs</h2>
            <p className="text-gray-500 text-sm">Reach specialized teams immediately based on your enrollment and sandbox support needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {departments.map((dept, idx) => {
              const DeptIcon = dept.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="p-3 w-12 h-12 rounded-xl bg-blue-50 text-[#1E4F8A] flex items-center justify-center border border-blue-100">
                    <DeptIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-gray-900">{dept.name}</h3>
                    <p className="text-xs text-gray-500">{dept.room}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{dept.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{dept.hours}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Toggle FAQ Accordion Section */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#1E4F8A] uppercase tracking-wider bg-[#1E4F8A]/10 px-3 py-1 rounded-full">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Academic FAQ</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#13294B] tracking-tight">Frequently Asked Inquiries</h2>
            <p className="text-gray-600 text-sm font-normal">
              Find instant clarification regarding logins, enrollment verification slots, and cloud sandbox file submissions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-gray-150/60 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#41B883]/30"
                  >
                    <span className="pr-4 text-sm sm:text-base">{faq.question}</span>
                    <span className="text-gray-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#41B883]" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-50 bg-gray-50/30">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
