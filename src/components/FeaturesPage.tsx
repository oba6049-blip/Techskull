import { motion } from 'motion/react';
import { Sparkles, Terminal, ShieldAlert, Cpu, Database, RefreshCw, Key } from 'lucide-react';
import FeaturesSection from './FeaturesSection';
import PortalFeatures from './PortalFeatures';

export default function FeaturesPage() {
  const technicalSpecs = [
    {
      title: 'OAuth & Session Management',
      desc: 'Secure login via standard JWT session tokens or direct Google Single Sign-On (SSO) with dynamic redirect URI verification on Vercel.',
      icon: Key,
    },
    {
      title: 'Encrypted Student Documents',
      desc: 'File submissions are uploaded securely, timestamped with proof receipts, and automatically indexed under personalized student folders.',
      icon: ShieldAlert,
    },
    {
      title: 'Scalable MongoDB Integration',
      desc: 'All course enrollments, grade sheets, student identifiers, and profiles are synced directly with cloud-hosted MongoDB database clusters.',
      icon: Database,
    },
    {
      title: 'Real-time Compiler Sync',
      desc: 'Automated curriculum modules, sandbox runtimes, and grade score evaluations computed on our high-efficiency server-side layers.',
      icon: Cpu,
    }
  ];

  return (
    <div className="pt-20 sm:pt-28">
      {/* Header Banner */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#13294B]/5 via-white to-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#41B883]/5 rounded-full filter blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-[#41B883]/10 text-[#22724D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>Platform Capabilities</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#13294B] tracking-tight leading-tight max-w-3xl mx-auto"
          >
            A Fully Integrated <span className="bg-gradient-to-r from-[#1E4F8A] to-[#41B883] bg-clip-text text-transparent">LMS Tech Stack</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock elite dashboards, instant enrollments, verified submissions, and comprehensive grade trackers built for software developers.
          </motion.p>
        </div>
      </section>

      {/* Basic features grid section */}
      <FeaturesSection />

      {/* Detailed bento visual sections */}
      <PortalFeatures />

      {/* Advanced LMS Tech Specs Section */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white border-t border-gray-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#1E4F8A]/10 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#41B883] uppercase tracking-widest bg-[#41B883]/10 px-3.5 py-1.5 rounded-full inline-block">
              Architecture & Security
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">Backend Security Infrastructure</h2>
            <p className="text-gray-400 text-sm">
              We operate under state-of-the-art server-side configurations protecting personal files, student portfolios, and private grade evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {technicalSpecs.map((spec, idx) => {
              const SpecIcon = spec.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#13294B]/50 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-white/10 transition-colors group"
                >
                  <div className="p-3 w-12 h-12 rounded-xl bg-white/5 text-[#41B883] flex items-center justify-center group-hover:bg-[#41B883]/10 transition-colors">
                    <SpecIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#41B883] transition-colors">{spec.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">{spec.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Core technical note bar */}
          <div className="mt-16 p-6 bg-white/5 border border-white/5 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 bg-[#41B883]/10 text-[#41B883] rounded-lg">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Full-Stack Sandbox Integration</h4>
                <p className="text-xs text-gray-400 font-normal">Connect student dashboards directly with server terminals for live course task reviews.</p>
              </div>
            </div>
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-[#1E4F8A] hover:bg-[#225FA8] text-white rounded-xl text-xs font-bold transition-all shadow-md">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Sandbox Sync</span>
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
