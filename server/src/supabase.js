import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  SUPABASE_URL 或 SUPABASE_ANON_KEY 未设置，数据库功能将不可用')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
