import React from "react"
import {Box,Text,HStack,Image} from "native-base"
import {StyleSheet} from "react-native"
import TouchableScale from "react-native-touchable-scale"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { IMedia } from "../models/Media"

const SingleMedia:React.FC<IMedia<"audio"> & {
    setMedia:() => void;
    onClick:() => void;
}> = ({setMedia,onClick,title,description,...props}) => {
    const [imageUrl,setImageUrl] = React.useState('https://images.unsplash.com/photo-1458560871784-56d23406c091?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bXVzaWN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')
    

    return(
        <HStack style={styles.root}>
            <TouchableScale
                activeScale={0.9}
                tension={50}
                friction={7}
                useNativeDriver
                onPress={onClick}
            >
                <HStack space={2}>
                    <Image alt="imaged" source={{
                        uri:imageUrl
                    }} size={"md"} />
                    <Box style={{justifyContent:"center"}}>
                        <Text>
                            {title}
                        </Text>
                        <Text>
                            {description}
                        </Text>
                    </Box>
                </HStack>
            </TouchableScale>
            <MaterialIcons size={20} onPress={setMedia} 
                color="#FD4D4D" name="more-vert"
            />
        </HStack>
    )
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        paddingRight:10,
        alignItems:"center",
        justifyContent:"space-between"
    }
})

export default SingleMedia