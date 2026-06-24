import { GraduationCap, Mail, Phone, MapPin, Github, Linkedin, Twitter, SquareTerminal } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleScrollTo = (id: string) => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const quickLinks = [
    { label: 'Campus Home', id: 'home' },
    { label: 'Academic Programs', id: 'courses' },
    { label: 'System Features', id: 'features' },
    { label: 'LMS Timeline', id: 'about' },
    { label: 'Student Testimonials', id: 'testimonials' },
  ];

  const popularPrograms = [
    { label: 'Web Development', id: 'courses' },
    { label: 'Python Essentials', id: 'courses' },
    { label: 'Cloud & DevOps', id: 'courses' },
    { label: 'UI/UX Masterclass', id: 'courses' },
    { label: 'Cybersecurity', id: 'courses' },
  ];

  return (
    <footer className="bg-[#13294B] text-gray-300 pt-16 pb-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleScrollTo('home')}>
              <div className="p-2 bg-white/5 rounded-xl text-[#41B883]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-white flex items-center gap-1">
                Tech<span className="text-[#41B883]">Skull</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-400 font-normal leading-relaxed max-w-sm">
              An accredited digital academy offering enterprise-level curriculum paths in computer architecture, software deployment, and system security operations.
            </p>

            {/* Social handles */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-[#41B883] rounded-lg transition-colors">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-[#41B883] rounded-lg transition-colors">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-[#41B883] rounded-lg transition-colors">
                <Github className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 hover:text-[#41B883] rounded-lg transition-colors">
                <SquareTerminal className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleScrollTo(link.id)}
                    className="hover:text-[#41B883] transition-colors font-medium hover:underline text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Popular Programs</h4>
            <ul className="space-y-2.5 text-sm">
              {popularPrograms.map((prog, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleScrollTo(prog.id)}
                    className="hover:text-[#41B883] transition-colors font-medium hover:underline text-left text-gray-400"
                  >
                    {prog.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts Information */}
          <div id="contact" className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Campus Registry</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-5 h-5 text-[#41B883] shrink-0 mt-0.5" />
                <span className="text-gray-400 font-normal">
                  809 Science Center Blvd, Suite 200,<br />
                  Tech-District, TD 94016
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4.5 h-4.5 text-[#41B883] shrink-0" />
                <span className="text-gray-400 font-normal">+1 (800) 555-SKULL</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4.5 h-4.5 text-[#41B883] shrink-0" />
                <span className="text-gray-400 font-normal hover:text-white transition-colors">
                  registry@techskull.edu
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium space-y-4 sm:space-y-0">
          <span>
            © {new Date().getFullYear()} TechSkull Institute of Applied Sciences. All structural rights reserved.
          </span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">System Security Laws</a>
            <a href="#" className="hover:text-white transition-colors">Usage Policies</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Rights</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
