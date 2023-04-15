import React, {useContext} from 'react';
import {Toast} from "flowbite-react";
import {HiX} from "react-icons/hi";
import NotificationContext from "../../context/NotificationContext";

function Notification({description}) {
    const context = useContext(NotificationContext);

    return (
        <div className="fixed bottom-2 right-2 z-100">
            <Toast>
                <div
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                    <HiX className="h-5 w-5"/>
                </div>
                <div className="ml-3 text-sm font-normal">
                    {description}
                </div>
                <Toast.Toggle onClick={context.hideNotification}/>
            </Toast>
        </div>
    );
}

export default Notification;
