-- Phase 3: 审批系统 + 约课协商
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS time_options TEXT DEFAULT '[]';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS selected_time TEXT DEFAULT '';

UPDATE users SET status = 'approved' WHERE role = 'admin';
