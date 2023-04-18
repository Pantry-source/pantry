import supabase from '../../api';
import type { Database } from '../../types/generated/supabase';

export type QuantityUnit = Database['public']['Tables']['quantity_units']['Row'];
export type QuantityUnitMap = Record<QuantityUnit['id'], QuantityUnit['name']>;

let QuantityUnitMapTest: QuantityUnitMap = { 123: 'test'};

export async function fetchAll() {
    return supabase
    .from('quantity_units')
    .select(`*`);
}
