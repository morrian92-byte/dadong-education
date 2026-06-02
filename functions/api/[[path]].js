import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { getSupabase } from '../lib/supabase.js'

// ============ 工具函数 ============

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
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret))
}

async function verifyToken(token, secret) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
  return payload
}

// ============ 认证中间件 ============

async function requireAuth(request, env) {
  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Bearer ')) return null
  try {
    return await verifyToken(header.split(' ')[1], env.JWT_SECRET || 'secret')
  } catch {
    return null
  }
}

// ============ 路由处理器 ============

// --- 健康检查 ---
async function health() {
  return json({ status: 'ok', time: new Date().toISOString() })
}

// --- 认证：登录 ---
async function login(request, env) {
  const { username, password } = await request.json()
  if (!username || !password) {
    return json({ error: '请输入用户名和密码' }, 400)
  }

  const supabase = getSupabase(env)
  const { data: user } = await supabase
    .from('users').select('*').eq('username', username).maybeSingle()

  if (!user) return json({ error: '用户名或密码错误' }, 401)

  const valid = bcrypt.compareSync(password, user.password_hash)
  if (!valid) return json({ error: '用户名或密码错误' }, 401)

  const token = await signToken(
    { id: user.id, username: user.username },
    env.JWT_SECRET || 'secret'
  )

  return json({ token, user: { id: user.id, username: user.username } })
}

// --- 课程 ---
async function listCourses(request, env) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const featured = url.searchParams.get('featured')

  let query = getSupabase(env).from('courses').select('*').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('featured', 1)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function getCourse(request, env, id) {
  const { data: course, error } = await getSupabase(env)
    .from('courses').select('*').eq('id', id).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!course) return json({ error: '课程不存在' }, 404)
  return json(course)
}

async function createCourse(request, env) {
  const body = await request.json()
  const { title, category, description, outline, price, image, featured } = body
  if (!title || !category) return json({ error: '标题和分类为必填项' }, 400)

  const { data: course, error } = await getSupabase(env)
    .from('courses').insert({
      title, category,
      description: description || '', outline: outline || '',
      price: price || '', image: image || '',
      featured: featured ? 1 : 0,
    }).select().single()

  if (error) return json({ error: error.message }, 500)
  return json(course, 201)
}

async function updateCourse(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('courses').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '课程不存在' }, 404)

  const body = await request.json()
  const { title, category, description, outline, price, image, featured } = body
  const updateData = {}
  if (title !== undefined) updateData.title = title
  if (category !== undefined) updateData.category = category
  if (description !== undefined) updateData.description = description
  if (outline !== undefined) updateData.outline = outline
  if (price !== undefined) updateData.price = price
  if (image !== undefined) updateData.image = image
  if (featured !== undefined) updateData.featured = featured ? 1 : 0
  updateData.updated_at = new Date().toISOString()

  const { data: updated, error } = await supabase
    .from('courses').update(updateData).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function deleteCourse(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('courses').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '课程不存在' }, 404)

  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

// --- 教师 ---
async function listTeachers(request, env) {
  const { data, error } = await getSupabase(env)
    .from('teachers').select('*').order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function getTeacher(request, env, id) {
  const { data: teacher, error } = await getSupabase(env)
    .from('teachers').select('*').eq('id', id).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!teacher) return json({ error: '教师不存在' }, 404)
  return json(teacher)
}

async function createTeacher(request, env) {
  const body = await request.json()
  if (!body.name) return json({ error: '姓名为必填项' }, 400)

  const { data: teacher, error } = await getSupabase(env)
    .from('teachers').insert({
      name: body.name, title: body.title || '', bio: body.bio || '',
      avatar: body.avatar || '', specialties: body.specialties || '',
    }).select().single()

  if (error) return json({ error: error.message }, 500)
  return json(teacher, 201)
}

async function updateTeacher(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('teachers').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '教师不存在' }, 404)

  const body = await request.json()
  const updateData = {}
  for (const k of ['name', 'title', 'bio', 'avatar', 'specialties']) {
    if (body[k] !== undefined) updateData[k] = body[k]
  }

  const { data: updated, error } = await supabase
    .from('teachers').update(updateData).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function deleteTeacher(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('teachers').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '教师不存在' }, 404)

  const { error } = await supabase.from('teachers').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

// --- 新闻 ---
async function listNews(request, env) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page')) || 1
  const limit = parseInt(url.searchParams.get('limit')) || 20
  const offset = (page - 1) * limit

  const supabase = getSupabase(env)
  const { count: total } = await supabase
    .from('news').select('*', { count: 'exact', head: true })

  const { data: news, error } = await supabase
    .from('news').select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return json({ error: error.message }, 500)
  return json({ news, total })
}

async function getNews(request, env, id) {
  const { data: article, error } = await getSupabase(env)
    .from('news').select('*').eq('id', id).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!article) return json({ error: '文章不存在' }, 404)
  return json(article)
}

