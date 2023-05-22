import { useState } from "react";
import dynamic from "next/dynamic";
import { formatIngredientData, formatOrderedListData } from "../modules/editor/utils";
import { INGREDIENTS_EDITOR_TOOLS } from "../modules/editor/tools";

const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: false,
});


export default function RecipeEditor({ recipe }) {
  const [directions, setDirections] = useState({});
  const [ingredients, setIngredients] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  return (
    <div className='prose pl-4'>
      <h2>{recipe.name}</h2>
      <h3>Ingredients</h3>
      <TextEditor readOnly={readOnly} tools={INGREDIENTS_EDITOR_TOOLS} initialData={formatIngredientData(recipe.ingredients)} onChange={setIngredients} holder={`recipe-ingredients-${recipe.id}`} />
      <h3>Directions</h3>
      <TextEditor readOnly={readOnly} initialData={formatOrderedListData(recipe.directions.steps)} onChange={setDirections} holder={`recipe-directions-${recipe.id}`} />
    </div>
  );
}
