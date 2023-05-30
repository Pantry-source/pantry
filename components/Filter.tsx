import { Dispatch, Fragment, ReactEventHandler, SetStateAction, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import MultiSelect from './MultiSelect';
import * as categoryApi from '../modules/supabase/category';

type ValidCategoriesProp = {
  validCategories: categoryApi.Category[];
  updateFilters: (filter: string) => void;
  updateCategoryIds: (filter: { value: string; label: string; }) => void;
}

type Option = {
  value: string | number;
  label: string;
  checked: boolean;
}

type FilterSection = {
  id: string;
  name: string;
  options: Option[];
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

export default function Filter({ validCategories, updateFilters, updateCategoryIds }: ValidCategoriesProp) {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([] as any[]);
  const [filters, setFilters] = useState<Option[]>(filterSection.options);
  const [categories, setCategories] = useState([] as any[]);

  /** updates activeFilters by selected category or filters then adds/removes filter
 * if it's checked/unchecked
*/
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    let field = e.target.id.split('-')[1]; // category or filters
    let value = e.target.value;
    let name = e.target.name;
    let isChecked = e.target.checked
    //massaging data to be sent to activeFilters
    let validFilter = { value: e.target.value, label: e.target.name };
    field === 'filters' ? updateFilters(validFilter.value) : updateCategoryIds(validFilter);

    if (isChecked) setActiveFilters([...activeFilters, validFilter]);
    if (!isChecked) setActiveFilters(currentFilters =>
      currentFilters.filter(f => f.value !== value))

    toggleCheckbox(event, field, value);
  }

  /** toggles checkbox for filter options depending on which field is passed */
  function toggleCheckbox(e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, field: string, value?: string | number) {

    if (field === 'category') toggle(e, setCategories, categories, value);

    if (field === 'filters') toggle(e, setFilters, filters, value);

  }

  /** toggles checkbox for category or filter option  */
  function toggle(e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, setState: Dispatch<SetStateAction<any[]>>, field: Option[], value?: string | number) {
    setState(() =>
      field.map((option) =>
        option.value === (isNaN(+value!) ? value : +value!)
          ? { ...option, checked: (e.target as HTMLInputElement).checked || false }
          : option
      )
    )
  };

  /** massages data:retrieves and adds option ID from corresponding activeFilter value*/
  function retrieveOptionProperties(optionSection: FilterSection, value: string | number) {
    const optionProperties = optionSection.options.reduce((properties, option) => {
      if (option.value === value) {
        properties['value'] = option.value,
          properties['field'] = optionSection.id;
      }
      return properties;
    }, {} as { value: string | number, field: string })
    return optionProperties
  }

  /** removes active filter & retrieves value from active filter to uncheck option */
  function remove(e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, filter: {value: string, label: string}) {

    const categoryProperties = retrieveOptionProperties(categorySection, +filter.value);
    const filterProperties = retrieveOptionProperties(filterSection, filter.value);

    const { field, value } = Object.keys(categoryProperties).length === 0
      ? filterProperties
      : categoryProperties;

    toggleCheckbox(e, field, value)

    setActiveFilters(currentFilters =>
      currentFilters.filter((f) => f.value !== filter.value))

    updateCategoryIds(filter)
  }

  const categoryOptions = validCategories.reduce<Option[]>((convertedToCategoryOptionsFormat, category) => {
    convertedToCategoryOptionsFormat.push({
      value: +category.id,
      label: category.name,
      checked: false
    });
    return convertedToCategoryOptionsFormat;
  }, [])
  const categorySection =
  {
    id: 'category',
    name: 'Category',
    options: categoryOptions
  }

  useEffect(() => {
    setCategories(categoryOptions);
  }, []);

  return (
    <div className="ring-white text-sm">
      {/* sr-only means only show this to screen-readers */}
      <h2 id="filter-heading" className="sr-only">
        Filters
      </h2>

      <div className="mx-auto flex items-center justify-end pr-4">
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
        <MultiSelect sectionOptions={categorySection} handleChange={onChange} />
        <MultiSelect sectionOptions={filterSection} handleChange={onChange} />
      </div>
      {/* Active filters */}
      {activeFilters.length > 0 && <div className="bg-gray-100">
        <div className="mx-auto px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
          <h3 className="text-sm font-medium text-gray-500">
            Filters
            <span className="sr-only">, active</span>
          </h3>
          <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />
          <div className="mt-2 sm:ml-4 sm:mt-0">
            <div className="-m-1 flex flex-wrap items-center">

              {/* pill button */}
              {activeFilters.map((activeFilter) => (
                <span
                  key={activeFilter.value}
                  className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                  <span>{activeFilter.label}</span>
                  <button
                    onClick={(e) => remove(e, activeFilter)}
                    type="button"
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                    <span className="sr-only">Remove filter for{activeFilter.label}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}