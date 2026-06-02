import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { getSupabase } from '../lib/supabase.js'

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors() },
  })
}

// ============ JWT ============

async function signToken(payload, secret) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d').sign(new TextEncoder().encode(secret))
}

async function verifyToken(token, secret) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
  return payload
}

async function requireAuth(request, env, allowedRoles) {
  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Bearer ')) return null
  try {
    const payload = await verifyToken(header.split(' ')[1], env.JWT_SECRET || 'secret')
    if (allowedRoles && !allowedRoles.includes(payload.role)) return null
    return payload
  } catch { return null }
}

// ============ Phase 3：注册（含审批）============

async function register(request, env, role) {
  const { username, password, name, phone } = await request.json()
  if (!username || !password) return json({ error: '请输入用户名和密码' }, 400)
  if (!name) return json({ error: '请输入姓名' }, 400)

  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('users').select('id').eq('username', username).maybeSingle()
  if (existing) return json({ error: '用户名已存在' }, 409)

  const hash = bcrypt.hashSync(password, 10)
  const { error } = await supabase.from('users').insert({
    username, password_hash: hash, role, phone: phone || '', email: '', status: 'pending',
  })

  if (error) return json({ error: error.message }, 500)
  return json({ message: '注册成功，请等待管理员审批' }, 201)
}

async function login(request, env) {
  const { username, password } = await request.json()
  if (!username || !password) return json({ error: '请输入用户名和密码' }, 400)

  const supabase = getSupabase(env)
  const { data: user } = await supabase.from('users').select('*').eq('username', username).maybeSingle()
  if (!user || user.role === 'admin') return json({ error: '用户名或密码错误' }, 401)
  if (!bcrypt.compareSync(password, user.password_hash)) return json({ error: '用户名或密码错误' }, 401)
  if (user.status !== 'approved') return json({ error: '账号尚未通过审批，请联系管理员' }, 403)

  const token = await signToken(
    { id: user.id, username: user.username, role: user.role },
    env.JWT_SECRET || 'secret'
  )
  return json({ token, user: { id: user.id, username: user.username, role: user.role, phone: user.phone } })
}

async function adminLogin(request, env) {
  const { username, password } = await request.json()
  if (!username || !password) return json({ error: '请输入用户名和密码' }, 400)

  const supabase = getSupabase(env)
  const { data: user } = await supabase.from('users').select('*').eq('username', username).maybeSingle()
  if (!user || user.role !== 'admin') return json({ error: '用户名或密码错误' }, 401)
  if (!bcrypt.compareSync(password, user.password_hash)) return json({ error: '用户名或密码错误' }, 401)

  const token = await signToken(
    { id: user.id, username: user.username, role: 'admin' },
    env.JWT_SECRET || 'secret'
  )
  return json({ token, user: { id: user.id, username: user.username, role: 'admin' } })
}

// ============ Phase 3：管理员审批 ============

async function listPendingUsers(request, env) {
  const url = new URL(request.url)
  const role = url.searchParams.get('role') // student / teacher
  let query = getSupabase(env).from('users').select('id,username,role,phone,status,created_at').eq('status', 'pending')
  if (role) query = query.eq('role', role)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function approveUser(request, env, id) {
  const { error } = await getSupabase(env).from('users').update({ status: 'approved' }).eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '已通过' })
}

async function rejectUser(request, env, id) {
  const { error } = await getSupabase(env).from('users').update({ status: 'rejected' }).eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '已拒绝' })
}

async function listPendingCourses(request, env) {
  const { data, error } = await getSupabase(env)
    .from('courses').select('id,title,category,status,teacher_id,created_at').eq('status', 'pending')
    .order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function approveCourse(request, env, id) {
  const { error } = await getSupabase(env).from('courses').update({ status: 'approved' }).eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '已通过' })
}

async function rejectCourse(request, env, id) {
  const { error } = await getSupabase(env).from('courses').update({ status: 'rejected' }).eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '已拒绝' })
}

async function allSchedules(request, env) {
  const supabase = getSupabase(env)
  const { data: courses, error: ce } = await supabase.from('courses').select('id,title,teacher_id,status')
  if (ce) return json({ error: ce.message }, 500)

  const { data: bookings, error: be } = await supabase
    .from('bookings').select('id,student_id,course_id,teacher_id,status,selected_time,time_options,created_at')
  if (be) return json({ error: be.message }, 500)

  return json({ courses, bookings })
}

// ============ Phase 3：教师课程管理 ============

async function teacherCreateCourse(request, env) {
  const body = await request.json()
  const { title, category, description, outline, price, image } = body
  if (!title || !category) return json({ error: '标题和分类为必填项' }, 400)

  const { data: course, error } = await getSupabase(env).from('courses').insert({
    title, category, description: description || '', outline: outline || '',
    price: price || '', image: image || '', teacher_id: request.user.id, status: 'pending',
  }).select().single()

  if (error) return json({ error: error.message }, 500)
  return json({ message: '课程已提交，等待管理员审批', course }, 201)
}

