import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Teachers from './pages/Teachers'
import About from './pages/About'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/student/Dashboard'
import TeacherDashboard from './pages/teacher/Dashboard'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import CourseManager from './pages/admin/CourseManager'
import TeacherManager from './pages/admin/TeacherManager'
import NewsManager from './pages/admin/NewsManager'
import ContactList from './pages/admin/ContactList'

export default function App() {
  return (
    <Routes>
      {/* 前台页面 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="about" element={<About />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* 学生端 */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      {/* 教师端 */}
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

      {/* 管理员后台（隐藏入口，不链接到前台） */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<CourseManager />} />
        <Route path="teachers" element={<TeacherManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="contacts" element={<ContactList />} />
      </Route>
    </Routes>
  )
}
