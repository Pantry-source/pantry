/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { UsersIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import classNames from '../modules/classnames'


export default function RecipeBrowser({recipes, onRecipeViewClick}) {
  const recent = recipes;
  const [query, setQuery] = useState('');

  const filteredRecipes =
    query === ''
      ? []
      : recipes.filter((recipe) => {
          return recipe.name.toLowerCase().includes(query.toLowerCase())
        })

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
    <div className="divide-y divide-gray-100 rounded-md shadow-sm bg-white border border-gray-200 h-full flex flex-col">
      <Combobox onChange={() => {/* combobox needs to have this call back */}}>
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
                        className={({ active }) =>
                        classNames(
                            'flex cursor-default select-none items-center rounded-md p-2',
                            active && 'bg-gray-100 text-gray-900'
                        )
                        }
                    >
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

                {activeOption && (
                <div className="hidden w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                    <div className="flex-none p-4 text-center">
                      <h2 className="mt-3 font-semibold text-gray-900">{activeOption.name}</h2>
                      <p className="text-sm leading-6 text-gray-500">{activeOption.role}</p>
                    </div>
                    <div className="p-6">
                      <ul className="list-disc text-sm text-gray-700 pl-10 prose">
                          { activeOption.ingredients.map(renderIngredient)}
                      </ul>
                      <button
                          onClick={() => onRecipeViewClick(activeOption)}
                          type="button"
                          className="mt-6 w-full rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                          View full recipe
                      </button>
                    </div>
                </div>
                )}
            </Combobox.Options>
            )}

            {query !== '' && filteredRecipes.length === 0 && (
            <div className="px-6 py-14 text-center text-sm sm:px-14">
                <UsersIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                <p className="mt-4 font-semibold text-gray-900">No people found</p>
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
