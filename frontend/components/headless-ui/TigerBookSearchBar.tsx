import {Fragment, useEffect, useRef, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {useVirtualizer} from '@tanstack/react-virtual'
import {axiosInstance} from "../../utils/axiosInstance";
import {Axios, AxiosResponse} from "axios";
import { useRouter } from 'next/router'


interface queryResult {
    username: string,
    full_name: string,
}

export default function TigerBookSearchBar(
    {defaultText, zIndex, setterFunction}:
        { defaultText: string, zIndex: number, setterFunction: (value: string) => void}) {
    const [data, setData] = useState<queryResult[]>([])
    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        setData([])
        const timer = setTimeout(async () => {
            const axios = await axiosInstance();
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api-django/search/?q=${encodeURIComponent(query)}`
            console.log(url)
            let axiosResponse: AxiosResponse = await axios.get(url)
            setData(axiosResponse.data)
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [query]);

    return (
        <Combobox value={query} className={`z-[${zIndex}] z-${zIndex}`}>
            <div className="relative mt-1 ml-4 mr-4 sm:ml-0 sm:mr-0">
                <div
                    className="relative border border-primary-200 w-full cursor-pointer
                    overflow-hidden rounded-lg bg-white text-left shadow-md
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                     focus-visible:ring-opacity-75 focus-visible:ring-offset-2
                     focus-visible:ring-offset-teal-300 sm:text-sm">
                    {/*<div className="flex flex-wrap overflow-auto items-center pl-2 pr-2">*/}
                        <Combobox.Input
                            className="w-full py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0
                        focus:outline-none
                        focus-visible:border-primary-500"
                            displayValue={(dataString) => dataString}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setterFunction(event.target.value)
                            }}
                            spellCheck={false}
                            placeholder={defaultText}
                        />
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Combobox.Options
                    >
                        {(
                            <VirtualizedList items={data ?? []}
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
                         }: { items: queryResult[] }) {
    const parentRef = useRef<HTMLDivElement>(null);
    const router = useRouter()


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
                        onClick={async () => await router.push(`/@${items?.[virtualRow.index].username}`)}
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
                        value={`${items?.[virtualRow.index].full_name} (${items?.[virtualRow.index].username})`}
                    >
                        {({selected}) => (
                            <div onClick={async () => await router.push(`/@${items?.[virtualRow.index].username}`)}>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                             {`${items?.[virtualRow.index].full_name} (${items?.[virtualRow.index].username})`}
                                    </span>
                                {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                      <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                    </span>
                                ) : null}
                            </div>
                        )}
                    </Combobox.Option>
                ))}
            </div>
        </div>
    );
}
