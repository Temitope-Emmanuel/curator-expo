import React from "react"
import { Flex,Text } from "native-base"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { RootStackParamList } from "../models/route"
import Alert from "../components/Alert"
import useNotification from "../utils/notification"
import useFirebaseService from "../utils/firebase"


const Notification:React.FC<{
} & BottomTabScreenProps<RootStackParamList,"Notification">> = ({
    navigation
}) => {
    const {all:notification,handleNotificationVisibiltyChange} = useNotification()
    const {firestore} = useFirebaseService()
    
    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus",() => {
            handleNotificationVisibiltyChange()
        })
        return unsubscribe
    },[navigation])

    return(
        <Flex flex={1}>
            {
                notification.length ? notification.map(({description,id,status,type},key) => (
                    <Alert title={type}  key={id} {...{description,status}} />
                )) : 
                <Text textAlign="center" my="auto" fontSize="xl">
                    No notifications yet
                </Text>
            }
        </Flex>
    )
}


export default Notification