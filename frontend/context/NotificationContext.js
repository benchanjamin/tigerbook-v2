import {createContext, useState, useEffect} from "react";


export const NotificationContext = createContext({
    notification: null,
    showNotification: function (notificationData) {
    },
    hideNotification: function () {
    },
})

export function NotificationContextProvider({children}) {
    const [activeNotification, setActiveNotification] = useState(undefined);

    useEffect(() => {
            if (activeNotification) {
                const timer = setTimeout(() => {
                    setActiveNotification(null)
                }, 3000)

                return () => {
                    clearTimeout(timer)
                }
            }

        },[activeNotification]
    )

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
