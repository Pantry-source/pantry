import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import EmptyState from '../../components/EmptyState';
import RecipeBrowser from '../../components/RecipeBrowser';
import ModalDialog from '../../components/ModalDialog';
import RecipeEditor from '../../components/RecipeEditor';

const initialRecipes = [
  {
    id: 0,
    name: "Ghee",
    ingredients: [
      "4 to 8 sticks of butter"
    ],
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
    ingredients: [
      "2 tbsp Coriander Seeds",
      "1 tsp Cumin Seeds",
      "1/2 tsp Whole Cloves",
      "1/2 tsp Cardamom Seeds",
      "2 Bay leaves",
      "1/2 tsp Ground cayenne pepper or 1/2 tsp Red pepper flakes",
      "1 Cinnamon stick, broken up"
    ],
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
  const [ recipes, setRecipes ] = useState(initialRecipes);
  const [isRecipeEditorOpen, setIsRecipeEditorOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState();
  const user = useUser();
  useEffect(() => {
    if (user) {
      // fetch recipes
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
  if (!recipes.length) {
    return (
      <EmptyState
          primaryAction="Add"
          onPrimaryActionClick={() => {}}
          header={"Recipes"}
          subheading={"Start by adding a recipe"}
        />
    )
  }

  function viewRecipe(recipe) {
    setSelectedRecipe(recipe);
    setIsRecipeEditorOpen(true);
  }

  return (
    <div className='h-full flex flex-col'>
      <h2 className="text-sm font-medium text-gray-500 mt-10 mb-5">All Recipes</h2>
      <div className='flex-1'>
        <RecipeBrowser recipes={recipes} onRecipeViewClick={viewRecipe}/>
      </div>
      <ModalDialog open={isRecipeEditorOpen} onClose={() => setIsRecipeEditorOpen(false)}>
        { selectedRecipe ? <RecipeEditor recipe={selectedRecipe} /> : <div />}
      </ModalDialog>
    </div>
  );
}
