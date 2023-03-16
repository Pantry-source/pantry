import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './types/generated/supabase';

export default createBrowserSupabaseClient<Database>()
