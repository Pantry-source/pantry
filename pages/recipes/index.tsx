import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';
import EmptyState from '../../components/EmptyState';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import RecipeBrowser from '../../components/RecipeBrowser';
import ModalDialog from '../../components/ModalDialog';
import RecipeEditor from '../../components/RecipeEditor';


const collections = [
  {
    id: 0,
    name: 'Essentials',
    recipes: [0]
  },
  {
    id: 0,
    name: 'Indian food',
    recipes: [0, 1]
  }
];

const initialRecipes = [
  {
    id: 0,
    name: "Ghee",
    ingredients: [
      {
        variants: [
          {
            name: "Butter",
            quantity_amount_min: 4,
            quantity_amount_max: 8,
            quantity_unit: {
              name: 'stick'
            }
          }
        ]
      }
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
      {
        variants: [
          {
            name: "Coriander Seeds",
            quantity_amount_min: 2,
            quantity_unit: {
              name: 'tbsp'
            }
          }
        ]
      },
      {
        variants: [
          {
            name: "Cumin Seeds",
            quantity_amount_min: 1,
            quantity_unit: {
              name: 'tsp'
            }
          }
        ]
      },
      {
        variants: [
          {
            name: "Whole Cloves",
            quantity_amount_min: 0.5,
            quantity_unit: {
              name: 'tsp'
            }
          }
        ]
      },
      {
        variants: [
          {
            name: "Cardamom Seeds",
            quantity_amount_min: 0.5,
            quantity_unit: {
              name: 'tsp'
            },
            description: "from green or white pods"
          }
        ]
      },
      {
        variants: [
          {
            name: "Bay leaves",
            quantity_amount_min: 2,
            quantity_unit: {
              name: 'count'
            }
          }
        ]
      },
      {
        variants: [
          {
            name: "Ground cayenne pepper",
            quantity_amount_min: 0.5,
            quantity_unit: {
              name: 'tsp'
            }
          },
          {
            name: "Red pepper flakes",
            quantity_amount_min: 0.5,
            quantity_unit: {
              name: 'tsp'
            }
          },
          {
            name: "Dried red chiles",
            quantity_amount_min: 3,
            quantity_unit: {
              name: 'count'
            }
          }
        ]
      },
      {
        variants: [
          {
            name: "Cinnamon stick",
            quantity_amount_min: 1,
            quantity_unit: {
              name: 'count'
            },
            preparation: "broken up"
          }
        ]
      },
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
      <h1 className="text-xl font-semibold tracking-wide mt-6 mb-2 sr-only">My Recipes</h1>
      <div className="flex-none">
        <h2 className="text-sm font-medium text-gray-500">Collections</h2>
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {collections.map((collection) => (
            <li key={collection.name} className="col-span-1 flex rounded-md shadow-sm">
              <div className="bg-pink-600 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white">
                {collection.name[0]}
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <a href={''} className="font-medium text-gray-900 hover:text-gray-600">
                    {collection.name}
                  </a>
                  <p className="text-gray-500">{collection.recipes.length} Recipes</p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
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
