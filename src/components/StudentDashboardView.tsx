import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  User, 
  TrendingUp, 
  BookOpen, 
  UploadCloud, 
  CheckCircle, 
  Award, 
  Bell, 
  Trash2, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  Download, 
  Percent, 
  Clock,
  Github,
  Globe,
  ExternalLink,
  Code
} from 'lucide-react';
import { Course } from '../types';
import { POPULAR_COURSES } from '../data';

interface StudentDashboardViewProps {
  userProfile: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    registeredCourses: string[];
    completedAssignments: { [key: string]: { fileName: string; submittedAt: string } };
    githubLink?: string;
    vercelLink?: string;
  };
  onUpdateCourses: (courseIds: string[]) => void;
  onUpdateProfile: (updates: { githubLink?: string; vercelLink?: string }) => void;
  onLogout: () => void;
}

type DashboardTab = 'enroll' | 'submit' | 'grades' | 'github' | 'vercel';

export default function StudentDashboardView({
  userProfile,
  onUpdateCourses,
  onUpdateProfile,
  onLogout
}: StudentDashboardViewProps) {
  // Navigation active tab matching exactly the requested structure
  const [activeTab, setActiveTab] = useState<DashboardTab>('enroll');

  // Sliders/progress state
  const [courseProgress, setCourseProgress] = useState<{ [id: string]: number }>({});

  // Database Connection Indicator
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'Checking...' });

  // MongoDB submissions listing
  const [uploadedAssignments, setUploadedAssignments] = useState<
    Array<{ id: string; courseTitle: string; assignmentName: string; fileName: string; size: string; timestamp: string; status?: string; grade?: string; feedback?: string }>
  >([]);

  // Social Links state
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [tempGithubLink, setTempGithubLink] = useState(userProfile.githubLink || '');
  const [tempVercelLink, setTempVercelLink] = useState(userProfile.vercelLink || '');
  const [linkSaveFeedback, setLinkSaveFeedback] = useState<string | null>(null);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(userProfile.registeredCourses[0] || '');
  const [selectedAssignmentTask, setSelectedAssignmentTask] = useState('Assignment 1: Fundamentals Lab Core review');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  
  // Certificate viewer
  const [viewingCertificateCourse, setViewingCertificateCourse] = useState<Course | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync / retrieve live database records on change or load
  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const res = await fetch('/api/db-status');
        if (res.ok) {
          const status = await res.json();
          setDbStatus(status);
        }
      } catch (err) {
        console.warn('Backend DB Status ping failed:', err);
      }
    };

    const fetchLiveSubmissions = async () => {
      try {
        const res = await fetch(`/api/submissions?studentEmail=${encodeURIComponent(userProfile.email)}`);
        if (res.ok) {
          const list = await res.json();
          const formatted = list.map((item: any) => ({
            id: item.id,
            courseTitle: item.courseTitle,
            assignmentName: item.assignmentName,
            fileName: item.fileName,
            size: '2.4 MB',
            timestamp: item.submittedAt,
            status: item.status || 'Pending',
            grade: item.grade,
            feedback: item.feedback
          }));
          setUploadedAssignments(formatted);
        }
      } catch (err) {
        console.warn('Backend submissions retrieval failed:', err);
      }
    };

    const fetchLiveCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const list = await res.json();
          setCoursesList(list);
        }
      } catch (err) {
        console.warn('Backend courses retrieval failed:', err);
      }
    };

    fetchDbStatus();
    fetchLiveSubmissions();
    fetchLiveCourses();
  }, [userProfile.email]);

  // Sync temp variables with changing userProfile props
  useEffect(() => {
    if (userProfile.githubLink) setTempGithubLink(userProfile.githubLink);
    if (userProfile.vercelLink) setTempVercelLink(userProfile.vercelLink);
  }, [userProfile.githubLink, userProfile.vercelLink]);

  // Automatically update selected course if student currently enrolled course updates
  useEffect(() => {
    if (userProfile.registeredCourses.length > 0 && !userProfile.registeredCourses.includes(selectedCourseId)) {
      setSelectedCourseId(userProfile.registeredCourses[0]);
    } else if (userProfile.registeredCourses.length === 0 && selectedCourseId) {
      setSelectedCourseId('');
    }
  }, [userProfile.registeredCourses, selectedCourseId]);

  // Retrieve course items student has enrolled in
  const studentEnrolledCourses = coursesList.filter(c => 
    userProfile.registeredCourses.includes(c.id)
  );

  // Unregistered courses catalog listing to showcase for quick enrolments inside dashboard card view
  const remainingOfferings = coursesList.filter(c => 
    !userProfile.registeredCourses.includes(c.id)
  );

  // Helper letter grading calculator
  const getProgressGrade = (prog: number) => {
    if (prog >= 95) return 'A+';
    if (prog >= 85) return 'A';
    if (prog >= 75) return 'B+';
    if (prog >= 60) return 'B';
    if (prog >= 45) return 'C';
    if (prog > 0) return 'D';
    return 'N/A';
  };

  // Drag-and-drop file operations
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processUploadedFile = async (file: File) => {
    const targetCourse = coursesList.find(c => c.id === selectedCourseId);
    const courseName = targetCourse ? targetCourse.title : 'General Study';
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: userProfile.name,
          studentEmail: userProfile.email,
          studentId: userProfile.studentId,
          courseId: selectedCourseId,
          courseTitle: courseName,
          assignmentName: selectedAssignmentTask,
          fileName: file.name
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect/persist code records inside MongoDB server.');
      }

      const newFile = {
        id: data.submission.id,
        courseTitle: courseName,
        assignmentName: selectedAssignmentTask,
        fileName: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        timestamp: data.submission.submittedAt,
        status: 'Pending'
      };

      setUploadedAssignments(prev => [newFile, ...prev]);
      setUploadFeedback(`Dispatched file "${file.name}" to MongoDB Collection! Course progress scaled up successfully.`);
      
      // Simulate progress progression upon submitting class deliverables
      const currentProg = courseProgress[selectedCourseId] || 0;
      const addedProg = Math.min(currentProg + 20, 100);
      setCourseProgress(prev => ({
        ...prev,
        [selectedCourseId]: addedProg
      }));
    } catch (err: any) {
      setUploadFeedback(`Connection/Save Failure: ${err.message}`);
    }

    setTimeout(() => {
      setUploadFeedback(null);
    }, 4500);
  };

  const handleDeleteSubmission = (id: string) => {
    setUploadedAssignments(prev => prev.filter(f => f.id !== id));
  };

  // Handles quick interactive course sliders
  const handleProgressSliderChange = (courseId: string, val: number) => {
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: val
    }));
  };

  // Handles updating profile link state
  const handleSaveSocialLink = async (type: 'github' | 'vercel') => {
    const linkValue = type === 'github' ? tempGithubLink : tempVercelLink;
    
    // Minimal validation
    if (linkValue && !linkValue.startsWith('http://') && !linkValue.startsWith('https://')) {
      setLinkSaveFeedback(`Error: Link URL must start with http:// or https:// protocol.`);
      setTimeout(() => setLinkSaveFeedback(null), 3000);
      return;
    }

    try {
      const updates = type === 'github' ? { githubLink: linkValue } : { vercelLink: linkValue };
      onUpdateProfile(updates);
      setLinkSaveFeedback(`Success: Personal ${type === 'github' ? 'GitHub' : 'Vercel Deployment'} pointer fully registered in MongoDB.`);
    } catch (err: any) {
      setLinkSaveFeedback(`Registration Error: ${err.message || 'Server timeout'}`);
    }

    setTimeout(() => {
      setLinkSaveFeedback(null);
    }, 4000);
  };

  const handleEnrollDirectly = (courseId: string) => {
    const updated = [...userProfile.registeredCourses, courseId];
    onUpdateCourses(updated);
  };

  const handleUnenrollDirectly = (courseId: string) => {
    const updated = userProfile.registeredCourses.filter(id => id !== courseId);
    onUpdateCourses(updated);
  };

  const calculateGPA = () => {
    if (studentEnrolledCourses.length === 0) return '0.00';
    let totalPoints = 0;
    studentEnrolledCourses.forEach(c => {
      const prog = courseProgress[c.id] || 0;
      if (prog >= 95) totalPoints += 4.0;
      else if (prog >= 85) totalPoints += 3.8;
      else if (prog >= 75) totalPoints += 3.4;
      else if (prog >= 60) totalPoints += 3.0;
      else if (prog >= 45) totalPoints += 2.0;
      else totalPoints += 1.0;
    });
    return (totalPoints / studentEnrolledCourses.length).toFixed(2);
  };

  return (
    <div id="student-portal-wrapper" className="min-h-screen bg-slate-50 pt-20 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP STATUS HEADER PANEL */}
        <div id="student-identity-banner" className="bg-gradient-to-r from-slate-900 to-[#1e293b] text-white p-6 sm:p-10 rounded-3xl shadow-md border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#41b883]/15 rounded-full filter blur-3xl -z-1" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div id="student-profile-avatar" className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 backdrop-blur-md rounded-2xl border border-slate-700 flex items-center justify-center text-[#41b883]">
                <User className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#41b883] bg-[#41b883]/10 px-2.5 py-1 rounded-md inline-block">
                    Verified Student Desk
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block ${
                    dbStatus.connected ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/20' : 'bg-orange-500/25 text-orange-300 border border-orange-500/20'
                  }`}>
                    Cluster Connectivity: {dbStatus.connected ? 'Active Atlas' : 'Local Fallback'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{userProfile.name}</h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">{userProfile.email}</p>
              </div>
            </div>

            {/* University ID Badge */}
            <div id="registrar-id-badge" className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 px-5 py-4 rounded-2xl text-xs space-y-1.5 md:w-80">
              <div className="flex justify-between font-bold border-b border-slate-700 pb-1 text-[#41b883]">
                <span>TECHSKULL ACADEMICS</span>
                <span className="text-xs">SANDBOX ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-normal">Student ID</span>
                  <span className="font-mono text-white font-bold">{userProfile.studentId || "TS-2026-X812"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-normal">Major Division</span>
                  <span className="font-bold text-white truncate block">{userProfile.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ACTIVE NAVIGATION SIDEBAR BAR */}
          <div id="student-sidebar-deck" className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
              <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2">Student Navigation</h3>
              
              <ul className="space-y-1" id="student-nav-tabs">
                <li>
                  <button
                    id="tab-btn-enroll"
                    onClick={() => setActiveTab('enroll')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      activeTab === 'enroll' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    <span>Enroll in Courses</span>
                  </button>
                </li>
                <li>
                  <button
                    id="tab-btn-submit"
                    onClick={() => setActiveTab('submit')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      activeTab === 'submit' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-4.5 h-4.5" />
                    <span>Submit Assignment</span>
                  </button>
                </li>
                <li>
                  <button
                    id="tab-btn-grades"
                    onClick={() => setActiveTab('grades')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      activeTab === 'grades' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-4.5 h-4.5" />
                    <span>View Grades</span>
                  </button>
                </li>
                <li>
                  <button
                    id="tab-btn-github"
                    onClick={() => setActiveTab('github')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      activeTab === 'github' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Github className="w-4.5 h-4.5" />
                    <span>View GitHub Link</span>
                  </button>
                </li>
                <li>
                  <button
                    id="tab-btn-vercel"
                    onClick={() => setActiveTab('vercel')}
                    className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      activeTab === 'vercel' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-4.5 h-4.5" />
                    <span>View Vercel Link</span>
                  </button>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onLogout}
                  className="w-full text-center py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 font-bold text-xs rounded-xl transition-all"
                >
                  Terminate Session
                </button>
              </div>
            </div>

            {/* GPA MINI CONTAINER */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm text-center space-y-2">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Dynamic Cumulative GPA</span>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{calculateGPA()}</p>
              <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-[#41b883] rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((parseFloat(calculateGPA()) / 4.0) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block leading-tight">Calculated across {studentEnrolledCourses.length} active classes</span>
            </div>
          </div>

          {/* RIGHT COLUMN: SWITCHABLE TAB VIEWPORTS */}
          <div id="student-tab-viewport" className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: ENROLL IN COURSES */}
              {activeTab === 'enroll' && (
                <motion.div
                  key="enroll-view-pane"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Current Active Enrolments Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Current Academic Classes</h2>
                        <p className="text-xs text-slate-500">Manage your course curriculums and configure simulated study completion</p>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#41b883] bg-[#41b883]/10 px-3 py-1 rounded-full text-center">
                        Enrolled Units: {studentEnrolledCourses.length} Seminars
                      </span>
                    </div>

                    {studentEnrolledCourses.length > 0 ? (
                      <div className="space-y-5" id="enrolled-classes-list">
                        {studentEnrolledCourses.map(course => {
                          const prog = courseProgress[course.id] || 0;
                          return (
                            <div key={course.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4 hover:border-slate-300 transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{course.category}</span>
                                  <h4 className="font-extrabold text-slate-900 text-base">{course.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">{course.duration} duration span • Level: {course.level}</p>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
                                    prog >= 85 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    Simulated Grade: {getProgressGrade(prog)}
                                  </span>

                                  <button
                                    onClick={() => handleUnenrollDirectly(course.id)}
                                    className="p-2 border border-slate-200 hover:bg-orange-50 hover:text-orange-600 text-slate-400 rounded-lg transition-colors cursor-pointer"
                                    title="Unenroll Course"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Interactive range slider representing progress */}
                              <div className="space-y-1 pt-2 border-t border-slate-200/50">
                                <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                                  <span>Drag to simulate lecture progress:</span>
                                  <span className="font-mono font-bold text-slate-900">{prog}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="5"
                                  value={prog}
                                  onChange={(e) => handleProgressSliderChange(course.id, parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#41b883]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-4">
                        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
                        <div className="space-y-1">
                          <p className="font-bold text-slate-700">Not registered in any available credit block</p>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">Explore the catalog below to enroll inside specialized software modules.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enroll inside New Courses Selection Panel */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Explore Available Curriculum Seminars</h2>
                      <p className="text-xs text-slate-500">Sign up and reserve a seat to sync your milestones inside MongoDB</p>
                    </div>

                    {remainingOfferings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="available-classes-list">
                        {remainingOfferings.map(course => (
                          <div key={course.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-sm transition-all">
                            <div className="space-y-2">
                              <span className="text-[9px] font-bold text-[#41b883] bg-[#41b883]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {course.category}
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm leading-snug">{course.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{course.duration} • Rank #{course.rating}/5.0</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleEnrollDirectly(course.id)}
                              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                            >
                              Reserve Course Slot
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-xl">Congratulations! You have successfully enrolled in all university modules offered this semester.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SUBMIT ASSIGNMENT */}
              {activeTab === 'submit' && (
                <motion.div
                  key="submit-view-pane"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Assignment Upload Sandbox</h2>
                      <p className="text-xs text-slate-500">Dispatch assessment payloads. Successful submissions sync directly up to MongoDB</p>
                    </div>

                    {uploadFeedback && (
                      <div className="p-4 bg-emerald-50 border border-emerald-100/60 rounded-xl flex items-start space-x-3 text-emerald-800">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold">{uploadFeedback}</span>
                          <p className="mt-1 text-[11px] text-emerald-700">Course progress updated by +20% automatically as a milestone reward!</p>
                        </div>
                      </div>
                    )}

                    {studentEnrolledCourses.length > 0 ? (
                      <div className="space-y-5">
                        {/* Selector Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Target Enrolled Course</label>
                            <select
                              value={selectedCourseId}
                              onChange={(e) => setSelectedCourseId(e.target.value)}
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white shadow-sm"
                            >
                              {studentEnrolledCourses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Specific Assignment Review Slot</label>
                            <select
                              value={selectedAssignmentTask}
                              onChange={(e) => setSelectedAssignmentTask(e.target.value)}
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white shadow-sm"
                            >
                              <option value="Assignment 1: Fundamentals Lab Core review">Assignment 1: Fundamentals Lab Core review</option>
                              <option value="Assignment 2: Database architecture implementation">Assignment 2: Database architecture implementation</option>
                              <option value="Assignment 3: Cloud deployment testing suite">Assignment 3: Cloud deployment testing suite</option>
                              <option value="Capstone Assessment: Integrated production build project">Capstone Assessment: Integrated production build project</option>
                            </select>
                          </div>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                          id="file-drop-target"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={triggerFileInput}
                          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-[#41b883] bg-[#41b883]/5'
                              : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50/80'
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleManualFileChange}
                            className="hidden"
                          />
                          
                          <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                              <UploadCloud className="w-6 h-6 text-slate-700" />
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm font-bold text-slate-700">
                                Drag and drop your project ZIP or files here, or <span className="text-slate-900 underline font-semibold">browse files</span>
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-400">Supports PDF, ZIP, JS, TS, PY files up to 64MB securely</p>
                            </div>
                          </div>
                        </div>

                        {/* Upload Log list */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                           <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Submissions Registry (MongoDB synced)</h3>
                           {uploadedAssignments.length > 0 ? (
                             <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                               {uploadedAssignments.map(file => (
                                 <div key={file.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                                   <div className="flex items-center space-x-3">
                                     <div className="p-2 bg-white text-slate-500 rounded-lg border border-slate-100">
                                       <FileText className="w-4 h-4 text-[#41b883]" />
                                     </div>
                                     <div>
                                       <p className="font-bold text-slate-900">{file.fileName}</p>
                                       <p className="text-[10px] text-slate-500 font-medium">
                                         {file.courseTitle} • <span className="text-[#41b883] font-bold">{file.assignmentName}</span>
                                       </p>
                                       <p className="text-[9px] text-slate-400">Uploaded: {file.timestamp}</p>
                                     </div>
                                   </div>

                                   <button
                                     onClick={() => handleDeleteSubmission(file.id)}
                                     className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                     title="Remove Entry"
                                   >
                                     <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <p className="text-xs text-slate-400 italic">No submissions recorded for this account. Drop a project above to seed MongoDB collections.</p>
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">Enrolment required to access assignments</p>
                        <p className="text-[10px] text-slate-400 mt-1">Please head over to the &quot;Enroll in Courses&quot; tab to register.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: VIEW GRADES */}
              {activeTab === 'grades' && (
                <motion.div
                  key="grades-view-pane"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">Academic Scorecard & Grades</h2>
                      <p className="text-xs text-slate-500">Access grading reviews, instructor remarks, and official digital printable certifications</p>
                    </div>

                    {studentEnrolledCourses.length > 0 ? (
                      <div className="space-y-6">
                        {/* Summary Block */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Academic Performance Level</span>
                            <div className="my-2">
                              <span className="text-2xl font-black text-slate-900">{calculateGPA() === '4.00' ? 'Excellent (Summa Cum Laude)' : 'Satisfactory Progression'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">Class GPA value averages progress metrics across sessions</span>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between font-bold text-slate-500">
                            <div className="flex justify-between text-xs items-center">
                              <span>Acquired Degree Credits</span>
                              <span className="text-slate-900 font-extrabold">{studentEnrolledCourses.length * 3} ECTS</span>
                            </div>
                            <div className="relative h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                              <div 
                                className="absolute top-0 bottom-0 left-0 bg-[#41b883] rounded-full transition-all duration-300" 
                                style={{ width: `${(studentEnrolledCourses.length / 6) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal mt-2 block">Min requirement: 18 ECTS credits for graduation file audits</span>
                          </div>
                        </div>

                        {/* Enrolled Courses grades overview */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Seminar Modules Grade breakdown</h3>
                          <div className="space-y-3">
                            {studentEnrolledCourses.map(course => {
                              const prog = courseProgress[course.id] || 0;
                              const grade = getProgressGrade(prog);

                              return (
                                <div key={course.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{course.title}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Progress: {prog}%</span>
                                      <span className="text-[10px] text-slate-400">Term Credit: 3.0 ECTS</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                                    <div className="text-right">
                                      <span className="text-[9px] text-slate-400 font-bold block uppercase">MOCK GRADE</span>
                                      <span className="font-extrabold text-sm text-slate-900 leading-none">{grade}</span>
                                    </div>

                                    {prog === 100 ? (
                                      <button
                                        onClick={() => setViewingCertificateCourse(course)}
                                        className="px-3 py-1.5 bg-[#41b883]/10 hover:bg-[#41b883] text-[#22724d] hover:text-white rounded-lg font-bold text-[11px] flex items-center space-x-1.5 transition-all cursor-pointer"
                                      >
                                        <Award className="w-3.5 h-3.5 shrink-0" />
                                        <span>Download Certificate</span>
                                      </button>
                                    ) : (
                                      <div className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg font-semibold text-[10px]">
                                        {100 - prog}% to dynamic certificate
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Evaluated tasks results log */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Instructor Grading Reviews</h3>
                          {uploadedAssignments.filter(f => f.status === 'Graded').length > 0 ? (
                            <div className="space-y-3">
                              {uploadedAssignments.filter(f => f.status === 'Graded').map(f => (
                                <div key={f.id} className="p-4 rounded-xl border border-[#41b883]/20 bg-[#41b883]/5 space-y-1.5 text-xs">
                                  <div className="flex justify-between items-center font-bold">
                                    <span className="text-slate-900 text-sm">{f.courseTitle} - {f.assignmentName}</span>
                                    <span className="text-emerald-700 font-black bg-emerald-100 px-2.5 py-0.5 rounded text-xs">Evaluated Score: {f.grade}</span>
                                  </div>
                                  <p className="text-slate-600 font-medium">Instructor Reviewer Feedback:</p>
                                  <p className="italic text-slate-700 bg-white/70 p-2 rounded border border-slate-200/50 leading-relaxed font-semibold">
                                    &quot;{f.feedback}&quot;
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No submissions are graded yet this semester. Evaluator scores show here as soon as instructors submit grades.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-6 text-center bg-slate-50 rounded-xl">Register inside academic courses to generate graded score sheets.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: VIEW GITHUB LINK */}
              {activeTab === 'github' && (
                <motion.div
                  key="github-view-pane"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                      <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                        <Github className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">GitHub Workspace Integration</h2>
                        <p className="text-xs text-slate-500">Connect your personal GitHub account to sync homework repositories securely</p>
                      </div>
                    </div>

                    {linkSaveFeedback && (
                      <div className={`p-4 rounded-xl text-xs font-semibold ${
                        linkSaveFeedback.startsWith('Error') ? 'bg-orange-50 border border-orange-100 text-orange-850' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                      }`}>
                        {linkSaveFeedback}
                      </div>
                    )}

                    <div className="space-y-5">
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
                        <span className="text-[9px] font-bold text-[#41b883] uppercase block tracking-wider mb-2">Connected Target Repository URL</span>
                        
                        {userProfile.githubLink ? (
                          <div className="space-y-3">
                            <span className="font-mono text-sm block font-bold text-white tracking-tight break-all border-b border-white/10 pb-3">
                              {userProfile.githubLink}
                            </span>
                            <div className="flex flex-wrap gap-2 items-center">
                              <a
                                href={userProfile.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Explore Code Workspace</span>
                              </a>
                              <span className="text-[10px] text-[#41b883] font-black uppercase">● Connected & Synced to MongoDB</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-slate-300">No profile link securely bound to this academic user record. Supply your active landing repository below.</p>
                            <span className="text-[10px] text-orange-400 font-bold uppercase">✖ Pending Connection</span>
                          </div>
                        )}
                      </div>

                      {/* Input form */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-600 block">Configure/Update GitHub Profile or Project URL</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="url"
                            placeholder="e.g. https://github.com/oba6049_db_user"
                            value={tempGithubLink}
                            onChange={(e) => setTempGithubLink(e.target.value)}
                            className="flex-grow px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-500 shadow-sm"
                          />
                          <button
                            onClick={() => handleSaveSocialLink('github')}
                            className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow"
                          >
                            Sync Link inside MongoDB
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-450 block font-normal">Saves to the Student database document immediately upon connection trigger.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: VIEW VERCEL LINK */}
              {activeTab === 'vercel' && (
                <motion.div
                  key="vercel-view-pane"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                      <div className="p-2.5 bg-neutral-950 text-white rounded-xl">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">Vercel Deployment Node</h2>
                        <p className="text-xs text-slate-500">Host your student applications and projects live via modern CDN stacks</p>
                      </div>
                    </div>

                    {linkSaveFeedback && (
                      <div className={`p-4 rounded-xl text-xs font-semibold ${
                        linkSaveFeedback.startsWith('Error') ? 'bg-orange-50 border border-orange-100 text-orange-850' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'
                      }`}>
                        {linkSaveFeedback}
                      </div>
                    )}

                    <div className="space-y-5">
                      <div className="bg-neutral-950 text-neutral-100 p-5 rounded-2xl border border-neutral-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
                        <span className="text-[9px] font-bold text-orange-400 uppercase block tracking-wider mb-2">Active Production Nodes</span>
                        
                        {userProfile.vercelLink ? (
                          <div className="space-y-3">
                            <span className="font-mono text-sm block font-bold text-white tracking-tight break-all border-b border-neutral-800 pb-3">
                              {userProfile.vercelLink}
                            </span>
                            <div className="flex flex-wrap gap-2 items-center">
                              <a
                                href={userProfile.vercelLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Live Deployment</span>
                              </a>
                              <span className="text-[10px] text-emerald-405 font-black uppercase">● Node Status: SSL secured</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-neutral-400 font-medium">Link your active web applications to enable reviewers to launch your running projects with one-click.</p>
                            <span className="text-[10px] text-orange-400 font-bold uppercase">✖ No Live Deploy Node Connected</span>
                          </div>
                        )}
                      </div>

                      {/* Input form */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-600 block">Link Vercel App Deployment URL</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="url"
                            placeholder="e.g. https://techskull-student-portal.vercel.app"
                            value={tempVercelLink}
                            onChange={(e) => setTempVercelLink(e.target.value)}
                            className="flex-grow px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-500 shadow-sm"
                          />
                          <button
                            onClick={() => handleSaveSocialLink('vercel')}
                            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow"
                          >
                            Secure Link in MongoDB
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-450 block font-normal">Connects safely to the User profile table inside MongoDB.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* DYNAMIC DIGITAL CERTIFICATE PREVIEW MODAL */}
      <AnimatePresence>
        {viewingCertificateCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white max-w-2xl w-full p-8 sm:p-12 rounded-[2rem] shadow-2xl relative border-8 border-slate-200 overflow-hidden"
            >
              <div className="absolute inset-2 border-2 border-dashed border-slate-300 rounded-2xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100/10 pointer-events-none">
                <GraduationCap className="w-96 h-96" />
              </div>

              <div className="relative z-10 text-center space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-slate-900 mb-2">
                    <GraduationCap className="w-8 h-8 text-[#41b883]" />
                    <span className="font-sans font-black text-xl tracking-wider">TECHSKULL ACADEMY</span>
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-[#41b883] bg-[#41b883]/10 px-3.5 py-1.5 rounded-full uppercase">
                    OFFICIAL BOARD CERTIFICATE OF COMPLETION
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-400 tracking-wider font-extrabold uppercase">This dynamic document verifies that</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 border-b border-slate-200 pb-2 inline-block max-w-[80%] mx-auto font-sans leading-none">
                    {userProfile.name}
                  </h3>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <p className="text-xs text-slate-400 font-bold uppercase">Has successfully accomplished all academic criteria for</p>
                  <h4 className="text-lg sm:text-xl font-bold bg-slate-900 text-white py-2 px-4 rounded-xl shadow-md tracking-tight">
                    {viewingCertificateCourse.title}
                  </h4>
                  <p className="text-[11px] text-[#41b883] font-bold">Graduand Credit Allocation: 3 ECTS • Status: Summa Cum Laude</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 sm:pt-6 text-[10px] sm:text-xs">
                  <div className="text-center font-bold">
                    <p className="text-slate-400 font-normal underline">Verified by Registry</p>
                    <span className="font-mono text-slate-600 block pt-1">{userProfile.studentId || "TS-2026-X812"}</span>
                  </div>
                  <div className="text-center font-bold">
                    <p className="text-slate-400 font-normal underline">Date of Issuance</p>
                    <span className="text-slate-600 block pt-1">
                      {new Date().toISOString().substring(0, 10)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 pt-6 sm:pt-8">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Print File</span>
                  </button>
                  <button
                    onClick={() => setViewingCertificateCourse(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
