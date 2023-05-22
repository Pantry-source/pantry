import { useState } from "react";
import dynamic from "next/dynamic";
import { formatOrderedListData } from "../modules/editor/utils";

const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: false,
});


export default function RecipeEditor({ recipe }) {
  const [directions, setDirections] = useState({});
  const [readOnly, setReadOnly] = useState(true);

  function renderIngredient(ingredient, i) {
    let ingredientSentence = ingredient.variants.reduce((result, variant, index) => {
      if (result.length) {
        result.push(<span key={index} className='font-semibold'> or </span>);
      }
      result.push(`${variant.quantity_amount_min} ${variant.quantity_unit.name !== 'count' ? variant.quantity_unit.name : ''} ${variant.name}`);
      variant.description && result.push(`, ${variant.description}`);
      variant.preparation && result.push(`, ${variant.preparation}`);
      return result;
    }, []);
    return <li key={i} className='lowercase'>{ingredientSentence}</li>
  }

  return (
    <div className='prose pl-4'>
      <h2>{recipe.name}</h2>
      <h3>Ingredients</h3>
      <ul>{ recipe.ingredients.map(renderIngredient) }</ul>
      <h3>Directions</h3>
      <TextEditor readOnly={readOnly} initialData={formatOrderedListData(recipe.directions.steps)} onChange={setDirections} holder={`recipe-directions-${recipe.id}`} />
    </div>
  );
}
