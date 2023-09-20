import { useEffect, useState } from "react";
import { type Recipe, fetchAll } from '../modules/supabase/recipe';
import { PostgrestError, User } from "@supabase/supabase-js";

declare type RecipesResult = [
  recipes: Recipe[],
  fetchRecipes: () => Promise<void>,
  isLoading: boolean,
  error?: PostgrestError
];

const useRecipes = (user: User | null): RecipesResult => {
  const [ recipes, setRecipes ] = useState<Recipe[]>([]);
  const [ error, setError ] = useState<PostgrestError>();
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const fetchRecipes = async () => {
    setIsLoading(true);
    const { error, data } = await fetchAll();
    setIsLoading(false);
    if (error) {
      setError(error);
    }
    if (!error && data) {
      setRecipes(data);
    }
  };
  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);
  return [ recipes, fetchRecipes, isLoading, error ];
};

export default useRecipes;