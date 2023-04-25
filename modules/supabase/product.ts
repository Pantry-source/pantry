import supabase from '../../api';
import type { Database } from '../../types/generated/supabase';

export type Product = Database['public']['Tables']['products']['Row'];

export async function updateQuantityAmountById(id: number, amount: number) {
  await supabase.from('products').update({ quantity_amount: amount }).eq('id', id);
}
