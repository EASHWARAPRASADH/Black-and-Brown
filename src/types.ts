export interface MenuItem {
  name: string;
  price: string | number;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  gender: 'men' | 'women';
  items: MenuItem[];
}

export interface ComboOffer {
  id: string;
  name: string;
  services: string[];
  price: number;
  originalPrice: number;
}

export interface Course {
  id: string;
  title: string;
  category: 'hair' | 'skin' | 'chemical' | 'business';
  duration: string;
  description: string;
  syllabus: string[];
  image?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  author: string;
  role: string;
  text: string;
  rating: number;
}

export interface BookingState {
  services: MenuItem[];
  comboId?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId?: string;
  date?: string;
  time?: string;
  stylist?: string;
}
