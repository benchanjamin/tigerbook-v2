import {Fragment, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

const type = [
    {name: 'By Hometown', desc: 'Explore hometown frequency on map'},
    {name: 'By Current City', desc: 'Explore current city frequency on map'},
]

export default function CityOptionListBox({onChange}) {
    const [selected, setSelected] = useState(type[0])

    console.log('selected: ', selected)

    return (
        <div className="absolute -top-[2.75rem] left-1/2 -translate-x-1/2 w-[22rem] md:left-2 md:top-1 md:translate-x-0 font-change z-10">
                <Listbox value={selected} onChange={e => {
                    setSelected(e);
                    onChange(e);
                }}>
                    <div className="relative mt-1">
                        <Listbox.Button
                            className="text-xs relative w-full cursor-pointer rounded-lg bg-white pl-3 py-2 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
              />
            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className="text-xs absolute cursor-pointer mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {type.map((option, optionIdx) => (
                                    <Listbox.Option
                                        key={optionIdx}
                                        className={({active}) =>
                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                active ? 'bg-primary-500 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={option}
                                    >
                                        {({selected, active}) => (
                                            <>
                      <span
                          className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {option.name}
                      </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active ? 'text-white' : 'text-primary-500'
                                                        }`}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
        </div>
    )
}
