import {Fragment, useEffect, useRef, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {useVirtualizer} from '@tanstack/react-virtual'
import {axiosInstance} from "@utils/axiosInstance";
import {Axios, AxiosResponse} from "axios";
import { useRouter } from 'next/router'


interface queryResult {
    username: string,
    full_name: string,
}

export default function TigerBookFFABar(
    {defaultText, zIndex, setterFunction, initialSelected}:
        { defaultText: string, zIndex: number, setterFunction: (value: string) => void, initialSelected: string}) {
    const [query, setQuery] = useState<string>(initialSelected)

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
            </div>
        </Combobox>
    )
}


