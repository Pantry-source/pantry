import supabase from '../../api';
import type { Database } from '../../types/generated/supabase';

export type QuantityUnit = Database['public']['Tables']['quantity_units']['Row'];

export async function fetchAll() {
    return supabase
    .from('quantity_units')
    .select(`*`);
}
