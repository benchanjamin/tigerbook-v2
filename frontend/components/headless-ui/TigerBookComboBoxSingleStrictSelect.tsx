import {Fragment, useEffect, useRef, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {useVirtualizer} from '@tanstack/react-virtual'

export default function TigerBookComboBoxSingleStrictSelect(
    {data, defaultText, zIndex, initialSelected, defaultOptionText, setterFunction}:
        { data: string[], defaultText: string, zIndex: number, initialSelected: string, defaultOptionText: string | undefined, setterFunction: (value: string) => void }) {
    const [selected, setSelected] = useState<string | null>(initialSelected)
    const [query, setQuery] = useState('')

    useEffect(() => {
        // add default option to front of data array if it does exist
        if (defaultOptionText !== undefined && data[0] !== defaultOptionText) {
            data.unshift(defaultOptionText)
        }
    }, [data, defaultOptionText]);


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
            // onFocus={() => selected === null ? setSelected('') : setSelected(selected)}
            // onBlur={() => selected === '' ? setSelected(null) : setSelected(selected)}
                  onChange={inputString => {
                      if (inputString !== defaultOptionText) {
                          setSelected(inputString)
                          setterFunction(inputString)
                          return
                      }
                      setSelected(defaultOptionText)
                      setterFunction(null)
                  }} className={`z-[${zIndex}] z-${zIndex}`}>
            <div className="relative mt-1">
                <div
                    className="relative border border-primary-200 w-full cursor-pointer
                    overflow-hidden rounded-lg bg-white text-left shadow-md
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                     focus-visible:ring-offset-teal-300 sm:text-sm">

                    <Combobox.Input
                        className="w-full  py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0
                        focus:outline-none
                        focus-visible:border-primary-500"
                        displayValue={(dataString) => dataString}
                        onChange={(event) => setQuery(event.target.value)}
                        spellCheck={false}
                        placeholder={defaultText}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options
                    >
                        {(
                            <VirtualizedList items={filteredStrings ?? []}
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
