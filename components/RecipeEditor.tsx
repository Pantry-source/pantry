import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import * as recipeApi from "../modules/supabase/recipe";
import { formatIngredientData, parseListData } from "../modules/editor/utils";
import type { Recipe } from '../modules/supabase/recipe';
import { useUser } from '@supabase/auth-helpers-react';
import { OutputData } from '@editorjs/editorjs';
import { Json } from '../types/generated/supabase';
import ModalDialog from './ModalDialog';

const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: false,
});

type RecipeEditorProps = {
  recipe?: Recipe
  open: boolean,
  onClose: () => void
};

export default function RecipeEditor({ recipe, open, onClose }: RecipeEditorProps) {
  const [directions, setDirections] = useState<OutputData>(recipe?.directions);
  const [ingredients, setIngredients] = useState<string[]>(recipe?.ingredients);
  const [currentRecipe, setRecipe] = useState({...recipe});
  const [readOnly, setReadOnly] = useState(false);
  const user = useUser();
  const title = recipe ? 'Edit recipe' : 'Create recipe';

  console.log('recipe', recipe);
  console.log('currentRecipe', currentRecipe);

  useEffect(() => {
    setRecipe(recipe);
  }, [recipe]);

  function onIngredientsChange(updatedIngredients: OutputData) {
    setIngredients(parseListData(updatedIngredients))
  }

  function onDirectionsChange(updatedDirections: OutputData) {
    setDirections(updatedDirections);
  }

  function onRecipeChange(e) {
    setRecipe({ ...currentRecipe, [e.target.name]: e.target.value });
  }

  async function onSave(e) {
    e.preventDefault();
    if (!user) {
      return;
    }
    const blocks = directions?.blocks.map(block => ({ ...block })) as Json; // making TS happy
    if (!recipe) {
      if (currentRecipe && currentRecipe.name) {
        await recipeApi.create(currentRecipe.name, ingredients, user.id, {
          blocks
        });
        onClose();
      }
    } else {
      if (currentRecipe && currentRecipe.name) {
        await recipeApi.update(recipe.id, { ingredients, user_id: user.id, directions: {
          blocks
        }, name: currentRecipe.name });
        onClose();
      }
    }
  }

  return (
    <ModalDialog onDone={onSave} title={title} doneAction="Save" open={open} onClose={onClose}>
      <form className="px-4 py-6 sm:p-8">
        <div className='relative grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div className="mt-2">
              <input id="name" name="name" type="text" autoComplete="name"
                onChange={onRecipeChange}
                value={currentRecipe?.name || ''}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div className="sm:col-span-full relative">
            <label htmlFor="ingredients" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Ingredients</label>
            <TextEditor
              defaultBlock="list"
              tools={['list']}
              readOnly={readOnly}
              initialData={recipe && formatIngredientData(recipe.ingredients)}
              onChange={onIngredientsChange}
              holder="recipe-ingredients" />
          </div>
          <div className="sm:col-span-full relative">
            <label htmlFor="directions" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Directions</label>
            <TextEditor
              readOnly={readOnly}
              initialData={recipe && recipe.directions}
              onChange={onDirectionsChange}
              holder="recipe-directions" />
          </div>
        </div>
      </form>
    </ModalDialog>
  );
}
