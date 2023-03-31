import supabase from '../../api';
import type { Database } from '../../types/generated/supabase';

export type Product = Database['public']['Tables']['products']['Row'];
