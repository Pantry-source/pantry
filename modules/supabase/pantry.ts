import supabase from '../../api';
import { v4 as uuid } from 'uuid'
import type { Product } from './product';
import type { Database } from '../../types/generated/supabase';

export type Pantry = Database['public']['Tables']['pantries']['Row'];
export type PantryWithProducts = Pantry & { products: Product[]};

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

export async function fetchByIdWithProducts(id: string) {
    const pantryWithProducts = await supabase
        .from('pantries')
        .select(`*, products(*)`)
        .filter('id', 'eq', id)
        .order(`id`, { foreignTable: 'products' })
        .single();

    const {error, data } = pantryWithProducts;

    // supabase type for foreign table data (in this case products) is either single item, array of items, or null
    // Convert to always use array or null for products
    const formattedData: PantryWithProducts | undefined = data ? {
        ...data,
        products: Array.isArray(data.products) ? data.products : []
    } : undefined;
    
    return {
        error,
        data: formattedData
    }
}
