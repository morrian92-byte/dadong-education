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
  name: string
  phone: string
  email: string
  message: string
}

// ========== 管理员 ==========
export interface AdminUser {
  id: number
  username: string
}

// ========== 登录 ==========
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AdminUser
}

// ========== 仪表盘统计 ==========
export interface DashboardStats {
  courses: number
  teachers: number
  news: number
  contacts: number
}
