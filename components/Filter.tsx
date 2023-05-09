import { Fragment, ReactEventHandler, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import MultiSelect from './MultiSelect';
import * as categoryApi from '../modules/supabase/category';


type ValidCategoriesProp = {
  validCategories: categoryApi.Category[];
}

type Option = {
   value: string; 
    label: string; 
    checked: boolean; 
}
const filterSection = {
  id: 'filters',
  name: 'Filters',
  options: [
    { value: 'isEssential', label: 'Essential', checked: false },
    { value: 'isOutOfStock', label: 'Out Of Stock', checked: false },
    { value: 'isExpiring', label: 'Expiring Soon', checked: false }
  ]
};

export default function Filter({ validCategories }: ValidCategoriesProp) {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([] as any[]);
  const [filters, setFilters] = useState(filterSection.options);
  const [categories, setCategories] = useState([] as any[]);

  /** updates activeFilters by selected category or filters */
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target);
    const field = e.target.id.split('-')[1]; // category or filter
    const value = e.target.value;
    const name = e.target.name;
    const isChecked = e.target.checked;

    const validFilter = { value: e.target.value, label: e.target.name };

    if (isChecked) setActiveFilters([...activeFilters, validFilter]);
    // updates category filter
    if (field === 'category') {
      setCategories((categories) =>
        categories.map((option) => (option.value === value ? { ...option, checked: e.target.checked } : option))
      );
    }
    // updates filter
    if (field === 'filters') {
      setFilters((filters) =>
        filters.map((option) => (option.value === value ? { ...option, checked: e.target.checked } : option))
      );
    }
  }

  const categoryOptions = validCategories.reduce<Option[]>((convertToCategoryOptionsFormat, category) => {
    convertToCategoryOptionsFormat.push({
      value: category.name.toLowerCase().split(' ').join('-'),
      label: category.name,
      checked: false
    });
    return convertToCategoryOptionsFormat;
  }, []);

  const categorySection = {
    id: 'category',
    name: 'Category',
    options: categoryOptions
  };

  useEffect(() => {
    setCategories(categoryOptions);
  }, []);

  return (
    <div className="ring-white text-sm">
      {/* sr-only means only show this to screen-readers */}
      <h2 id="filter-heading" className="sr-only">
        Filters
      </h2>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Menu as="div" className="relative inline-block text-left">
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {/* {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current ? 'font-medium text-stone-900' : 'text-stone-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))} */}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <button
          type="button"
          className="inline-block text-sm font-medium text-stone-700 hover:text-stone-900 sm:hidden"
          onClick={() => setOpen(true)}
        >
          Filter
        </button>
        {/* <div className="hidden sm:block"> hides filter/category section on small viewport */}
        <MultiSelect sectionOptions={[categorySection]} selectOptions={categories} handleChange={onChange} />
        <MultiSelect sectionOptions={[filterSection]} selectOptions={filters} handleChange={onChange} />
      </div>
    </div>
  );
}