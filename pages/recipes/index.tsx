import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import EmptyState from '../../components/EmptyState';
import RecipeBrowser from '../../components/RecipeBrowser';
import { type Recipe, fetchAll } from '../../modules/supabase/recipe';
import RecipeEditor from '../../components/RecipeEditor';
import useRecipes from '../../hooks/useRecipes';

export default function Recipes() {
  const supabaseClient = useSupabaseClient();
  const { isLoading, session, error } = useSessionContext();
  const [isRecipeEditorOpen, setIsRecipeEditorOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const user = useUser();
  const [recipes, fetchRecipes, recipesLoading, recipesLoadingError] = useRecipes(user);

  if (isLoading || recipesLoading) {
    return null;
  }

  if (error) {
    console.error(error);
  }

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
  const viewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeEditorOpen(true);
  }
  const createRecipe = () => {
    setSelectedRecipe(undefined);
    setIsRecipeEditorOpen(true);
  }

  const renderRecipes = () => {
    if (recipes && recipes.length) {
      return (
        <>
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
        </>
      );
    } else {
      return (
        <EmptyState
          primaryAction="Add"
          onPrimaryActionClick={createRecipe}
          header={"Recipes"}
          subheading={"Start by adding a recipe"}
        />
      );
    }
  };
  
  return (
    <div className='h-full flex flex-col'>
      {renderRecipes()}
      <RecipeEditor recipe={selectedRecipe} open={isRecipeEditorOpen} onClose={() => {setIsRecipeEditorOpen(false); fetchRecipes()}} />
    </div>
  );
}
