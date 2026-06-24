import { motion } from 'motion/react';
import { Award, Shield, BookOpen, Sparkles, Code2, Users2, Cpu } from 'lucide-react';
import HowItWorks from './HowItWorks';
import StatsSection from './StatsSection';

export default function AboutPage() {
  const faculty = [
    {
      name: 'Dr. Evelyn Martinez',
      role: 'Head of Computer Architecture',
      bio: 'Former principal architect at Intel with 15+ years of researching secure chip design and software systems.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Prof. Marcus Vance',
      role: 'Director of Web Technologies',
      bio: 'Ex-Staff Engineer at Vercel, active TC39 contributor, and author of several modern JavaScript compilation standards.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Sarah Jenkins, MSc',
      role: 'Lead Cloud Infrastructure Advisor',
      bio: 'DevOps researcher and AWS Certified Solutions Architect, pioneering lightweight container compilation models.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    }
  ];

  const values = [
    {
      title: 'Applied Engineering',
      desc: 'We prioritize active project compilation, version safety, and direct production deployments over passive learning formats.',
      icon: Code2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Accredited Curriculum',
      desc: 'All training syllabi align precisely with industry expectations and academic senate quality guidelines.',
      icon: Award,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'Transparent Integrity',
      desc: 'Full grade and GPA transparency with precise student rubric breakdowns and immutable submission proof logs.',
      icon: Shield,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    }
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
            className="inline-flex items-center space-x-2 bg-[#1E4F8A]/10 text-[#1E4F8A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Institutional Profile</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#13294B] tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Empowering the Next Generation of <span className="bg-gradient-to-r from-[#1E4F8A] to-[#41B883] bg-clip-text text-transparent">Digital Engineers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            TechSkull is a premier accredited institution offering enterprise-level digital science tracks, self-paced research timelines, and modern LMS-managed dashboards.
          </motion.p>
        </div>
      </section>

      {/* Main Core Mission Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mission text */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-extrabold text-[#13294B] tracking-tight">
                Our Academic Vision & Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
                At TechSkull, we believe traditional education platforms are too rigid, leaving students disconnected from the rapid pacing of modern tech environments. We bridged this gap by creating an enterprise-grade academic platform that integrates secure student dashboards, code submissions, and active deployments.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
                Our mission is to democratize high-fidelity software engineering and cloud infrastructure training, turning concepts into robust, live-running code solutions.
              </p>

              {/* Checkmarks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1 bg-[#41B883]/15 text-[#22724D] rounded-md">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">100% Practical Curriculums</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-1 bg-[#41B883]/15 text-[#22724D] rounded-md">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Expert Staff Guidance</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-1 bg-[#41B883]/15 text-[#22724D] rounded-md">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Automated Grade Tracking</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-1 bg-[#41B883]/15 text-[#22724D] rounded-md">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Interactive Syllabus Files</span>
                </div>
              </div>
            </div>

            {/* Visual element side */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#1E4F8A]/10 to-[#41B883]/10 blur-xl opacity-60 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="TechSkull Classroom Collaboration"
                className="rounded-2xl shadow-lg border border-gray-100 object-cover w-full max-w-lg aspect-video lg:aspect-square relative z-10"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Stats section */}
      <StatsSection />

      {/* Timeline Steps (How It Works) */}
      <HowItWorks />

      {/* Our core pillars / values */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-[#13294B] tracking-tight">Our Core Academic Pillars</h2>
            <p className="text-gray-500 text-sm">Every learning pathway, LMS dashboard tool, and student interaction is built on top of these foundation practices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => {
              const ValueIcon = v.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className={`p-3 w-12 h-12 rounded-xl flex items-center justify-center border ${v.color}`}>
                    <ValueIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Distinguished Faculty Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-sm font-extrabold text-[#1E4F8A] uppercase tracking-widest bg-[#1E4F8A]/10 px-4 py-1 rounded-full inline-block">
              Our Educators
            </span>
            <h2 className="text-3xl font-extrabold text-[#13294B] tracking-tight">Meet the Faculty Advisory Board</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Learn directly from accomplished computer researchers, veterans of global tech giants, and passionate syllabus advisors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {faculty.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-gray-150/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center p-6 space-y-4 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1E4F8A] to-[#41B883] rounded-full filter blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 group-hover:border-[#41B883] transition-colors relative z-10"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#1E4F8A] transition-colors">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#41B883] tracking-wide uppercase">{member.role}</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