async function teacherListCourses(request, env) {
  const { data, error } = await getSupabase(env)
    .from('courses').select('*').eq('teacher_id', request.user.id).order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

// ============ Phase 3：教师约课处理（含协商）============

async function teacherBookings(request, env) {
  const { data, error } = await getSupabase(env)
    .from('bookings')
    .select('id, status, message, time_options, selected_time, created_at, student:student_id(id,username,phone), course:course_id(id,title,category)')
    .eq('teacher_id', request.user.id).order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function teacherPickTime(request, env, id) {
  const { selected_time } = await request.json()
  if (!selected_time) return json({ error: '请选择时间' }, 400)

  const supabase = getSupabase(env)
  const { data: booking } = await supabase.from('bookings').select('*').eq('id', id).eq('teacher_id', request.user.id).maybeSingle()
  if (!booking) return json({ error: '约课记录不存在' }, 404)
  if (booking.status !== 'pending') return json({ error: '该约课已被处理' }, 400)

  const { data: updated, error } = await supabase.from('bookings')
    .update({ status: 'teacher_picked', selected_time }).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

// ============ Phase 3：学生约课（含协商）============

async function studentBookings(request, env) {
  const { data, error } = await getSupabase(env)
    .from('bookings')
    .select('id, status, message, time_options, selected_time, created_at, course:course_id(id,title,category), teacher:teacher_id(id,username)')
    .eq('student_id', request.user.id).order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function bookCourse(request, env) {
  const { course_id, teacher_id, message, time_options } = await request.json()
  if (!course_id || !teacher_id) return json({ error: '缺少课程或教师信息' }, 400)

  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('bookings').select('id').eq('student_id', request.user.id)
    .eq('course_id', course_id).in('status', ['pending', 'teacher_picked', 'confirmed']).maybeSingle()
  if (existing) return json({ error: '你已有一个进行中的约课' }, 409)

  const { data: booking, error } = await supabase.from('bookings').insert({
    student_id: request.user.id, course_id, teacher_id,
    status: 'pending', message: message || '',
    time_options: JSON.stringify(time_options || []),
  }).select().single()

  if (error) return json({ error: error.message }, 500)
  return json(booking, 201)
}

async function confirmBooking(request, env, id) {
  const supabase = getSupabase(env)
  const { data: booking } = await supabase.from('bookings').select('*')
    .eq('id', id).eq('student_id', request.user.id).eq('status', 'teacher_picked').maybeSingle()
  if (!booking) return json({ error: '该约课尚未被老师确认时间，无法确认' }, 400)

  const { data: updated, error } = await supabase.from('bookings')
    .update({ status: 'confirmed' }).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function cancelBooking(request, env, id) {
  const supabase = getSupabase(env)
  const { data: booking } = await supabase.from('bookings').select('*')
    .eq('id', id).eq('student_id', request.user.id).maybeSingle()
  if (!booking) return json({ error: '约课记录不存在' }, 404)
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '已取消' })
}

// ============ 原有公开路由（精简保留）============

async function health() { return json({ status: 'ok', time: new Date().toISOString() }) }

async function listCourses(request, env) {
  const url = new URL(request.url)
  const { category, featured } = Object.fromEntries(url.searchParams)
  let query = getSupabase(env).from('courses').select('*').eq('status', 'approved').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('featured', 1)
  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function getCourse(request, env, id) {
  const { data, error } = await getSupabase(env).from('courses').select('*').eq('id', id).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!course) return json({ error: '课程不存在' }, 404)
  return json(course)
}

async function adminCreateCourse(request, env) {
  const body = await request.json()
  if (!body.title || !body.category) return json({ error: '标题和分类为必填项' }, 400)
  const { data, error } = await getSupabase(env).from('courses').insert({
    title: body.title, category: body.category, description: body.description || '',
    outline: body.outline || '', price: body.price || '', image: body.image || '',
    featured: body.featured ? 1 : 0, teacher_id: body.teacher_id || null, status: 'approved',
  }).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(data, 201)
}

async function updateCourse(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase.from('courses').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '课程不存在' }, 404)
  const body = await request.json()
  const updateData = {}
  for (const k of ['title', 'category', 'description', 'outline', 'price', 'image', 'featured', 'teacher_id', 'status']) {
    if (body[k] !== undefined) updateData[k] = body[k]
  }
  updateData.updated_at = new Date().toISOString()
  const { data: updated, error } = await supabase.from('courses').update(updateData).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function deleteCourse(request, env, id) {
  const { data: existing } = await getSupabase(env).from('courses').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '课程不存在' }, 404)
  const { error } = await getSupabase(env).from('courses').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

async function listTeachers(request, env) {
  const { data, error } = await getSupabase(env).from('teachers').select('*').order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function getTeacher(request, env, id) {
  const { data: teacher, error } = await getSupabase(env).from('teachers').select('*').eq('id', id).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!teacher) return json({ error: '教师不存在' }, 404)
  return json(teacher)
}

async function createTeacher(request, env) {
  const body = await request.json()
  if (!body.name) return json({ error: '姓名为必填项' }, 400)
  const { data: teacher, error } = await getSupabase(env).from('teachers').insert({
    name: body.name, title: body.title || '', bio: body.bio || '',
    avatar: body.avatar || '', specialties: body.specialties || '',
  }).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(teacher, 201)
}

async function updateTeacher(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase.from('teachers').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '教师不存在' }, 404)
  const body = await request.json()
  const updateData = {}
  for (const k of ['name', 'title', 'bio', 'avatar', 'specialties']) {
    if (body[k] !== undefined) updateData[k] = body[k]
  }
  const { data: updated, error } = await supabase.from('teachers').update(updateData).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function deleteTeacher(request, env, id) {
  const { data: existing } = await getSupabase(env).from('teachers').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '教师不存在' }, 404)
  const { error } = await getSupabase(env).from('teachers').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

