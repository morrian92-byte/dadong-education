# 大东教育 — 教培机构官方网站

一个现代化的教培机构官方展示网站，包含前台展示页面和后台内容管理系统。

## 技术栈

- **前端**: React 18 + Vite + TypeScript + Tailwind CSS
- **后端**: Express.js + SQLite (better-sqlite3)
- **认证**: JWT (jsonwebtoken + bcryptjs)

## 项目结构

```
dadong-education/
├── client/                 # React 前端
│   ├── src/
│   │   ├── components/     # 组件 (layout/, ui/, home/)
│   │   ├── pages/          # 页面 (含 admin/ 后台)
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── utils/          # API 工具
│   │   └── types/          # TypeScript 类型
│   └── ...
├── server/                 # Express 后端
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── middleware/     # 中间件
│   │   ├── db.js           # 数据库初始化
│   │   ├── index.js        # 入口
│   │   └── seed.js         # 种子数据
│   └── ...
└── README.md
```

## 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 1. 安装依赖

```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

### 2. 初始化数据库

```bash
cd server
npm run seed
```

这将创建 SQLite 数据库并填充示例数据：
- 管理员账号：`admin` / `admin123`
- 9 门示例课程
- 6 位示例教师
- 6 条示例新闻

### 3. 启动开发服务

**启动后端**（端口 4000）：
```bash
cd server
npm run dev
```

**启动前端**（端口 3000）：
```bash
cd client
npm run dev
```

### 4. 访问网站

- 🏠 **前台页面**: http://localhost:3000
- 🔐 **管理后台**: http://localhost:3000/admin/login

## 页面说明

### 前台页面
| 路由 | 页面 |
|------|------|
| `/` | 首页（Banner、特色、课程、数据、评价） |
| `/courses` | 课程中心（分类筛选 + 课程卡片） |
| `/courses/:id` | 课程详情 |
| `/teachers` | 师资团队 |
| `/about` | 关于我们（发展历程时间线） |
| `/news` | 新闻动态 |
| `/news/:id` | 新闻详情 |
| `/contact` | 联系我们（表单 + 联系信息） |

### 后台管理（需登录）
| 路由 | 功能 |
|------|------|
| `/admin` | 仪表盘（数据统计） |
| `/admin/courses` | 课程管理（增删改查） |
| `/admin/teachers` | 教师管理（增删改查） |
| `/admin/news` | 新闻管理（增删改查） |
| `/admin/contacts` | 留言管理 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 管理员登录 |
| GET/POST/PUT/DELETE | `/api/courses` | 课程 CRUD |
| GET/POST/PUT/DELETE | `/api/teachers` | 教师 CRUD |
| GET/POST/PUT/DELETE | `/api/news` | 新闻 CRUD |
| POST | `/api/contact` | 提交联系表单 |
| GET | `/api/contact` | 获取留言列表（需认证） |
| GET | `/api/dashboard/stats` | 仪表盘统计（需认证） |

## 设计系统

| 用途 | 色值 |
|------|------|
| 主色 | `#1E40AF` (蓝色，信赖专业) |
| 强调色 | `#F59E0B` (金色，CTA 高亮) |
| 背景 | `#F8FAFC` |
| 文字主色 | `#1E293B` |

## License

内部项目，仅供大东教育使用。
