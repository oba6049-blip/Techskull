export type ViewState = 
  | 'home' 
  | 'courses' 
  | 'about' 
  | 'features' 
  | 'testimonials' 
  | 'contact' 
  | 'login' 
  | 'register' 
  | 'dashboard';

export interface Course {
  id: string;
  image: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  rating: number;
  feedback: string;
  avatar: string;
}

export interface StudentProgress {
  id: string;
  courseTitle: string;
  progress: number;
  grade: string;
  lastActive: string;
}
