import supabase from '../../api';
import type { Database } from '../../types/generated/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];

export async function create(categoryName: string, userId: string) {
    return await supabase
    .from('categories')
    .insert([
    { user_id: userId, name: categoryName },
    ])
    .select()
    .single()
}

export async function deleteById(categoryId: Category["id"]) {
    return await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .single();
}

export async function fetchAll() {
    return await supabase
    .from('categories')
    .select(`*`);
}
