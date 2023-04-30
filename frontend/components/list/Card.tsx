import React, {useEffect, useRef, useState} from 'react';
import Image from "next/legacy/image";
import {ListUser} from "@types/types";
import {useRouter} from "next/router";
import {Spinner} from "flowbite-react";


function Card({personData, isLast, newLimit}: { personData: ListUser, isLast: boolean, newLimit: () => void}) {
    const cardRef = useRef();
    const router = useRouter();
    const [isImageReady, setIsImageReady] = useState(false);


    useEffect(() => {
        if (!cardRef?.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (isLast && entry.isIntersecting) {
                newLimit();
                observer.unobserve(entry.target);
            }
        });

        observer.observe(cardRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLast]);

    return (
        <div
            onClick={() => router.push(`/@${personData.username}`)}
            className="flex flex-col col-span-1 cursor-pointer group rounded-t-xl overflow-hidden"
            ref={cardRef}
        >
            {/*<div className="w-full">*/}
                <div
                    className="aspect-square w-full relative bg-gray-200"
                >
                    {!isImageReady &&
                        <Spinner
                            id="spinner"
                            color="warning"
                            className="absolute m-auto left-0 right-0 top-0 bottom-0"/>}
                    <Image
                        layout={"fill"}
                        onLoad={() => {
                            setIsImageReady(true)
                            setIsImageReady(false)
                        }}
                        className="object-cover h-full w-full group-hover:scale-110 transition rounded-t-xl"
                        src={personData.profile_pic_url != null ? personData.profile_pic_url : "/static/placeholder.jpg"}
                        alt={`Picture of ${personData.full_name}`}
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 py-6 px-4 text-white duration-500 bg-gray-700
                     opacity-0 group-hover:opacity-100 bg-opacity-90 align-middle">
                        <div className="flex flex-col gap-y-3 justify-center items-center h-full">
                            <span className="text-sm text-center">
                                Res College: {personData.residential_college}
                            </span>
                            <span className="text-sm text-center">
                                Track: {personData.track}
                            </span>
                            <span className="text-sm text-center">
                                Username: {personData.username}
                            </span>
                            <span className="text-sm text-center">
                                IsLast: {isLast.toString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-grow gap-y-1 rounded-b-xl bg-gray-200 dark:bg-dark p-2 px-3 h-1/2">
                    <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                        {personData.full_name} {`\'${String(personData.class_year).substring(2, 4)}`} {personData.pronouns && `(${personData.pronouns})`}
                    </h5>
                    <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                        {personData.concentration}
                    </p>
                </div>
            {/*</div>*/}
        </div>
    );
}

export default Card;
