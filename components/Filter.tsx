import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function cl(x, y) {
  console.log(x, y)
}
// const sortOptions = [
//   { name: 'Most Popular', href: '#', current: true },
//   { name: 'Best Rating', href: '#', current: false },
//   { name: 'Newest', href: '#', current: false },
// ]


// const activeFilterSection = [
//   { value: 'objects', label: 'Objects' },
//   { value: 'objects', label: 'Objects' }
// ]

const filterSection =
{
  id: 'filters',
  name: 'Filters',
  options: [
    { value: 'isEssential', label: 'Essential', checked: false },
    { value: 'isOutOfStock', label: 'Out Of Stock', checked: false },
    { value: 'isExpiring', label: 'Expiring Soon', checked: false },
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Filter({ validCategories }) {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [filters, setFilters] = useState(filterSection.options);
  const [categories, setCategories] = useState([]);

  /** updates activeFilters by selected category or filters */
  function onChange(e) {
    console.log(e.target)
    let field = e.target.id.split('-')[1]; // category or filter
    let value = e.target.value;
    let name = e.target.name;
    let isChecked = e.target.checked

    //massaging data to be sent to activeFilters
    let validFilter = { value: e.target.value, label: e.target.name };

    if (isChecked) setActiveFilters([...activeFilters, validFilter]);

    toggleCheckbox(event, field, value);
  }

  /** toggles checkbox for filter options depending on which field is passed */
  function toggleCheckbox(e, field, value) {

    if (field === 'category') toggle(e, setCategories, categories, value);
    
    if (field === 'filters') toggle(e, setFilters, filters, value);

  }

  /** toggles checkbox for either option  */
  function toggle(e, setState, field, value) {
    setState((field) =>
      field.map((option) =>
        option.value === value
          ? { ...option, checked: e.target.checked }
          : option
      )
    )
  };

  /** retrieves option ID from corresponding activeFilter value*/
  function retrieveOptionProperties(optionSection, value) {
    const optionProperties = optionSection.options.reduce((properties, option) => {
      if (option.value === value) {
        properties['value'] = option.value,
          properties['field'] = optionSection.id;
      }
      return properties;
    }, {})
    return optionProperties
  }

  /** removes active filter & retrieves value from active filter to uncheck option */
  function remove(e, filter) {

    let categoryProperties = retrieveOptionProperties(categorySection, filter.value);
    let filterProperties = retrieveOptionProperties(filterSection, filter.value);

    let { field, value } = Object.keys(categoryProperties).length === 0
      ? filterProperties
      : categoryProperties;

    toggleCheckbox(e, field, value)
    setActiveFilters(currentFilters =>
      currentFilters.filter((f) => f.value !== filter.value))
  }

  const categoryOptions = validCategories.reduce((convertToCategoryOptionsFormat, category) => {
    convertToCategoryOptionsFormat.push({
      value: category.name.toLowerCase().split(' ').join('-'),
      label: category.name,
      checked: false
    });
    return convertToCategoryOptionsFormat;
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

  useEffect(() =>{
    
  })

  return (
    <div className="bg-white">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setOpen(false)}>
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters Mobile */}
                <form className="mt-4">
                  {[categorySection, filterSection].map((section) => (
                    <Disclosure as="div" key={section.name} className="border-t border-gray-200 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                              <span className="font-medium text-gray-900">{section.name}</span>
                              <span className="ml-6 flex items-center">
                                <ChevronDownIcon
                                  className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-500">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Filters Desktop */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-gray-200 bg-white pb-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" style={{ paddingTop: ".625rem", marginRight: "0.3125rem" }}>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  {/* Sort */}
                  {/* <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  /> */}
                </Menu.Button>
              </div>

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
                              option.current ? 'font-medium text-gray-900' : 'text-gray-500',
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

            {/* <button
              type="button"
              className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setOpen(true)}>
              Filter
            </button> */}

            {/* <div className="hidden sm:block"> hides filter/category section on small viewport */}
            <div>
              <div className="flow-root">
                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                  {[categorySection, filterSection].map((section, sectionIdx) => (
                    <Popover key={section.name} className="relative inline-block px-4 text-left">
                      <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{section.name}</span>
                        <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                          {
                            section.id === 'filters'
                              ? filters.filter(option => option.checked).length
                              : categories.filter(option => option.checked).length
                          }
                        </span>
                        {/* {sectionIdx === 0 ? (
                        ) : null} */}
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Popover.Panel unmount={false} className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <form className="space-y-4">
                            {(section.name === 'Filters' ? filters : categories).map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  // name={`${section.id}[]`}
                                  name={option.label}
                                  defaultValue={option.value}
                                  onChange={onChange}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ))}
                </Popover.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && <div className="bg-gray-100">
          <div className="mx-auto max-w-1xl py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="text-sm font-medium text-gray-500">
              Filters
              <span className="sr-only">, active</span>
            </h3>

            <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

            <div className="mt-2 sm:mt-0 sm:ml-4">
              <div className="-m-1 flex flex-wrap items-center">
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
      </section>
    </div>
  )
}