async function listNews(request, env) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page')) || 1
  const limit = parseInt(url.searchParams.get('limit')) || 20
  const offset = (page - 1) * limit
  const supabase = getSupabase(env)
  const { count: total } = await supabase.from('news').select('*', { count: 'exact', head: true })
  const { data: news, error } = await supabase.from('news').select('*')
    .order('published_at', { ascending: false }).range(offset, offset + limit - 1)
  if (error) return json({ error: error.message }, 500)
  return json({ news, total })
}

async function getNews(request, env, id) {
  const { data: article, error } = await getSupabase(env).from('news').select('*').eq('id', id).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!article) return json({ error: '文章不存在' }, 404)
  return json(article)
}

async function createNews(request, env) {
  const body = await request.json()
  if (!body.title) return json({ error: '标题为必填项' }, 400)
  const { data: article, error } = await getSupabase(env).from('news').insert({
    title: body.title, summary: body.summary || '', content: body.content || '',
    cover_image: body.cover_image || '', category: body.category || '机构动态',
    published_at: body.published_at || new Date().toISOString().split('T')[0],
  }).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(article, 201)
}

async function updateNews(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase.from('news').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '文章不存在' }, 404)
  const body = await request.json()
  const updateData = {}
  for (const k of ['title', 'summary', 'content', 'cover_image', 'category', 'published_at']) {
    if (body[k] !== undefined) updateData[k] = body[k]
  }
  const { data: updated, error } = await supabase.from('news').update(updateData).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function deleteNews(request, env, id) {
  const { data: existing } = await getSupabase(env).from('news').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '文章不存在' }, 404)
  const { error } = await getSupabase(env).from('news').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

async function submitContact(request, env) {
  const body = await request.json()
  if (!body.name || !body.phone) return json({ error: '姓名和电话为必填项' }, 400)
  const { error } = await getSupabase(env).from('contacts').insert({
    name: body.name, phone: body.phone, email: body.email || '', message: body.message || '',
  })
  if (error) return json({ error: error.message }, 500)
  return json({ message: '提交成功，我们将尽快与您联系' }, 201)
}

