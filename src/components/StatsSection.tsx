import { motion } from 'motion/react';
import { Users, GraduationCap, Award, CheckCircle } from 'lucide-react';
import CountUp from './CountUp';

export default function StatsSection() {
  const stats = [
    {
      id: 'stat-students',
      end: 10000,
      suffix: '+',
      label: 'Students Enrolled',
      desc: 'Active global learners',
      icon: Users,
      color: 'text-[#1E4F8A]',
      bgColor: 'bg-[#1E4F8A]/10'
    },
    {
      id: 'stat-courses',
      end: 250,
      suffix: '+',
      label: 'Accredited Courses',
      desc: 'Top-tier curriculum studies',
      icon: GraduationCap,
      color: 'text-[#41B883]',
      bgColor: 'bg-[#41B883]/10'
    },
    {
      id: 'stat-instructors',
      end: 120,
      suffix: '+',
      label: 'Expert Professors',
      desc: 'Leading industry scholars',
      icon: Award,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      id: 'stat-satisfaction',
      end: 98,
      suffix: '%',
      label: 'Satisfaction Rate',
      desc: 'From verified course reviews',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    }
  ];

  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-light-gray hover:bg-slate-100 p-6 rounded-2xl border border-[#EDF2F7] transition-all duration-300 hover:shadow-md text-center flex flex-col items-center justify-center gap-3"
              >
                {/* Circular Icon Container */}
                <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Metric Data */}
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-[#1E4F8A] tracking-tight">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#64748B]">{stat.label}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
