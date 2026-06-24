import { Course, Feature, Testimonial } from './types';

export const POPULAR_COURSES: Course[] = [
  {
    id: 'web-dev',
    title: 'Modern Web Development',
    description: 'Learn HTML5, CSS3, ES6+ JavaScript, React, Tailwind, and full-stack architecture with production deployments.',
    duration: '12 Weeks',
    level: 'Beginner',
    category: 'Development',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'python-prog',
    title: 'Python Programming Essentials',
    description: 'Master core programming constructs, object-oriented principles, data structures, and algorithms using Python.',
    duration: '8 Weeks',
    level: 'Beginner',
    category: 'Programming',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cloud-comp',
    title: 'Cloud Computing & DevOps',
    description: 'Architecting and deploying secure applications on AWS, Google Cloud, Docker, Kubernetes, and modern CI/CD pipelines.',
    duration: '10 Weeks',
    level: 'Intermediate',
    category: 'Infrastructure',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Masterclass',
    description: 'User research, wireframing, high-fidelity mockups, typography, design systems, and modern prototyping in Figma.',
    duration: '6 Weeks',
    level: 'Beginner',
    category: 'Design',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Fundamentals',
    description: 'Understand network security, penetration testing, threat hunting, vulnerability scanning, and cryptographic basics.',
    duration: '10 Weeks',
    level: 'Intermediate',
    category: 'Security',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ai-machine-learning',
    title: 'Artificial Intelligence & ML',
    description: 'Introduction to neural networks, neural architectures, training cycles, deep learning libraries, and intelligent agents.',
    duration: '14 Weeks',
    level: 'Advanced',
    category: 'Data Science',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80'
  }
];

export const FEATURES: Feature[] = [
  {
    id: 'registration',
    title: 'Student Registration',
    description: 'Simple, secure verification and enrollment portal with personalized student ID generation.',
    iconName: 'UserCheck'
  },
  {
    id: 'enrollment',
    title: 'Course Enrollment',
    description: 'Real-time course search, seat tracking, direct prerequisites verification, and fast scheduler.',
    iconName: 'BookOpen'
  },
  {
    id: 'assignments',
    title: 'Assignment Submission',
    description: 'Intuitive file sharing, automated version tagging, plagiarism scanning, and proof-of-completion certificates.',
    iconName: 'UploadCloud'
  },
  {
    id: 'grades',
    title: 'Grade Tracking',
    description: 'Real-time GPA evaluation, instructor feedback portal, and performance metrics breakdown graphics.',
    iconName: 'TrendingUp'
  },
  {
    id: 'dashboard',
    title: 'Student Dashboard',
    description: 'A unified single-screen command center summarizing active schedules, upcoming quizzes, and notices.',
    iconName: 'LayoutDashboard'
  },
  {
    id: 'auth',
    title: 'Secure Authentication',
    description: 'Passkey capabilities, OAuth sync, session tokens, and strict student privilege protection policies.',
    iconName: 'ShieldAlert'
  }
];

export const TIMELINE_STEPS = [
  {
    step: '01',
    title: 'Create Account',
    description: 'Sign up with school credentials or private email to initiate verification.',
    iconName: 'UserPlus'
  },
  {
    step: '02',
    title: 'Complete Registration',
    description: 'Submit academic histories, personal details, and configure security parameters.',
    iconName: 'FileText'
  },
  {
    step: '03',
    title: 'Enroll in Courses',
    description: 'Browse general catalogue, review slots, and click to reserve course seats.',
    iconName: 'Bookmark'
  },
  {
    step: '04',
    title: 'Attend Classes',
    description: 'Access live video streams, code sandboxes, and download lecture slideshow study notes.',
    iconName: 'Tv'
  },
  {
    step: '05',
    title: 'Submit Assignments',
    description: 'Drag and drop assignments securely inside class folders to receive active feedback.',
    iconName: 'FileCode'
  },
  {
    step: '06',
    title: 'Receive Grades',
    description: 'Gain transparency into score cards, aggregate GPAs, and class performance quartiles.',
    iconName: 'Award'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    course: 'Modern Web Development',
    rating: 5,
    feedback: 'The student registration portal is unbelievably clean compared to our old university LMS portals. Submitting code assignments takes just seconds, and the charts let me monitor actual progress effortlessly!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test-2',
    name: 'Michael Chen',
    course: 'Artificial Intelligence & ML',
    rating: 5,
    feedback: 'TechSkull completely changed how I plan my semesters. Enrolling in courses was instant, and the real-time grade breakdowns helped me identify topics that required additional study guide review.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test-3',
    name: 'Emily Rodriguez',
    course: 'UI/UX Design Masterclass',
    rating: 5,
    feedback: 'Its responsive design is a lifesaver. I checked class progress and completed my cloud security verification right from my smartphone during terminal transit. Outstanding UI!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
  }
];

export const PORTAL_FEATURES = [
  {
    id: 'f-dashboard',
    title: 'Personal Student Dashboard',
    subtitle: 'Everything in one custom views cockpit',
    description: 'Track daily class agendas, upcoming project deadlines, and general campus news. Get a birds-eye overview of your entire academic profile in real-time, built with soft visual guides and lightweight controls.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-submission',
    title: 'Intuitive Assignment Submissions',
    subtitle: 'Upload homework with peace of mind',
    description: 'No more confusing threads or server cutoffs. Drag and drop PDF, ZIP code archives, or link GitHub repositories securely. Receive instant submission logs, version histories, and timestamp receipts directly.',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-grades',
    title: 'Grade & GPA Management',
    subtitle: 'Complete clarity in score allocations',
    description: 'Get immediate email/dashboard notifications as soon as grades are published. Look at exact rubric breakdowns, view instructor code comments, and project cumulative GPA requirements dynamically with interactive sliders.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-tracking',
    title: 'Course Progress Tracking',
    subtitle: 'Celebrate small milestones daily',
    description: 'Visual progress trackers highlight completed lectures, readings, and code labs. See how close you are to completing course syllabi, keeping you constantly motivated and aligned with course goals.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-certificates',
    title: 'Download verified Certificates',
    subtitle: 'Share your skills on professional networks',
    description: 'Earn cryptographic digital certificates upon course completion. Verify your badges instantly and link them directly on LinkedIn, resume profiles, or portfolios to stand out in early professional hiring rounds.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f-notifications',
    title: 'Urgent System Notifications',
    subtitle: 'Always stay ahead of classroom shifts',
    description: 'Configure real-time alerts for scheduling alterations, office hours bookings, emergency campus updates, or general feedback. Fully custom filters let you select exactly what signals reach your home feed.',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80'
  }
];
