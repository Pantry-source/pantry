import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import EmptyState from '../../components/EmptyState';
import RecipeBrowser from '../../components/RecipeBrowser';
import { type Recipe, fetchAll } from '../../modules/supabase/recipe';
import RecipeEditor from '../../components/RecipeEditor';

export default function Recipes() {
  const supabaseClient = useSupabaseClient();
  const { isLoading, session, error } = useSessionContext();
  const [ recipes, setRecipes ] = useState<Recipe[]>();
  const [isRecipeEditorOpen, setIsRecipeEditorOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const user = useUser();
  async function fetchRecipes() {
    const { error, data } = await fetchAll();
    if (!error && data) {
      setRecipes(data);
    }
  }
  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  if (!session) {
    return (
      <Auth
        redirectTo="http://localhost:3000/"
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        providers={['google', 'github']}
        socialLayout="horizontal"
      />
    );
  }
  if (!recipes?.length) {
    return (
      <EmptyState
          primaryAction="Add"
          onPrimaryActionClick={createRecipe}
          header={"Recipes"}
          subheading={"Start by adding a recipe"}
        />
    )
  }
  function viewRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe);
    setIsRecipeEditorOpen(true);
  }
  function createRecipe() {
    setSelectedRecipe(undefined);
    setIsRecipeEditorOpen(true);
  }
  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center'>
        <h2 className="text-sm font-medium text-gray-500 mt-10 mb-5">All Recipes</h2>
        <button type="button"
          onClick={createRecipe}
          className="ml-6 rounded-md px-3.5 py-2.5 bg-cyan-600 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
          Add recipe
        </button>
      </div>
      <div className='flex-1'>
        <RecipeBrowser recipes={recipes} onRecipeViewClick={viewRecipe}/>
      </div>
      <RecipeEditor recipe={selectedRecipe} open={isRecipeEditorOpen} onClose={() => {setIsRecipeEditorOpen(false); fetchRecipes()}} />
    </div>
  );
}
