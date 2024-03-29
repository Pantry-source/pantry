import classNames from '../modules/classnames';
import { useState, useEffect } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';

type DropdownProps = {
  options: DropdownOption[];
  preselectedValue: DropdownOption | undefined;
  onSelect: (option: DropdownOption) => void;
  createOption: (optionName: string) => Promise<DropdownOption | undefined>;
};

export type DropdownOption = {
  name: string;
  id?: number;
};

export default function Dropdown({
  options,
  onSelect,
  createOption,
  preselectedValue = { id: 0, name: ''}
}: DropdownProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(preselectedValue);

  const filteredOptions =
    query === ''
      ? options
      : options.reduce<DropdownOption[]>((currentOptions, option) => {
          const isOptionAvailable = option.name.toLowerCase().includes(query.toLowerCase());
          if (isOptionAvailable) currentOptions.push(option);

          //renders "+ create" option if query value doesn't exist in the dropdown options
          if (currentOptions.length < 1 && !isOptionAvailable)
            currentOptions.push({ id: undefined, name: '+ create....' });
          return currentOptions;
        }, []);

  useEffect(() => {
    onSelect(selected);
  }, [selected]);

  return (
    <Combobox as="div" value={selected} onChange={setSelected}>
      {/* <Combobox.Label className="block text-sm font-medium text-stone-700">Assigned to</Combobox.Label> */}
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: DropdownOption) => option.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-stone-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) =>
              option.id === undefined ? (
                <Combobox.Option
                  key="create"
                  value={option}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-cyan-600 text-white' : 'text-stone-900'
                    )
                  }
                  onClick={async () => {
                    const newOption = await createOption(query);
                    if (newOption) {
                      setSelected(newOption);
                    }
                  }}
                >
                  {option.name}
                </Combobox.Option>
              ) : (
                <Combobox.Option
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-cyan-600 text-white' : 'text-stone-900'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span className={classNames('block truncate', selected && 'font-semibold')}>{option.name}</span>

                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-cyan-600'
                          )}
                        >
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              )
            )}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
