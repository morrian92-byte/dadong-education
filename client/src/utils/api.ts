import axios from 'axios'
import type {
  Course, Teacher, News, ContactForm,
  LoginRequest, RegisterRequest, LoginResponse,
  Booking, DashboardStats,
} from '../types'

const api = axios.create({ baseURL: '/api', timeout: 10000 })

// 请求拦截器 — 自动附带 JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器 — 401 清除 token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(err)
  }
)

// ============ 认证 API ============
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) =>
    api.post<LoginResponse>('/auth/register', data),
  adminLogin: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/admin-login', data),
}

// ============ 课程 API ============
export const coursesApi = {
  getAll: (params?: { category?: string; featured?: boolean }) =>
    api.get<Course[]>('/courses', { params }),
  getById: (id: number) =>
    api.get<Course>(`/courses/${id}`),
  create: (data: Partial<Course>) =>
    api.post<Course>('/courses', data),
  update: (id: number, data: Partial<Course>) =>
    api.put<Course>(`/courses/${id}`, data),
  delete: (id: number) =>
    api.delete(`/courses/${id}`),
}

// ============ 教师 API ============
export const teachersApi = {
  getAll: () => api.get<Teacher[]>('/teachers'),
  getById: (id: number) => api.get<Teacher>(`/teachers/${id}`),
  create: (data: Partial<Teacher>) => api.post<Teacher>('/teachers', data),
  update: (id: number, data: Partial<Teacher>) => api.put<Teacher>(`/teachers/${id}`, data),
  delete: (id: number) => api.delete(`/teachers/${id}`),
}

// ============ 新闻 API ============
export const newsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<{ news: News[]; total: number }>('/news', { params }),
  getById: (id: number) => api.get<News>(`/news/${id}`),
  create: (data: Partial<News>) => api.post<News>('/news', data),
  update: (id: number, data: Partial<News>) => api.put<News>(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
}

// ============ 联系表单 API ============
export const contactApi = {
  submit: (data: ContactForm) => api.post('/contact', data),
  getAll: () => api.get<ContactForm[]>('/contact'),
  delete: (id: number) => api.delete(`/contact/${id}`),
}

// ============ 约课 API（学生 + 教师共用）============
export const bookingsApi = {
  // 学生：我的约课
  myBookings: () => api.get<Booking[]>('/student/bookings'),
  // 学生：预约课程
  book: (course_id: number, teacher_id: number, message?: string) =>
    api.post<Booking>('/student/book', { course_id, teacher_id, message }),
  // 学生：取消约课
  cancel: (id: number) => api.delete(`/student/bookings/${id}`),
  // 老师：查看学生约课
  teacherBookings: () => api.get<Booking[]>('/teacher/bookings'),
  // 老师：审批
  review: (id: number, status: 'approved' | 'rejected') =>
    api.put<Booking>(`/teacher/bookings/${id}`, { status }),
}

// ============ 仪表盘 API ============
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
}
