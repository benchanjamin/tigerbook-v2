import {FC, Fragment, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

const TigerBookListBox : FC = ({data, initialSelected, defaultText, zIndex, setterFunction})  => {
    const [selected, setSelected] = useState(initialSelected)

    return (
        <Listbox value={selected} onChange={e => {
            setSelected(e)
            setterFunction(e)
        }} className={`z-${zIndex}`}>
            <div className="relative mt-1">
                <Listbox.Button
                    className="relative w-full cursor-pointer rounded-lg
                     bg-white py-2 pl-3 text-left shadow-lg  border border-primary-200
                     focus:outline-none focus-visible:border-primary-500
                     focus-visible:ring-2 focus-visible:ring-white
                      focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                      focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className={`block truncate ${selected === null ? 'text-gray-400' : ''}`}>{selected === null ? defaultText : selected}</span>
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
                        className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {data.map((dataString, dataIdx) => (
                            <Listbox.Option
                                key={dataIdx}
                                className={({active}) =>
                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                value={dataString}
                            >
                                {({selected}) => (
                                    <>
                                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                        {dataString}
                                      </span>
                                        {selected ? (
                                            <span
                                                className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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
    )
}

TigerBookListBox.defaultProps = {
    initialSelected: null
}



export default TigerBookListBox;
