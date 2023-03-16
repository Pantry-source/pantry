import supabase from '../../api';
import { v4 as uuid } from 'uuid'
import type { Database } from '../../types/generated/supabase';

export type Pantry = Database['public']['Tables']['pantries']['Row'];

export async function create(title: string, description: string, userId: string) {
    const newPantryId = uuid();
    return await supabase
      .from('pantries')
      .insert([
          { title, description, user_id: userId }
      ])
      .select()
      .single()
}

export async function deleteById(id: number) {
    await supabase
      .from('pantries')
      .delete()
      .match({ id })
}

export async function fetchAll() {
    return await supabase
      .from('pantries')
      .select('*')
}

export async function fetchById(id: string) {
    return await supabase
        .from('pantries')
        .select()
        .filter('id', 'eq', id)
        .single()
}
