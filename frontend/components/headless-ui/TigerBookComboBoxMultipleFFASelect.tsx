import {Fragment, useState, useRef} from 'react';
import {Combobox, Transition} from "@headlessui/react";
import {CheckIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";


interface TestProps {
    data: string[],
    defaultText: string | null,
    zIndex: number
    setterFunction: (value: string) => void
    setterValue: string

}

const defaultProps: TestProps = {
    defaultText: null,
    zIndex: 0
}

function TigerBookComboBoxMultipleFFASelect({placeholder, dropdownDefaultDescription, zIndex, setterValue, setterFunction}) {
    const input = useRef<HTMLInputElement>(null);
    const [selected, setSelected] = useState<string[]>(setterValue)
    const [query, setQuery] = useState('')

    // const filteredStrings =
    //     query === ''
    //         ? data
    //         : data.filter((dataString) =>
    //             dataString
    //                 .toLowerCase()
    //                 .replace(/\s+/g, '')
    //                 .includes(query.toLowerCase().replace(/\s+/g, ''))
    //         )

    console.log(selected)

    // function onFocus() {
    //     if (selected.length === 0) {
    //         setIsBlank(true)
    //         setSelected([''])
    //     } else {
    //         setSelected(selected)
    //     }
    // }
    //
    // function onBlur() {
    //     if (isBlank) {
    //         setIsBlank(false)
    //         setSelected([])
    //     } else {
    //         setSelected(selected)
    //     }
    // }

    async function onChange() {
        if (query !== '') {
            setSelected(prevArray => {
                let result = [...prevArray, query].filter(item => item !== '')
                result = [...new Set(result)];
                setterFunction(result)
                input.current.value = ''
                return result
            })
        }
    }

    async function onClick(event) {
        event.stopPropagation()
        event.preventDefault()

        // @ts-ignore
        const associatedText = event.target.parentNode.innerText ??
            event.target.parentNode.parentNode.innerText

        console.log("actual target" , event.target)
        console.log("associated text" , associatedText)

        setSelected(prevArray => {
            let result = prevArray.filter(item => item !== associatedText)
            setterFunction(result)
            return result
        })
    }

    return (
        <Combobox value={selected}
            // onFocus={onFocus}
            // onBlur={onBlur}
                  onChange={onChange}
                  className={`z-${zIndex}`} multiple>
            <div className="relative mt-1">
                <div
                    className="relative border border-primary-200 w-full cursor-default
                     rounded-lg bg-white text-left shadow-md
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                     focus-visible:ring-offset-teal-300 sm:text-sm ">

                    <div className="flex flex-wrap overflow-auto items-center pl-2 pr-2">
                        <div className="shrink-[10] overflow-x-auto w-[220px] sm:w-full">
                            {selected.map((item, index) => {
                                return (
                                    <span key={index}
                                          className="mr-2 mt-1 mb-1 flex items-center whitespace-nowrap cursor-default relative bg-primary-50 pl-2 pr-1 rounded-full inline-flex">
                                            {item}
                                        <XMarkIcon className="h-5 w-5 cursor-pointer"
                                                   onClick={onClick}
                                        />
                                    </span>

                                )
                            })}
                        </div>
                        <Combobox.Input
                            className="py-2 text-sm leading-5 text-gray-900 focus:ring-0
                        focus:outline-none w-full
                        "
                            onChange={(event) => setQuery(event.target.value)}
                            spellCheck={false}
                            placeholder={placeholder}
                            ref={input}
                        />
                    </div>
                </div>
                {query !== '' && !selected.includes(query) && <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options
                        className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {
                            <Combobox.Option
                                className={({active}) =>
                                    `relative cursor-pointer select-none py-2 pl-5 pr-4 ${
                                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                value={query}
                            >
                                {({selected}) => (
                                    <>
                                        <div className="flex justify-between">
                        <span
                            className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {query}
                        </span>
                                            <span className="text-gray-500">{dropdownDefaultDescription}</span>
                                        </div>
                                        {selected ? (
                                            <span
                                                className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                      <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                    </span>
                                        ) : null}
                                    </>
                                )}
                            </Combobox.Option>
                        }
                    </Combobox.Options>
                </Transition>}
            </div>
        </Combobox>
    )
}

TigerBookComboBoxMultipleFFASelect.defaultProps = defaultProps;
export default TigerBookComboBoxMultipleFFASelect;
