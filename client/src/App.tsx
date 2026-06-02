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
      </Route>

      {/* 后台管理 */}
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
