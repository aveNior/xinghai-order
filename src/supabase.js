import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxuvcshkbgtqnjjjpakl.supabase.co'
const supabaseKey = 'sb_publishable_TMtE3CQqzl51nnI47-j3nw_oeBaM-bn'

export const supabase = createClient(supabaseUrl, supabaseKey)