async function createNews(request, env) {
  const body = await request.json()
  if (!body.title) return json({ error: '标题为必填项' }, 400)

  const { data: article, error } = await getSupabase(env)
    .from('news').insert({
      title: body.title, summary: body.summary || '', content: body.content || '',
      cover_image: body.cover_image || '', category: body.category || '机构动态',
      published_at: body.published_at || new Date().toISOString().split('T')[0],
    }).select().single()

  if (error) return json({ error: error.message }, 500)
  return json(article, 201)
}

async function updateNews(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('news').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '文章不存在' }, 404)

  const body = await request.json()
  const updateData = {}
  for (const k of ['title', 'summary', 'content', 'cover_image', 'category', 'published_at']) {
    if (body[k] !== undefined) updateData[k] = body[k]
  }

  const { data: updated, error } = await supabase
    .from('news').update(updateData).eq('id', id).select().single()
  if (error) return json({ error: error.message }, 500)
  return json(updated)
}

async function deleteNews(request, env, id) {
  const supabase = getSupabase(env)
  const { data: existing } = await supabase
    .from('news').select('*').eq('id', id).maybeSingle()
  if (!existing) return json({ error: '文章不存在' }, 404)

  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

// --- 联系我们 ---
async function submitContact(request, env) {
  const body = await request.json()
  if (!body.name || !body.phone) return json({ error: '姓名和电话为必填项' }, 400)

  const { error } = await getSupabase(env)
    .from('contacts').insert({
      name: body.name, phone: body.phone,
      email: body.email || '', message: body.message || '',
    })

  if (error) return json({ error: error.message }, 500)
  return json({ message: '提交成功，我们将尽快与您联系' }, 201)
}

async function listContacts(request, env) {
  const { data, error } = await getSupabase(env)
    .from('contacts').select('*').order('created_at', { ascending: false })
  if (error) return json({ error: error.message }, 500)
  return json(data)
}

async function deleteContact(request, env, id) {
  const { error } = await getSupabase(env)
    .from('contacts').delete().eq('id', id)
  if (error) return json({ error: error.message }, 500)
  return json({ message: '删除成功' })
}

// --- 仪表盘 ---
async function dashboardStats(request, env) {
  const supabase = getSupabase(env)
  const tables = ['courses', 'teachers', 'news', 'contacts']
  const stats = {}
  for (const table of tables) {
    const { count } = await supabase
      .from(table).select('*', { count: 'exact', head: true })
    stats[table] = count
  }
  return json(stats)
}

// ============ 路由分发 ============

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  // OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors() })
  }

  // 解析路径: /api/courses/5 → ['courses', '5']
  const pathname = url.pathname.replace(/^\/api\/?/, '')
  const segments = pathname.split('/').filter(Boolean)
  const resource = segments[0]
  const id = segments[1]
  const method = request.method

  try {
    // --- 路由匹配 ---
    if (resource === 'health') {
      return await health()
    }

    if (resource === 'auth' && id === 'login' && method === 'POST') {
      return await login(request, env)
    }

    // 课程
    if (resource === 'courses') {
      if (method === 'GET' && !id) return await listCourses(request, env)
      if (method === 'GET' && id) return await getCourse(request, env, id)
      if (method === 'POST' && !id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await createCourse(request, env)
      }
      if (method === 'PUT' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await updateCourse(request, env, id)
      }
      if (method === 'DELETE' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await deleteCourse(request, env, id)
      }
    }

    // 教师
    if (resource === 'teachers') {
      if (method === 'GET' && !id) return await listTeachers(request, env)
      if (method === 'GET' && id) return await getTeacher(request, env, id)
      if (method === 'POST' && !id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await createTeacher(request, env)
      }
      if (method === 'PUT' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await updateTeacher(request, env, id)
      }
      if (method === 'DELETE' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await deleteTeacher(request, env, id)
      }
    }

    // 新闻
    if (resource === 'news') {
      if (method === 'GET' && !id) return await listNews(request, env)
      if (method === 'GET' && id) return await getNews(request, env, id)
      if (method === 'POST' && !id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await createNews(request, env)
      }
      if (method === 'PUT' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await updateNews(request, env, id)
      }
      if (method === 'DELETE' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await deleteNews(request, env, id)
      }
    }

    // 联系我们
    if (resource === 'contact') {
      if (method === 'POST' && !id) return await submitContact(request, env)
      if (method === 'GET' && !id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await listContacts(request, env)
      }
      if (method === 'DELETE' && id) {
        const user = await requireAuth(request, env)
        if (!user) return json({ error: '未提供认证令牌' }, 401)
        return await deleteContact(request, env, id)
      }
    }

    // 仪表盘
    if (resource === 'dashboard' && id === 'stats' && method === 'GET') {
      const user = await requireAuth(request, env)
      if (!user) return json({ error: '未提供认证令牌' }, 401)
      return await dashboardStats(request, env)
    }

    return json({ error: 'Not Found' }, 404)
  } catch (err) {
    console.error('API Error:', err.message)
    return json({ error: '服务器内部错误' }, 500)
  }
}
