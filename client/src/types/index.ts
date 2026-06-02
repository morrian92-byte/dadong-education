// ========== 用户 ==========
export type UserRole = 'admin' | 'teacher' | 'student'

export interface UserInfo {
  id: number
  username: string
  role: UserRole
  name?: string
  phone?: string
}

// ========== 课程 ==========
export interface Course {
  id: number
  title: string
  category: string
  description: string
  outline: string
  price: string
  image: string
  featured: boolean
  teacher_id?: number
  created_at: string
  updated_at: string
}

// ========== 教师 ==========
export interface Teacher {
  id: number
  name: string
  title: string
  bio: string
  avatar: string
  specialties: string
  created_at: string
}

// ========== 新闻 ==========
export interface News {
  id: number
  title: string
  summary: string
  content: string
  cover_image: string
  published_at: string
  created_at: string
}

// ========== 联系表单 ==========
export interface ContactForm {
  id?: number
  name: string
  phone: string
  email: string
  message: string
  created_at?: string
}

// ========== 登录/注册 ==========
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  name: string
  phone: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

// ========== 约课 ==========
export interface Booking {
  id: number
  student_id: number
  course_id: number
  teacher_id: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  message: string
  created_at: string
  course?: { id: number; title: string; category: string }
  student?: { id: number; username: string; phone: string }
  teacher?: { id: number; username: string }
}

// ========== 仪表盘统计 ==========
export interface DashboardStats {
  courses: number
  teachers: number
  news: number
  contacts: number
  bookings: number
}
