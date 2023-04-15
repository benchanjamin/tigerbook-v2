import React, {useContext} from 'react';
import Notification from "@components/notification/Notification";
import FlowbiteContext from "../context/FlowbiteContext"
import NotificationContext from "../context/NotificationContext";


function Layout({children}) {
    const notificationCtx = useContext(NotificationContext)
    const activeNotification = notificationCtx.notification


    return (
        <>
            <FlowbiteContext>
                {children}
                {activeNotification && <Notification description={activeNotification.description}/>}
            </FlowbiteContext>
        </>
    );
}

export default Layout;
