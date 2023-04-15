import {createContext, useState} from "react";


export const NotificationContext = createContext({
    notification: null,
    showNotification: function (notificationData) {
    },
    hideNotification: function () {
    },
})

export function NotificationContextProvider({children}) {
    const [activeNotification, setActiveNotification] = useState(undefined);

    function showNotificationHandler(notificationData) {
        setActiveNotification(notificationData)

    }

    function hideNotificationHandler() {
        setActiveNotification(null)
    }

    const context = {
        notification: activeNotification,
        showNotification: showNotificationHandler,
        hideNotification: hideNotificationHandler,
    }

    return (
        <NotificationContext.Provider value={context}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext
