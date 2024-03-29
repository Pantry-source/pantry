import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon as MagnifyingGlassIcon24 } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import type { Ingredient, Recipe } from '../modules/supabase/recipe';
import classNames from '../modules/classnames'

type RecipeBrowserProps = {
  recipes: Recipe[],
  onRecipeViewClick: (recipe: Recipe) => void
}

export default function RecipeBrowser({recipes, onRecipeViewClick}: RecipeBrowserProps) {
  const recent = recipes;
  const [query, setQuery] = useState('');

  const filteredRecipes =
    query === ''
      ? []
      : recipes.filter((recipe) => {
          return recipe.name.toLowerCase().includes(query.toLowerCase())
        })

  function renderIngredient(ingredient: Ingredient, i: number) {
    return <li key={i} className='lowercase'>{ingredient}</li>
  }

  function renderActiveRecipe(activeOption: Recipe) {
    // activeOption is state maintained by the Combobox component
    // use recipe state when rendering active recipe so that changes to recipes are reflected when rendering active recipe even when the same recipe remains active
    const recipe = recipes.find(r => r.id === activeOption.id);
    return recipe ? <div className="hidden w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
        <h2 className="flex-none p-4 text-center mt-3 font-semibold text-gray-900">{recipe.name}</h2>
        <div className="p-6">
          <ul className="list-disc text-sm pl-3 prose">
              { recipe.ingredients.map(renderIngredient)}
          </ul>
          <button
              onClick={() => onRecipeViewClick(recipe)}
              type="button"
              className="mt-6 w-full rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
              View full recipe
          </button>
        </div>
    </div> : null;
  }

  return (
    <div className="divide-y divide-gray-100 rounded-md shadow-sm bg-white border border-gray-200 h-full flex flex-col">
      <Combobox
        defaultValue={recipes[0]} 
        onChange={() => {/* combobox needs to have this call back */}}>
        {({ activeOption }) => (
        <>
            <div className="relative">
              <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
              />
              <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {(query === '' || filteredRecipes.length > 0) && (
            <Combobox.Options as="div" static hold className="flex divide-x divide-gray-100 flex-1">
                <div className="min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4">
                  <div className="-mx-2 text-sm text-gray-700">
                    {(query === '' ? recent : filteredRecipes).map((recipe) => (
                    <Combobox.Option
                        as="div"
                        key={recipe.id}
                        value={recipe}
                        className={({ active }) => classNames(
                            'flex cursor-default select-none items-center rounded-md p-2',
                            active && 'bg-gray-100 text-gray-900')}>
                        {({ active }) => (
                        <>
                          <span className="ml-3 flex-auto truncate">{recipe.name}</span>
                          {active && (
                            <ChevronRightIcon
                                className="ml-3 h-5 w-5 flex-none text-gray-400"
                                aria-hidden="true"
                            />
                          )}
                        </>
                        )}
                    </Combobox.Option>
                    ))}
                  </div>
                </div>

                {activeOption && renderActiveRecipe(activeOption)}
            </Combobox.Options>
            )}

            {query !== '' && filteredRecipes.length === 0 && (
            <div className="px-6 py-14 text-center text-sm sm:px-14">
                <MagnifyingGlassIcon24 className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                <p className="mt-4 font-semibold text-gray-900">No recipes found</p>
                <p className="mt-2 text-gray-500">
                  We couldn’t find anything with that term. Please try again.
                </p>
            </div>
            )}
        </>
        )}
      </Combobox>
    </div>
  )
}
