import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  ShieldCheck,
  Plus,
  Search,
  BookOpen,
  Users,
  Eye,
  CheckCircle,
  FileCode,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  UserPlus,
  Sparkles,
  Layers,
  ArrowRight,
  LogOut,
  Mail,
  Edit,
  ClipboardList,
  Trash2,
  Sliders,
  Award,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Course } from '../types';
import { POPULAR_COURSES } from '../data';

interface AdminDashboardViewProps {
  userProfile: {
    role: 'student' | 'admin';
    name: string;
    email: string;
    employeeId?: string;
    department: string;
  };
  onLogout: () => void;
}

interface SubmittedAssignment {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  courseTitle: string;
  assignmentName: string;
  fileName: string;
  submittedAt: string;
  status: 'Pending' | 'Graded';
  grade?: string;
  feedback?: string;
}

interface StudentUser {
  role: 'student';
  name: string;
  email: string;
  studentId: string;
  department: string;
  registeredCourses: string[];
  completedAssignments?: { [key: string]: { fileName: string; submittedAt: string } };
  githubLink?: string;
  vercelLink?: string;
}

export default function AdminDashboardView({
  userProfile,
  onLogout
}: AdminDashboardViewProps) {
  // Database connection monitoring status
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'Checking...' });

  // Core entities
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [submittedAssignments, setSubmittedAssignments] = useState<SubmittedAssignment[]>([]);

  // Selected student in View Total Students to inspect detail lists
  const [selectedInspectStudent, setSelectedInspectStudent] = useState<StudentUser | null>(null);

  // Tab state - Exactly as requested
  // Admin -> (Grade Student) | (View Total Students) | (Manage Courses) | (Manage Students)
  const [activeTab, setActiveTab] = useState<'grade' | 'total-students' | 'courses' | 'students'>('grade');

  // Search filter states
  const [courseSearch, setCourseSearch] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Course Add dialogue form states
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState('8 Weeks');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newCourseCategory, setNewCourseCategory] = useState('Development');
  const [newCourseRating, setNewCourseRating] = useState(4.8);
  const [newCourseImage, setNewCourseImage] = useState('https://images.unsplash.com/photo-1516116211223-5c359a36298a?auto=format&fit=crop&w=600&q=80');
  const [courseSuccessMsg, setCourseSuccessMsg] = useState('');

  // Grading task form states
  const [gradingAssignment, setGradingAssignment] = useState<SubmittedAssignment | null>(null);
  const [assignedGrade, setAssignedGrade] = useState('A');
  const [assignedFeedback, setAssignedFeedback] = useState('');

  // Student manual creation states
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science & Engineering');
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');

  // Student editing states
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentDept, setEditStudentDept] = useState('');
  const [editStudentId, setEditStudentId] = useState('');
  const [editStudentCourses, setEditStudentCourses] = useState<string[]>([]);

  // Deletion confirmation states (Avoiding window.confirm inside iframe)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentUser | null>(null);

  // Initial database records loading
  const loadDataFromBackend = async () => {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn('Backend database status check unreachable:', err);
    }

    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const list = await res.json();
        setCourses(list);
      }
    } catch (err) {
      console.warn('Failed to fetch courses list of syllabus:', err);
    }

    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const list = await res.json();
        setSubmittedAssignments(list);
      }
    } catch (err) {
      console.warn('Failed to fetch homework submissions catalog:', err);
    }

    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const list = await res.json();
        const studentList = list.filter((u: any) => u.role === 'student');
        setStudents(studentList);
      }
    } catch (err) {
      console.warn('Failed to retrieve student roster lists:', err);
    }
  };

  useEffect(() => {
    loadDataFromBackend();
  }, []);

  // Launch new Course handler
  const handleAddNewCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseDesc) return;

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDesc,
          duration: newCourseDuration,
          level: newCourseLevel,
          category: newCourseCategory,
          rating: newCourseRating,
          image: newCourseImage
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish new syllabus course.');
      }

      setCourses(prev => [data.course, ...prev]);
      setNewCourseTitle('');
      setNewCourseDesc('');
      setCourseSuccessMsg(`Database updated: successfully published "${data.course.title}" to catalog.`);
      setTimeout(() => setCourseSuccessMsg(''), 4500);
      setIsAddingCourse(false);
    } catch (err: any) {
      console.error('Course registration issue:', err);
    }
  };

  // Delete Course handler
  const handleDeleteCourse = (courseId: string) => {
    const found = courses.find(c => c.id === courseId);
    if (found) {
      setCourseToDelete(found);
    }
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    const courseId = courseToDelete.id;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        setCourseSuccessMsg(`Course "${courseToDelete.title}" successfully deleted from database.`);
        setTimeout(() => setCourseSuccessMsg(''), 4000);
      } else {
        throw new Error('Deletion failed.');
      }
    } catch (err: any) {
      console.error('Failed deleting course:', err);
    } finally {
      setCourseToDelete(null);
    }
  };

  // Manual student creation handler
  const handleAddNewStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          email: newStudentEmail,
          role: 'student',
          department: newStudentDept,
          studentId: newStudentId
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to draft student account profile.');
      }

      setStudents(prev => [...prev, data.user]);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentId('');
      setStudentSuccessMsg(`Student profile for "${data.user.name}" registered successfully.`);
      setTimeout(() => setStudentSuccessMsg(''), 4500);
      setIsAddingStudent(false);
    } catch (err: any) {
      alert(`Registration Error: ${err.message}`);
    }
  };

  // Student details update handler
  const handleUpdateStudentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const response = await fetch(`/api/users/${encodeURIComponent(editingStudent.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editStudentName,
          department: editStudentDept,
          studentId: editStudentId,
          registeredCourses: editStudentCourses
        })
      });
      if (response.ok) {
        setStudents(prev => prev.map(s => {
          if (s.email === editingStudent.email) {
            return {
              ...s,
              name: editStudentName,
              department: editStudentDept,
              studentId: editStudentId,
              registeredCourses: editStudentCourses
            };
          }
          return s;
        }));
        setEditingStudent(null);
        setStudentSuccessMsg('Student records successfully adjusted.');
        setTimeout(() => setStudentSuccessMsg(''), 4000);
        
        // Refresh details
        if (selectedInspectStudent && selectedInspectStudent.email === editingStudent.email) {
          setSelectedInspectStudent(prev => prev ? {
            ...prev,
            name: editStudentName,
            department: editStudentDept,
            studentId: editStudentId,
            registeredCourses: editStudentCourses
          } : null);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed updating database student details.');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Student deletion handler
  const handleDeleteStudent = (email: string) => {
    const found = students.find(s => s.email === email);
    if (found) {
      setStudentToDelete(found);
    }
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    const email = studentToDelete.email;

    try {
      const response = await fetch(`/api/users/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.email !== email));
        setStudentSuccessMsg(`Student profile for "${studentToDelete.name}" dropped successfully from active database.`);
        setTimeout(() => setStudentSuccessMsg(''), 4000);
        if (selectedInspectStudent && selectedInspectStudent.email === email) {
          setSelectedInspectStudent(null);
        }
      } else {
        throw new Error('Database removal rejected.');
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setStudentToDelete(null);
    }
  };

  // Submission grading handler
  const handleGradeSubmissionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment) return;

    try {
      const response = await fetch(`/api/submissions/${gradingAssignment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: assignedGrade,
          feedback: assignedFeedback
        })
      });
      if (!response.ok) {
        throw new Error('Failed to post grades.');
      }

      setSubmittedAssignments(prev =>
        prev.map(item => {
          if (item.id === gradingAssignment.id) {
            return {
              ...item,
              status: 'Graded',
              grade: assignedGrade,
              feedback: assignedFeedback
            };
          }
          return item;
        })
      );

      // Re-trigger student stats recalculation from server
      const resUsers = await fetch('/api/users');
      if (resUsers.ok) {
        const list = await resUsers.json();
        const studentList = list.filter((u: any) => u.role === 'student');
        setStudents(studentList);
      }

      setGradingAssignment(null);
      setAssignedFeedback('');
      setAssignedGrade('A');
    } catch (err) {
      console.error(err);
    }
  };

  // Filters
  const filteredSubmissions = submittedAssignments.filter(sub =>
    sub.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
    sub.courseTitle.toLowerCase().includes(submissionSearch.toLowerCase()) ||
    sub.assignmentName.toLowerCase().includes(submissionSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Statistics summaries
  const totalSubmissionsPendingCount = submittedAssignments.filter(s => s.status === 'Pending').length;

  // Render course list helper for checklists
  const toggleCourseInStudentEdit = (id: string) => {
    setEditStudentCourses(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 mt-16 font-sans" id="admin-workspace-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP STATUS HEADER PANEL */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md relative overflow-hidden" id="admin-top-panel">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#13294B]/10 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#41B883]/10 rounded-full filter blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#13294B]/10 text-[#13294B] rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#41B883]" />
                <span>Faculty Administrative Desk</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#13294B] tracking-tight">
                Welcome back, {userProfile.name}
              </h1>
              <p className="text-gray-500 font-medium text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Session Authorized as registrar • <span className="font-bold text-[#13294B]">{userProfile.department}</span>
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  dbStatus.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  MongoDB: {dbStatus.connected ? 'Cloud Cluster Active' : 'Offline JSON Sync'}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="block text-xs text-gray-400 font-semibold uppercase">Institutional ID</span>
                <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {userProfile.employeeId || 'ADM-2026-6101'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Term Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic cumulative widgets for Admin */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" id="bento-statistics-grid">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="p-3 w-11 h-11 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <ClipboardList className="w-5 h-5" />
            </span>
            <div>
              <span className="block text-2xl font-extrabold text-[#13294B]">
                {totalSubmissionsPendingCount} Pending
              </span>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Submissions to Grade</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="p-3 w-11 h-11 flex items-center justify-center rounded-2xl bg-[#41B883]/10 text-[#41B883]">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <span className="block text-2xl font-extrabold text-[#13294B]">
                {students.length} Registered
              </span>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Students</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="p-3 w-11 h-11 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="block text-2xl font-extrabold text-[#13294B]">
                {courses.length} Classes
              </span>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Live Syllabus Catalog</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <span className="p-3 w-11 h-11 flex items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <span className="block text-2xl font-extrabold text-[#13294B]">
                {students.length > 0 ? (students.reduce((acc, s) => acc + (s.registeredCourses?.length || 0), 0) / students.length).toFixed(1) : '0.0'} Enrolled
              </span>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Average Courses per Student</span>
            </div>
          </div>
        </div>

        {/* MAIN PANEL CONTENT CONTROLLED BY TABS */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* REQUIRED TAB MENU BAR */}
          <div className="flex flex-wrap border-b border-gray-100 bg-slate-50/70 p-2 gap-2" id="admin-main-navigation-tabs">
            <button
              onClick={() => { setActiveTab('grade'); setSelectedInspectStudent(null); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'grade'
                  ? 'bg-white text-[#13294B] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-[#13294B] hover:bg-white/50'
              }`}
              id="admin-tab-grade"
            >
              <ClipboardList className="w-4 h-4 text-[#41B883]" />
              <span>Grade Student</span>
              {totalSubmissionsPendingCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-orange-500 text-white font-black text-[9px] rounded-full">
                  {totalSubmissionsPendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('total-students'); setSelectedInspectStudent(null); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'total-students'
                  ? 'bg-white text-[#13294B] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-[#13294B] hover:bg-white/50'
              }`}
              id="admin-tab-total-students"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>View Total Students</span>
            </button>

            <button
              onClick={() => { setActiveTab('courses'); setSelectedInspectStudent(null); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-white text-[#13294B] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-[#13294B] hover:bg-white/50'
              }`}
              id="admin-tab-manage-courses"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Manage Courses</span>
            </button>

            <button
              onClick={() => { setActiveTab('students'); setSelectedInspectStudent(null); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-white text-[#13294B] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-[#13294B] hover:bg-white/50'
              }`}
              id="admin-tab-manage-students"
            >
              <Sliders className="w-4 h-4 text-violet-600" />
              <span>Manage Students</span>
            </button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: GRADE STUDENT */}
              {activeTab === 'grade' && (
                <motion.div
                  key="tab-pane-grade"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#13294B]">Verify & Grade Student Lab Submissions</h3>
                      <p className="text-xs text-gray-500 font-medium">Verify code file packages submitted by students and record grades into MongoDB Atlas.</p>
                    </div>

                    <div className="relative w-full sm:w-80">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search student submit files or course categories..."
                        value={submissionSearch}
                        onChange={(e) => setSubmissionSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 outline-none rounded-xl text-xs bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-gray-500 border-b border-gray-100 font-bold">
                          <th className="p-4">Student Contributor & ID</th>
                          <th className="p-4">Assigned Course Module</th>
                          <th className="p-4">Lab File Payload</th>
                          <th className="p-4">Submission Date</th>
                          <th className="p-4">Grading Score Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-gray-400 font-semibold">
                              No submissions found matching criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredSubmissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-[#13294B]">{sub.studentName}</div>
                                <div className="text-[10px] text-gray-400 font-mono font-bold uppercase">{sub.studentId} • {sub.studentEmail}</div>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold text-gray-700">{sub.courseTitle}</span>
                              </td>
                              <td className="p-4">
                                <div className="font-medium text-gray-800 leading-tight">{sub.assignmentName}</div>
                                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 bg-slate-100 px-1.5 py-0.5 rounded w-max">
                                  <FileCode className="w-3.5 h-3.5 text-[#13294B]" />
                                  <span>{sub.fileName}</span>
                                </div>
                              </td>
                              <td className="p-4 font-mono text-gray-500 font-medium">{sub.submittedAt}</td>
                              <td className="p-4">
                                {sub.status === 'Graded' ? (
                                  <div className="space-y-0.5">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px] border border-emerald-100">
                                      <CheckCircle className="w-3 h-3" />
                                      Graded
                                    </span>
                                    <div className="text-[10px] text-[#13294B] font-bold">Grade: <span className="text-[#41b883] font-black">{sub.grade}</span></div>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-bold text-[10px] border border-amber-100">
                                    <AlertCircle className="w-3 h-3" />
                                    Pending Review
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                {sub.status === 'Pending' ? (
                                  <button
                                    onClick={() => setGradingAssignment(sub)}
                                    className="px-3.5 py-1.5 bg-[#13294B] hover:bg-slate-800 text-white rounded-lg font-bold transition-all text-[11px]"
                                  >
                                    Evaluate Task
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setAssignedGrade(sub.grade || 'A');
                                      setAssignedFeedback(sub.feedback || '');
                                      setGradingAssignment(sub);
                                    }}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-600 rounded-lg font-bold transition-all text-[11px]"
                                  >
                                    Revise Grade
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: VIEW TOTAL STUDENTS */}
              {activeTab === 'total-students' && (
                <motion.div
                  key="tab-pane-total-students"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#13294B]">Academics Registrations & Student Distribution</h3>
                      <p className="text-xs text-gray-500 font-medium">Verify overall student records, study progress distributions, and enrollment sizes.</p>
                    </div>

                    <div className="relative w-full sm:w-85">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search student ledger logs by name, major, or email..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 outline-none rounded-xl text-xs bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {studentSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                      <span>{studentSuccessMsg}</span>
                    </div>
                  )}

                  {/* SPLIT GRID FOR GENERAL OVERVIEW AND INSPECT DRILLDOWN */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT AREA: Student Ledger list */}
                    <div className={selectedInspectStudent ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
                      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-gray-500 border-b border-gray-100 font-bold">
                              <th className="p-4">Student Profile</th>
                              <th className="p-4">Department & division</th>
                              <th className="p-4 text-center">Classes Enrolled</th>
                              <th className="p-4 text-center">Task Submissions</th>
                              <th className="p-4 text-right">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center p-8 text-gray-400 italic">No registered student records found.</td>
                              </tr>
                            ) : (
                              filteredStudents.map((student) => (
                                <tr 
                                  key={student.email} 
                                  className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                                    selectedInspectStudent?.email === student.email ? 'bg-[#41b883]/5 hover:bg-[#41b883]/10' : ''
                                  }`}
                                  onClick={() => setSelectedInspectStudent(student)}
                                >
                                  <td className="p-4">
                                    <div className="flex items-center gap-2.5">
                                      <span className="w-8 h-8 rounded-xl bg-[#13294B]/10 text-[#13294B] font-bold text-xs flex items-center justify-center border border-[#13294B]/10">
                                        {student.name.charAt(0).toUpperCase()}
                                      </span>
                                      <div>
                                        <div className="font-bold text-[#13294B]">{student.name}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">{student.studentId || "No ID Recorded"}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="font-semibold text-gray-600 block max-w-[150px] truncate">{student.department}</span>
                                    <span className="text-[10px] text-gray-400 block font-medium">{student.email}</span>
                                  </td>
                                  <td className="p-4 text-center font-bold text-indigo-700">
                                    {student.registeredCourses ? student.registeredCourses.length : 0}
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {student.completedAssignments ? Object.keys(student.completedAssignments).length : 0} items
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button
                                      type="button"
                                      className="p-1 px-2.5 bg-slate-150 hover:bg-slate-200 text-[#13294B] rounded-lg font-bold text-[10px] transition-all"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedInspectStudent(student);
                                      }}
                                    >
                                      Inspect View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* RIGHT AREA: Expanded inspecting pane */}
                    {selectedInspectStudent && (
                      <div className="lg:col-span-5 bg-slate-50 border border-gray-150 p-6 rounded-3xl space-y-6 relative">
                        <button
                          onClick={() => setSelectedInspectStudent(null)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-sm"
                        >
                          ✕
                        </button>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
                            <div className="w-12 h-12 bg-[#13294B] text-white flex items-center justify-center font-black rounded-2xl text-lg">
                              {selectedInspectStudent.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 text-base">{selectedInspectStudent.name}</h4>
                              <p className="text-xs text-gray-500 font-medium">{selectedInspectStudent.department}</p>
                              <p className="text-[10px] text-gray-400 font-mono font-bold uppercase">{selectedInspectStudent.studentId}</p>
                            </div>
                          </div>

                          {/* Inspect Submissions checklist */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Class Enrolments & Syllabus status</span>
                            {selectedInspectStudent.registeredCourses && selectedInspectStudent.registeredCourses.length > 0 ? (
                              <div className="space-y-2">
                                {selectedInspectStudent.registeredCourses.map(cId => {
                                  const matchingC = courses.find(cr => cr.id === cId);
                                  const submitted = selectedInspectStudent.completedAssignments && selectedInspectStudent.completedAssignments[cId];
                                  return (
                                    <div key={cId} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs hover:shadow-xs transition-shadow">
                                      <div>
                                        <p className="font-bold text-gray-900">{matchingC ? matchingC.title : cId}</p>
                                        <p className="text-[10px] text-[#41b883] font-bold uppercase">{matchingC ? matchingC.category : 'General'}</p>
                                      </div>
                                      
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        submitted ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-gray-500'
                                      }`}>
                                        {submitted ? 'Checked/Completed' : 'Study Phase'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No courses currently mapped to this student user.</p>
                            )}
                          </div>

                          {/* Social integrations verify */}
                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Connected portfolios & work</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-white p-2.5 rounded-xl border border-gray-150">
                                <span className="text-gray-400 text-[10px] block font-bold">GitHub Space</span>
                                {selectedInspectStudent.githubLink ? (
                                  <a 
                                    href={selectedInspectStudent.githubLink}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-indigo-600 hover:underline font-bold break-all flex items-center gap-1 mt-0.5"
                                  >
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                    <span>Workspace</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-400 block font-normal">Unconnected</span>
                                )}
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-gray-150">
                                <span className="text-gray-400 text-[10px] block font-bold">Vercel Deployment URL</span>
                                {selectedInspectStudent.vercelLink ? (
                                  <a 
                                    href={selectedInspectStudent.vercelLink}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-emerald-700 hover:underline font-bold break-all flex items-center gap-1 mt-0.5"
                                  >
                                    <Globe className="w-3 h-3 shrink-0" />
                                    <span>Review Deploy</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-400 block font-normal">Unconnected</span>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}

              {/* TAB 3: MANAGE COURSES */}
              {activeTab === 'courses' && (
                <motion.div
                  key="tab-pane-courses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#13294B]">Academics Syllabus Catalog</h3>
                      <p className="text-xs text-gray-500 font-medium">Configure course catalog items available for student registration and milestone progress simulations.</p>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button
                        onClick={() => setIsAddingCourse(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#13294B] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#41B883]" />
                        <span>Add New Course</span>
                      </button>

                      <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                          <Search className="w-4.5 h-4.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search by title or category..."
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 outline-none rounded-xl bg-slate-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {courseSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                      <span>{courseSuccessMsg}</span>
                    </div>
                  )}

                  {/* Course Grid view with interactive actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div key={course.id} className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-[#13294B]/20 transition-all duration-300">
                        <div>
                          <div className="h-44 relative overflow-hidden bg-slate-150">
                            <img
                              src={course.image}
                              alt={course.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#13294B]/90 text-white rounded-md text-[10px] font-bold">
                              {course.level}
                            </span>
                          </div>

                          <div className="p-5 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[#41B883] font-black uppercase tracking-widest">{course.category}</span>
                              <span className="font-mono text-[9px] text-gray-400 uppercase font-bold">{course.duration}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 leading-snug text-base">{course.title}</h4>
                            <p className="text-gray-500 text-xs line-clamp-3">{course.description}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-slate-50/50">
                          <div className="flex items-center gap-1 font-bold text-xs text-slate-800">
                            <span>★</span>
                            <span>{course.rating.toFixed(1)}</span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1 px-3 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg font-bold text-[10px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                            title="Delete Syllabus Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: MANAGE STUDENTS */}
              {activeTab === 'students' && (
                <motion.div
                  key="tab-pane-manage-students"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#13294B]">Manage Student Academic Records</h3>
                      <p className="text-xs text-gray-500 font-medium">Manually draft profiles, adjust major departments, or enroll them in modules.</p>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button
                        onClick={() => setIsAddingStudent(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#13294B] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                        id="admin-btn-add-student"
                      >
                        <UserPlus className="w-4.5 h-4.5 text-[#41B883]" />
                        <span>Add New Student</span>
                      </button>

                      <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                          <Search className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search student ledger logs..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 outline-none rounded-xl bg-slate-50 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {studentSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                      <span>{studentSuccessMsg}</span>
                    </div>
                  )}

                  {/* Student Records List for Management */}
                  <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-gray-500 border-b border-gray-150 font-bold">
                          <th className="p-4">Student Profile Name</th>
                          <th className="p-4">Credentials & Student ID</th>
                          <th className="p-4">Department / Program Major</th>
                          <th className="p-4">Courses Registry</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Administrative Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-8 text-gray-400 italic">No registered student records available.</td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr key={student.email} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center border border-indigo-100">
                                    {student.name.charAt(0).toUpperCase()}
                                  </span>
                                  <div>
                                    <div className="font-extrabold text-[#13294B] text-sm">{student.name}</div>
                                    <div className="text-[10px] text-gray-400 leading-none mt-0.5">Joined via platform registries</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-mono font-bold text-gray-800 text-[11px]">{student.studentId || "No ID Saved"}</div>
                                <div className="text-[10px] text-slate-500 font-medium">{student.email}</div>
                              </td>
                              <td className="p-4 font-semibold text-gray-650">{student.department}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {student.registeredCourses && student.registeredCourses.map(cId => {
                                    const c = courses.find(cr => cr.id === cId);
                                    return (
                                      <span key={cId} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold" title={c ? c.title : cId}>
                                        {cId}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-55 text-emerald-800 text-[10px] font-black border border-emerald-100">
                                  Active Verified
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditStudentName(student.name);
                                    setEditStudentDept(student.department);
                                    setEditStudentId(student.studentId || '');
                                    setEditStudentCourses(student.registeredCourses || []);
                                    setEditingStudent(student);
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#13294B] rounded-lg font-bold text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Adjust</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(student.email)}
                                  className="p-1.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Drop Record</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* MODAL 1: GRADING TASK MODAL */}
      <AnimatePresence>
        {gradingAssignment && (
          <div className="fixed inset-0 bg-[#13294B]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-2xl w-full max-w-lg space-y-6"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#41b883]/10 text-[#41b883] rounded-lg">
                    <ClipboardList className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-[#13294B]">Grade Student Assignment Lab</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-gray-100">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">Assigned Student Profile</span>
                    <span className="font-extrabold text-[#13294B] text-sm">{gradingAssignment.studentName} ({gradingAssignment.studentId})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/50">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 font-bold block">Course Name</span>
                      <span className="font-semibold text-gray-700">{gradingAssignment.courseTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 font-bold block">Target Lab Task</span>
                      <span className="font-semibold text-gray-700">{gradingAssignment.assignmentName}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200/50 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold">Attached Deliverable:</span>
                    <span className="font-mono text-[10px] text-[#41B883] font-bold bg-[#41B883]/10 px-2 py-0.5 rounded-md">
                      {gradingAssignment.fileName}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleGradeSubmissionSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Performance Grade Tiers</label>
                    <select
                      value={assignedGrade}
                      onChange={(e) => setAssignedGrade(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#41B883] outline-none font-bold bg-white text-xs"
                    >
                      <option value="A+">A+ (Distinguished Achievement, Full Lab Checked)</option>
                      <option value="A">A (Excellent performance, Exceeds constraints)</option>
                      <option value="B+">B+ (Good performance, minor code spacing/variable adjustments)</option>
                      <option value="B">B (Satisfactory core logic pass)</option>
                      <option value="C">C (Passable with major recommendations to refine)</option>
                      <option value="D">D (Required high degree of assistance)</option>
                      <option value="F">F (Resubmission required)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Instructor Evaluation Feedback</label>
                    <textarea
                      placeholder="Add detailed remarks stating key improvements for student coding practices..."
                      rows={4}
                      value={assignedFeedback}
                      onChange={(e) => setAssignedFeedback(e.target.value)}
                      className="w-full p-3 text-xs border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setGradingAssignment(null)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold rounded-xl transition-colors text-center text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#13294B] hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-center text-xs"
                    >
                      Publish Grades
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LAUNCH NEW COURSE MODAL */}
      <AnimatePresence>
        {isAddingCourse && (
          <div className="fixed inset-0 bg-[#13294B]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-155 shadow-2xl w-full max-w-lg space-y-5"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-[#13294B]">Launch New Academic Course</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCourse(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewCourse} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#13294B]">Course Slogan Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kotlin & Android Fundamentals"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#13294B]">Syllabus direct descriptions</label>
                  <textarea
                    required
                    placeholder="Syllabus overview, curriculum roadmap covered during execution..."
                    rows={3}
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-35">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Calendar Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Weeks"
                      value={newCourseDuration}
                      onChange={(e) => setNewCourseDuration(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none size-fit"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Level Classification</label>
                    <select
                      value={newCourseLevel}
                      onChange={(e) => setNewCourseLevel(e.target.value as any)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none bg-white font-semibold"
                    >
                      <option value="Beginner">Beginner Level</option>
                      <option value="Intermediate">Intermediate Level</option>
                      <option value="Advanced">Advanced Level</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Subject Category</label>
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none bg-white"
                    >
                      <option value="Development">Development</option>
                      <option value="Programming">Programming</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Design">Design</option>
                      <option value="Security">Security</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Syllabus Image Cover URL</label>
                    <input
                      type="text"
                      placeholder="Banner cover path URL"
                      value={newCourseImage}
                      onChange={(e) => setNewCourseImage(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCourse(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-650 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Publish Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ADD NEW STUDENT MODAL */}
      <AnimatePresence>
        {isAddingStudent && (
          <div className="fixed inset-0 bg-[#13294B]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-2xl w-full max-w-lg space-y-5"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <UserPlus className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-[#13294B]">Manually Draft Student Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewStudent} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#13294B]">Student Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Richard Hendricks"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#13294B]">Institutional Credentials Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. hendricks@polytech.edu"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Student Matricule ID</label>
                    <input
                      type="text"
                      placeholder="e.g. TS-2026-9041"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Program Department Division</label>
                    <select
                      value={newStudentDept}
                      onChange={(e) => setNewStudentDept(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none bg-white font-semibold"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Security">Information Security</option>
                      <option value="Information Design & Human Experience">Information Design & Human Experience</option>
                      <option value="Advanced Neural Networks & Models">Advanced Neural Networks & Models</option>
                      <option value="Cybernetics & Robotics">Cybernetics & Robotics</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-gray-500">
                  <span className="font-bold text-gray-700 block mb-1">Sandbox Accounts Note:</span>
                  Students manually registered via the Administrative Desk are initialized with standard credentials login password <span className="font-mono font-bold text-indigo-700">WelcomeTS2026</span> can login immediately.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingStudent(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-650 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Draft Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: ADJUST/EDIT STUDENT MODAL */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 bg-[#13294B]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-2xl w-full max-w-lg space-y-5"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Edit className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-[#13294B]">Adjust Student Mappings</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="text-gray-400 hover:text-gray-650 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStudentSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#13294B]">Student Name Record</label>
                  <input
                    type="text"
                    required
                    value={editStudentName}
                    onChange={(e) => setEditStudentName(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#41B883]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Department Major Division</label>
                    <select
                      value={editStudentDept}
                      onChange={(e) => setEditStudentDept(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none bg-white font-semibold"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Security">Information Security</option>
                      <option value="Information Design & Human Experience">Information Design & Human Experience</option>
                      <option value="Advanced Neural Networks & Models">Advanced Neural Networks & Models</option>
                      <option value="Cybernetics & Robotics">Cybernetics & Robotics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#13294B]">Matricule Stamp ID</label>
                    <input
                      type="text"
                      required
                      value={editStudentId}
                      onChange={(e) => setEditStudentId(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                {/* Course Enrollments checklists */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-700 block mb-1">Enrolled Courses Checklist</span>
                  <div className="bg-slate-50 rounded-xl border border-gray-150 p-3.5 space-y-2 max-h-40 overflow-y-auto">
                    {courses.map(course => {
                      const active = editStudentCourses.includes(course.id);
                      return (
                        <label key={course.id} className="flex items-start gap-2.5 cursor-pointer text-slate-700 selection:bg-transparent">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleCourseInStudentEdit(course.id)}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                          />
                          <div>
                            <span className="font-bold text-slate-800 text-xs block leading-tight">{course.title}</span>
                            <span className="text-[10px] text-gray-400 block font-normal capitalize">{course.category} • {course.level}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-650 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    Authorize Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Custom Course Deletion Confirmation Modal */}
        {courseToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-150 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-650">
                <div className="p-2.5 bg-red-50 rounded-2xl">
                  <Trash2 className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Delete Syllabus Course?</h4>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase font-mono">{courseToDelete.id}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 text-xs leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-gray-800">"{courseToDelete.title}"</span> from the public syllabus list? This will remove it from the catalog.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseToDelete(null)}
                  className="flex-1 py-1 px-4 text-xs font-bold text-gray-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCourse}
                  className="flex-1 py-1 px-4 text-xs font-bold text-white bg-red-650 hover:bg-red-700 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Yes, Delete Course
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Custom Student Deletion Confirmation Modal */}
        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-150 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-650">
                <div className="p-2.5 bg-red-50 rounded-2xl">
                  <Trash2 className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#13294B] text-sm">Drop Student Profile?</h4>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase font-mono">{studentToDelete.studentId || 'No ID'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-xs leading-relaxed">
                  Are you absolutely sure you want to delete the student profile for <span className="font-bold text-gray-800">"{studentToDelete.name}"</span> ({studentToDelete.email})? This action cannot be reverted.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStudentToDelete(null)}
                  className="flex-1 py-2 text-xs font-bold text-gray-650 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteStudent}
                  className="flex-1 py-2 text-xs font-bold text-white bg-red-650 hover:bg-red-700 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Yes, Drop Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
