-- ============================================
-- Phase 2: 多角色用户系统
-- ============================================

-- 1. 扩展 users 表
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';

-- 更新现有 admin 用户
UPDATE users SET role = 'admin' WHERE username = 'admin';

-- 2. 扩展 courses 表 — 关联教师
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_id INTEGER;

-- 3. 新建约课表
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
