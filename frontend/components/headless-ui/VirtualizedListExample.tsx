import { Fragment, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { ArrowDown, CommentIcon } from '@SvgList'
import classNames from 'classnames'
import { useVirtualizer } from '@tanstack/react-virtual'

type ListItem = {
    value: string | number
    text: string | undefined | null
}

type Props = {
    name?: string
    items?: ListItem[]
    label?: string
    onChange?: (event: { target: any; type?: any; }) => Promise<void | boolean>;
    children?: never
    className: string
};

export default function Select({ name, label, items, className, onChange }: Props) {
    const [selected, setSelected] = useState<ListItem>();
    const [query, setQuery] = useState('');
    const btnRef = useRef<HTMLButtonElement>(null);

    const filteredItems =
        query === ''
            ? items
            : items?.filter((item: ListItem) =>
            (item?.text ?? '')
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        ) ?? [];


    var classes = classNames(
        "relative w-full cursor-default overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300",
        "mt-1 block w-full h-9 bg-background-grey border rounded text-base text-dark-grey shadow-sm placeholder-light-grey focus:bg-white focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-light disabled:bg-light-grey disabled:text-light-grey disabled:border-light-grey disabled:shadow-none invalid:border-red-100 invalid:text-light-grey focus:invalid:border-red-100 focus:invalid:ring-red-100 leading-none border-light-grey",
        className,
    );

    return (
        <label className="block">
            <span className="block text-sm font-semibold text-dark-grey">{label}</span>
            <div className="relative mt-1">
                <Combobox value={selected} onChange={(v) => { setSelected(v); onChange?.({ target: { name, value: v?.value } }); }}>
                    <div className="relative mt-1">
                        <div className={classes}>
                            <Combobox.Input onFocus={(e: any) => { e.target.select(); if (!e.relatedTarget) { btnRef?.current?.click(); } }} className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                            displayValue={(item: ListItem) => item?.text ?? ''}
                                            onChange={(event) => setQuery(event.target.value)}
                            />
                            <Combobox.Button ref={btnRef} className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ArrowDown />
                            </Combobox.Button>
                        </div>

                        <Combobox.Options>
                            {filteredItems?.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                <VirtualizedList items={filteredItems ?? []} />
                            )}
                        </Combobox.Options>
                    </div>
                </Combobox>
            </div>
        </label>
    )
}

function VirtualizedList({ items }: { items: ListItem[] }) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: items?.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 5,
    });

    return (
        <div ref={parentRef} className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                        className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-2 pr-4 ${active ? 'bg-dark-grey text-white' : 'text-gray-900'
                            }`
                        }
                        value={items?.[virtualRow.index]}
                    >
                        {({ selected, active }) => (
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {items?.[virtualRow.index].text}
                            </span>
                        )}
                    </Combobox.Option>
                ))}
            </div>

        </div>
    );
}
