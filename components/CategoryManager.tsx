import * as categoryApi from '../modules/supabase/category';
import classNames from '../modules/classnames';
import { Disclosure } from '@headlessui/react';
import { useState } from 'react';

type CategoryManagerProps = {
  categories: categoryApi.Category[];
  onCategoryDelete: (category: categoryApi.Category) => void;
};

export default function CategoryManager({ categories, onCategoryDelete }: CategoryManagerProps) {
  type CategoryEditStatus = { [id: categoryApi.Category['id']]: 'unchanged' | 'saving' | 'error' | 'updated' };

  const initialStatuses: CategoryEditStatus = categories.reduce((acc, category) => {
    acc[category.id] = 'unchanged';
    return acc;
  }, {} as CategoryEditStatus);

  const [categoryStatus, setCategoryStatus] = useState<CategoryEditStatus>(initialStatuses);

  console.log(categories);

  async function deleteCategory(category: categoryApi.Category, disclosureClose: () => void) {
    const { error } = await categoryApi.deleteById(category.id);
    if (!error) {
      onCategoryDelete(category);
      disclosureClose();
    } else {
      // foreign key violation meaning there are products in this category so the category cannnot be deleted
      if (error.code === '23503') {
        console.log(
          'TODO: add client side error handling',
          'This category cannot be deleted because it has products',
          error
        );
        // show message: "This category cannot be deleted because it has products"
      } else {
        console.log('TODO: add client side error handling', error);
        // show message: "Cannot delete at this time, try again?"
      }
    }
  }

  function renderCustomCategory(category: categoryApi.Category) {
    return (
      <Disclosure>
        {({ open, close }) => (
          <li
            className={classNames('flex items-center justify-between gap-x-2', open ? 'py-2' : 'py-3.5')}
            key={category.id}
          >
            <p className="text-sm font-semibold leading-6 text-stone-900 truncate">{category.name}</p>
            {!open && (
              <Disclosure.Button
                type="button"
                className="ml-6 rounded-md bg-white text-sm font-medium text-cyan-600 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Remove<span className="sr-only"> {category.name}</span>
              </Disclosure.Button>
            )}

            <Disclosure.Panel className="border-l-4 border-yellow-400 bg-yellow-50 p-2 flex flex-shrink-0">
              <div className="ml-2">
                <p className="text-sm text-yellow-700">
                  Are you sure you want to delete this category?{' '}
                  <button
                    onClick={() => deleteCategory(category, close)}
                    className="font-medium text-yellow-700 underline hover:text-yellow-600"
                  >
                    Yes
                  </button>
                  {' | '}
                  <Disclosure.Button className="font-medium text-yellow-700 underline hover:text-yellow-600">
                    No
                  </Disclosure.Button>
                </p>
              </div>
            </Disclosure.Panel>
          </li>
        )}
      </Disclosure>
    );
  }

  function renderDefaultCategory(category: categoryApi.Category) {
    return (
      <li className="flex items-center justify-between py-3" key={category.id}>
        <div className="flex items-start gap-x-2">
          <p className="text-sm font-semibold leading-6 text-stone-900">{category.name}</p>
          <p className="text-teal-600 bg-teal-50 ring-teal-500/10 rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset">
            Predefined
          </p>
        </div>
      </li>
    );
  }

  return (
    <ul role="list" className="mt-2 divide-y divide-gray-200">
      {categories.map((category) =>
        category.user_id ? renderCustomCategory(category) : renderDefaultCategory(category)
      )}
    </ul>
  );
}
