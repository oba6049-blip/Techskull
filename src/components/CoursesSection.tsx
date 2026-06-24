import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Clock, Award, Star, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import { Course } from '../types';
import { POPULAR_COURSES } from '../data';

interface CoursesSectionProps {
  onEnroll: (courseId: string) => void;
  enrolledCourseIds: string[];
  isLoggedIn: boolean;
  onNavigateToAuth: (tab: 'login' | 'register') => void;
}

export default function CoursesSection({
  onEnroll,
  enrolledCourseIds,
  isLoggedIn,
  onNavigateToAuth
}: CoursesSectionProps) {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveCatalog = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const list = await response.json();
          setCoursesList(list);
        }
      } catch (err) {
        console.warn('Unable to load live course catalog from DB, falling back:', err);
      }
    };
    fetchLiveCatalog();
  }, []);

  const categories = ['All', 'Development', 'Programming', 'Infrastructure', 'Design', 'Security', 'Data Science'];

  const filteredCourses = coursesList.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnrollClick = (course: Course) => {
    if (!isLoggedIn) {
      onNavigateToAuth('register');
      return;
    }
    
    onEnroll(course.id);
    setEnrollSuccessMessage(`Successfully enrolled in "${course.title}"! Checked into Student Dashboard.`);
    setTimeout(() => {
      setEnrollSuccessMessage(null);
    }, 4500);
  };

  return (
    <section id="courses" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-sm font-extrabold text-[#1E4F8A] uppercase tracking-widest bg-[#1E4F8A]/10 px-4 py-1.5 rounded-full inline-block">
              Course Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
              Explore Academic Programs
            </h2>
            <p className="text-base text-gray-600 font-normal">
              Acquire certified practical skillsets mentored by global tech professionals.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search course title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#41B883] focus:border-[#41B883] text-sm text-gray-800 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#13294B] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Enroll Toast / Feedback Alert */}
        <AnimatePresence>
          {enrollSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold">{enrollSuccessMessage}</span>
                <p className="mt-1 text-xs text-emerald-700 font-medium">Head to the Student Dashboard to view and tracks your progress notes.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-[#13294B] shadow-sm">
                      {course.category}
                    </div>
                    {isEnrolled && (
                      <div className="absolute top-4 right-4 bg-[#41B883] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Rating & difficulty */}
                      <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                        <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {course.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1 bg-[#1E4F8A]/5 px-2 py-0.5 rounded-md text-[#1E4F8A]">
                          <Award className="w-3.5 h-3.5" />
                          {course.level}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#13294B] group-hover:text-[#1E4F8A] transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-semibold">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{course.duration}</span>
                      </div>

                      <button
                        id={`enroll-btn-${course.id}`}
                        onClick={() => handleEnrollClick(course)}
                        disabled={isEnrolled}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1 transition-all ${
                          isEnrolled
                            ? 'bg-emerald-50 text-[#41B883] cursor-not-allowed border border-emerald-100'
                            : 'bg-[#13294B] hover:bg-[#41B883] text-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        <span>{isEnrolled ? 'Enrolled' : 'Enroll Now'}</span>
                        {!isEnrolled && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Fallback Empty State */}
          {filteredCourses.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-bold text-gray-700">No courses match your parameters</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search keywords.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 bg-[#13294B] text-white rounded-lg text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
