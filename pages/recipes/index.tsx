import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import EmptyState from '../../components/EmptyState';
import RecipeBrowser from '../../components/RecipeBrowser';
import { type Recipe, fetchAll } from '../../modules/supabase/recipe';
import ModalDialog from '../../components/ModalDialog';
import RecipeEditor from '../../components/RecipeEditor';

const initialRecipes = [
  {
    id: 0,
    created_at: "2022-12-28 18:22:54.914793+00",
    name: "Ghee",
    ingredients: [
      "4 to 8 sticks of butter"
    ],
    user_id: "57855033-6088-45c0-bc03-5a2e483d6a87",
    directions: {
      steps: [
        "Warm up butter slowly in a pan with heavy bottom",
        "Allow milk solids to separate and sink to the bottom. No need to stir",
        "Strain and pour into a container with lid"
      ]
    }
  },
  {
    id: 1,
    name: "Garam Masala",
    created_at: "2022-12-28 18:22:54.914793+00",
    ingredients: [
      "2 tbsp Coriander Seeds",
      "1 tsp Cumin Seeds",
      "1/2 tsp Whole Cloves",
      "1/2 tsp Cardamom Seeds",
      "2 Bay leaves",
      "1/2 tsp Ground cayenne pepper or 1/2 tsp Red pepper flakes",
      "1 Cinnamon stick, broken up"
    ],
    user_id: "57855033-6088-45c0-bc03-5a2e483d6a87",
    directions: {
      steps: [
        "In a clean coffee or spice grinder, add all of the ingredients.",
        "Grind until the spices form a medium-fine powder. Stop the grinder several times and shake it so all the seeds and bits get under the blades and grind evenly.",
        "When you're finished, unplug the grinder. Holding the lid in place, turn the spice grinder upside down and shake the spice mixture into the lid. Pour garam masala into a small jar with a tight-fitting lid. Store in a cool, dry place for up to 4 weeks."
      ]
    }
  },
];

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
    } else {
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
          onPrimaryActionClick={() => {}}
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
      <RecipeEditor recipe={selectedRecipe} open={isRecipeEditorOpen} onClose={() => setIsRecipeEditorOpen(false)} />
    </div>
  );
}
