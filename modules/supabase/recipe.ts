import { OutputData } from '@editorjs/editorjs';
import supabase from '../../api';
import type { Database, Json } from '../../types/generated/supabase';

export type Recipe = Database['public']['Tables']['recipes']['Row'];

export type Ingredient = string;

export type RecipeDirections = Json;

export async function create(name: string, ingredients: Ingredient[], userId: string, directions?: RecipeDirections) {
  return await supabase
    .from('recipes')
    .insert([{ directions, name, ingredients, user_id: userId }])
    .select()
    .single();
}

export async function update(id: number, data: Partial<Recipe>) {
  return await supabase.from('recipes').update(data).eq('id', id);
}

export async function deleteById(id: number) {
  return await supabase.from('recipes').delete().match({ id });
}

export async function fetchAll() {
  return await supabase.from('recipes').select('*');
}

export async function fetchById(id: string) {
  return await supabase.from('recipes').select().filter('id', 'eq', id).single();
}
