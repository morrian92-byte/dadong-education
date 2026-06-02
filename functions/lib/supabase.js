import { createClient } from '@supabase/supabase-js'

let _client = null
let _lastUrl = ''

export function getSupabase(env) {
  const url = env.SUPABASE_URL
  const key = env.SUPABASE_ANON_KEY

  // 复用 client 实例（相同 URL）
  if (_client && _lastUrl === url) return _client

  _client = createClient(url, key)
  _lastUrl = url
  return _client
}
