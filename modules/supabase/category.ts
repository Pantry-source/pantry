import supabase from '../../api';
import type { Product } from './product';
import type { Database } from '../../types/generated/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];

export type CategoryWithProducts = Category & {
    products: Product[]
  }

export async function create(categoryName: string, userId: string) {
    return supabase
    .from('categories')
    .insert([
    { user_id: userId, name: categoryName },
    ])
    .select()
    .single()
}

export async function fetchAll() {
    return supabase
    .from('categories')
    .select(`*`);
}
