import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

export default function ProductEditor() {
  return (
    <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
      
      {/* Product name */}
      <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
            Product name
          </label>
        </div>
        <div className="sm:col-span-2">
          <input
            type="text"
            name="product-name"
            id="product-name"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Is Essential */}
      <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <legend className="sr-only">Is Essential</legend>
        <div className="text-sm font-medium text-gray-900" aria-hidden="true">
          Is Essential
        </div>
        <div className="space-y-5 sm:col-span-2">
          <div className="space-y-5 sm:mt-0">
            <div className="relative flex items-start">
              <div className="absolute flex h-5 items-center">
                <input
                  id="is-essential"
                  name="is-essential"
                  aria-describedby="is-essential-description"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  defaultChecked/>
              </div>
              <div className="pl-7 text-sm">
                <label htmlFor="is-essential" className="font-medium text-gray-900">
                  Yes
                </label>
                <p id="is-essential-description" className="text-gray-500">
                  Will be marked as "out of stock" when runs out
                </p>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="absolute flex h-5 items-center">
                <input
                  id="not-essential"
                  name="is-essential"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              </div>
              <div className="pl-7 text-sm">
                <label htmlFor="not-essential" className="font-medium text-gray-900">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Quantity */}
      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="amount"
            id="amount"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0"/>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="unit" className="sr-only">
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
              <option>item</option>
              <option>lb</option>
              <option>oz</option>
              <option>kg</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
            Category
          </label>
        </div>
        <div className="sm:col-span-2">
          <select
            id="category"
            name="category"
            className="w-full pl-3 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue="Dry Goods">
              <option>Dry Goods</option>
              <option>Frozen</option>
              <option>Produce</option>
          </select>
        </div>
      </div>

      {/* Vendor */}
      <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
        <div>
          <label
            htmlFor="vendor"
            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
            Vendor
          </label>
        </div>
        <div className="sm:col-span-2">
          <input
            type="text"
            name="vendor"
            id="vendor"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};