import React, {Fragment, useEffect, useRef, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {useVirtualizer} from '@tanstack/react-virtual'
import {Spinner} from "flowbite-react";

export default function TigerBookComboBoxMultipleStrictSelect(
    {data, defaultText, zIndex, initialSelected, setterFunction, className, clearState, clearStateFunction}:
        { data: string[], defaultText: string, zIndex: number, initialSelected: string[], setterFunction: (value: string) => void }) {
    // const input = useRef<HTMLInputElement>(null)
    const [selected, setSelected] = useState<string[]>(initialSelected)
    const [query, setQuery] = useState('')


    useEffect(() => {
        if (clearState) {
            setSelected([])
            clearStateFunction(false)
        }
    }, [clearState, clearStateFunction, setSelected])

    // useEffect(() => {
    //     // add default option to front of data array if it does exist
    //     if (defaultOptionText !== undefined && data[0] !== defaultOptionText) {
    //         data.unshift(defaultOptionText)
    //     }
    // }, [data, defaultOptionText]);

    async function onChange(dataArray: string[]) {
        setSelected(() => {
            let result = dataArray
            result = [...new Set(result)]
            console.log('extraAPICall?', result)
            setterFunction(result)
            return result
        })
    }

    async function onClick(event) {
        event.stopPropagation()
        // @ts-ignore
        const associatedText = event.target.parentNode.innerText ??
            event.target.parentNode.parentNode.innerText
        console.log("actual target", event.target)
        console.log("associated text", associatedText)
        setSelected(prevArray => {
            let result = prevArray.filter(item => String(item) !== String(associatedText))
            console.log('result: ', result)
            setterFunction(result)
            return result
        })
    }

    const filteredStrings =
        query === ''
            ? data
            : data.filter((dataString) =>
                dataString
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <Combobox value={selected}
                  onChange={onChange} className={`z-[${zIndex}] z-${zIndex} ${className}`} multiple>
            <div className="relative mt-1">
                <div
                    className={`relative border border-primary-200 w-full cursor-default
                    overflow-hidden rounded-lg bg-white text-left shadow-md
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                     sm:text-sm`}>
                    <div className="flex flex-wrap overflow-auto items-center pl-2 pr-2">
                        <div className="shrink-[10] overflow-x-auto w-[220px] sm:w-full">
                            {selected.map((item, index) => {
                                return (
                                    <span key={index}
                                          className="mr-2 select-none mt-1 mb-1 flex items-center whitespace-nowrap cursor-default relative bg-primary-50 pl-2 pr-1 rounded-full inline-flex">
                                            {item}
                                        <XMarkIcon className="h-5 w-5 cursor-pointer"
                                                   onClick={onClick}
                                        />
                                    </span>

                                )
                            })}
                        </div>
                        <Combobox.Input
                            className="w-full py-2 pl-1 text-sm leading-5 text-gray-900 focus:ring-0
                        focus:outline-none
                        focus-visible:border-primary-500"
                            // displayValue={(dataString) => dataString === null || dataString.length === 0 ? '' : dataString.join(', ')}
                            onChange={(event) => setQuery(event.target.value)}
                            spellCheck={false}
                            placeholder={defaultText}
                        />
                    </div>
                    {data && data.length === 0 ?
                        <Spinner className="absolute right-1 top-[5px]" color="warning"/>
                    :
                    <Combobox.Button className="absolute bottom-[8px] right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                    }
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options>
                        {(
                            <VirtualizedList data={data} items={filteredStrings ?? []}
                            />
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    )
}


function VirtualizedList({
                             items,
                             data
                         }: { items: string[] }) {
    const parentRef = useRef<HTMLDivElement>(null);


    const rowVirtualizer = useVirtualizer({
        count: items?.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 100,
    });

    return (
        <div ref={parentRef}
             className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow: any) => (
                    <Combobox.Option
                        key={virtualRow.index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className={({active}) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                        }
                        value={items?.[virtualRow.index]}
                    >
                        {({selected}) => (
                            <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                             {items?.[virtualRow.index]}
                                    </span>
                                {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                      <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                    </span>
                                ) : null}
                            </>
                        )}
                    </Combobox.Option>
                ))}
            </div>

        </div>
    );
}