async function listContacts(request, env) {
  const { data, error } = await getSupabase(env).from('contacts').select('*').order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function deleteContact(request, env, id) {
  const { error } = await getSupabase(env).from('contacts').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

async function dashboardStats(request, env) {
  const supabase = getSupabase(env)
  const tables = ['courses', 'teachers', 'news', 'contacts', 'bookings']
  const stats = {}
  for (const table of tables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
    stats[table] = count
  }
  return json(stats)
}

// ============ 路由分发 ============

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() })

  const seg = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean)
  const [resource, id, sub, act] = seg
  const method = request.method

  try {
    if (resource === 'health') return await health()

    // ====== 认证 ======
    if (resource === 'auth') {
      if (method === 'POST' && id === 'register') return await register(request, env, 'student')
      if (method === 'POST' && id === 'teacher-register') return await register(request, env, 'teacher')
      if (method === 'POST' && id === 'login') return await login(request, env)
      if (method === 'POST' && id === 'admin-login') return await adminLogin(request, env)
    }

    // ====== 管理员 ======
    if (resource === 'admin') {
      const user = await requireAuth(request, env, ['admin'])
      if (!user) return json({ error: '未授权' }, 401)
      request.user = user

      if (id === 'pending-users') return await listPendingUsers(request, env)
      if (id === 'users' && act === 'approve') return await approveUser(request, env, sub)
      if (id === 'users' && act === 'reject') return await rejectUser(request, env, sub)
      if (id === 'pending-courses') return await listPendingCourses(request, env)
      if (id === 'courses' && act === 'approve') return await approveCourse(request, env, sub)
      if (id === 'courses' && act === 'reject') return await rejectCourse(request, env, sub)
      if (id === 'all-schedules') return await allSchedules(request, env)
    }

    // ====== 学生 ======
    if (resource === 'student') {
      const user = await requireAuth(request, env, ['student'])
      if (!user) return json({ error: '请先登录' }, 401)
      request.user = user

      if (id === 'bookings') {
        if (method === 'GET' && !sub) return await studentBookings(request, env)
        if (method === 'DELETE' && sub) return await cancelBooking(request, env, sub)
        if (method === 'PUT' && act === 'confirm') return await confirmBooking(request, env, sub)
      }
      if (id === 'book' && method === 'POST') return await bookCourse(request, env)
    }

    // ====== 教师 ======
    if (resource === 'teacher') {
      const user = await requireAuth(request, env, ['teacher'])
      if (!user) return json({ error: '请先登录' }, 401)
      request.user = user

      if (id === 'bookings') {
        if (method === 'GET' && !sub) return await teacherBookings(request, env)
        if (method === 'PUT' && act === 'pick') return await teacherPickTime(request, env, sub)
      }
      if (id === 'courses') {
        if (method === 'POST' && !sub) return await teacherCreateCourse(request, env)
        if (method === 'GET' && !sub) return await teacherListCourses(request, env)
      }
    }

    // ====== 课程（公开 + 管理员）======
    if (resource === 'courses') {
      if (method === 'GET' && !id) return await listCourses(request, env)
      if (method === 'GET' && id) return await getCourse(request, env, id)
      if (method === 'POST' && !id) {
        const user = await requireAuth(request, env, ['admin'])
        if (!user) return json({ error: '未授权' }, 401)
        return await adminCreateCourse(request, env)
      }
      if (method === 'PUT' && id) {
        const user = await requireAuth(request, env, ['admin'])
        if (!user) return json({ error: '未授权' }, 401)
        return await updateCourse(request, env, id)
      }
      if (method === 'DELETE' && id) {
        const user = await requireAuth(request, env, ['admin'])
        if (!user) return json({ error: '未授权' }, 401)
        return await deleteCourse(request, env, id)
      }
    }

    // ====== 教师信息 ======
    if (resource === 'teachers') {
      if (method === 'GET' && !id) return await listTeachers(request, env)
      if (method === 'GET' && id) return await getTeacher(request, env, id)
      if (method === 'POST' && !id) {
        const user = await requireAuth(request, env, ['admin'])
        if (!user) return json({ error: '未授权' }, 401)
        return await createTeacher(request, env)
      }
      if (method === 'PUT' && id) {
        const user = await requireAuth(request, env, ['admin'])
        if (!user) return json({ error: '未授权' }, 401)
        return await updateTeacher(request, env, id)
      }
      if (method === 'DELETE' && id) {
        const user = await requireAuth(request, env, ['admin'])
        if (!user) return json({ error: '未授权' }, 401)
        return await deleteTeacher(request, env, id)
      }
    }

    // ====== 新闻 ======
    if (resource === 'news') {
      if (method === 'GET' && !id) return await listNews(request, env)
      if (method === 'GET' && id) return await getNews(request, env, id)
      if (method === 'POST' && !id) { const u = await requireAuth(request, env, ['admin']); if (!u) return json({ error: '未授权' }, 401); return await createNews(request, env) }
      if (method === 'PUT' && id) { const u = await requireAuth(request, env, ['admin']); if (!u) return json({ error: '未授权' }, 401); return await updateNews(request, env, id) }
      if (method === 'DELETE' && id) { const u = await requireAuth(request, env, ['admin']); if (!u) return json({ error: '未授权' }, 401); return await deleteNews(request, env, id) }
    }

    // ====== 联系我们 ======
    if (resource === 'contact') {
      if (method === 'POST' && !id) return await submitContact(request, env)
      if (method === 'GET' && !id) { const u = await requireAuth(request, env, ['admin']); if (!u) return json({ error: '未授权' }, 401); return await listContacts(request, env) }
      if (method === 'DELETE' && id) { const u = await requireAuth(request, env, ['admin']); if (!u) return json({ error: '未授权' }, 401); return await deleteContact(request, env, id) }
    }

    // ====== 仪表盘 ======
    if (resource === 'dashboard' && id === 'stats') {
      const u = await requireAuth(request, env, ['admin'])
      if (!u) return json({ error: '未授权' }, 401)
      return await dashboardStats(request, env)
    }

    return json({ error: 'Not Found' }, 404)
  } catch (err) {
    console.error('API Error:', err.message)
    return json({ error: '服务器内部错误' }, 500)
  }
}
