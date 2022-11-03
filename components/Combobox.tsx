import { useState, useEffect } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react';

// const options = [
//   { id: 1, name: 'Leslie Alexander' },
// ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dropdown({ options, onSelect, createOption }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState({})

  const filteredOptions =
    query === ''
      ? options
      : options.reduce((available, option) => {
        if (option.name.toLowerCase().includes(query.toLowerCase())) available.push(option);
        //renders "+ create category" option if query value doesn't exist. eg: category doesn't exist"
        if (available.length < 1
          && !option.name.toLowerCase().includes(query.toLowerCase())
        ) available.push({ id: undefined, name: '+ create option' });
        return available;
      }, []);

  function setCategory() {
      onSelect(selected);
  }

  useEffect(() => {
    setCategory()
  }, [selected])

  return (
    <Combobox as="div" value={selected} onChange={setSelected}>
      {/* <Combobox.Label className="block text-sm font-medium text-gray-700">Assigned to</Combobox.Label> */}
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option) => option?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {console.log('filteredOptions', filteredOptions)}
            {filteredOptions.map(option => (
              option.id === undefined
                ?
                <option
                  key={option.id}
                  value={option}
                  onClick={() => {
                    createOption(query);
                    setSelected({ name: query });
                  }}>
                  {option.name}
                </option>
                :
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    )
                  }>
                  {({ active, selected }) => (
                    <>
                      <span className={classNames('block truncate', selected && 'font-semibold')}>{option.name}</span>

                      {selected && (
                        <span
                          className={classNames('absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-indigo-600'
                          )}>
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>

            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
