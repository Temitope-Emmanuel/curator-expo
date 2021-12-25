import React from "react"
import { createGenericContext } from "./hooks/useGenericContext"
import { INotification } from "../models/notification"
import useFirebaseService from "./firebase"

const [useNotification, NotificationContextProvider] = createGenericContext<{
    unseen: INotification[],
    handleNotificationVisibiltyChange: () => void;
    all: INotification[]
}>()

export const NotificationProvider = <P extends object>(Component: React.ComponentType<P>) => {

    return function Provider({ ...props }) {
        const { firestore, profile } = useFirebaseService()
        const [unseenNotification, setUnseenNotification] = React.useState<INotification[]>([])
        const [notification, setNotification] = React.useState<INotification[]>([])
        const [listeners, setListeners] = React.useState([])

        const setUpNotification = () => {

            const notificationListener = firestore.collection("notifications")
            .doc(profile.id).collection("notify").onSnapshot(data => {
                const newNotification = data.docs.map(item => ({
                    id: item.id,
                    ...item.data()
                })) as INotification[];
                const unseenNotification = newNotification.filter(item => !item.seen)
                setUnseenNotification(unseenNotification)
                setNotification(newNotification)
            })
            setListeners([...listeners, notificationListener])
        }

        const handleNotificationVisibiltyChange = async () => {
            const notificationQuery = unseenNotification.map(item => {
                return firestore.collection("notifications").doc(profile.id).collection("notify").doc(item.id).update({
                    seen: true
                })
            })
            Promise.all(notificationQuery).then(data => {
                // console.log("this is the responseArr",responseArr)
            })
        }

        React.useEffect(() => {
            return () => {
                listeners.map(item => {
                    item()
                })
            }
        }, [])

        React.useEffect(() => {
            if (profile?.id && !listeners.length) {
                setUpNotification()
            }
        }, [profile])

        return (
            <NotificationContextProvider
                value={{
                    all: notification,
                    unseen: unseenNotification,
                    handleNotificationVisibiltyChange
                }}
            >
                <Component {...props as P} />
            </NotificationContextProvider>
        )
    }
}

export type notificationServiceType = ReturnType<typeof useNotification>

export default useNotification