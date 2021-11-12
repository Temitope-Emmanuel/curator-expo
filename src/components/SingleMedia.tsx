import React from "react"
import {StyleSheet} from "react-native"
import { IMedia } from "../models/Media"
import {Box,Text,HStack,Image} from "native-base"
import TouchableScale from "react-native-touchable-scale"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

const SingleMedia:React.FC<IMedia<"audio"> & {
    setMedia:() => void;
    onClick:() => void;
}> = ({setMedia,onClick,name,description,...props}) => {

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
                    <Image alt="this is an image" source={require("../assets/Images/cover.jpg")} style={{width:100, height:100}} />
                    <Box style={{justifyContent:"center"}}>
                        <Text>
                            {name}
                        </Text>
                        <Text>
                            {description ?? "This is a description"}
                        </Text>
                    </Box>
                </HStack>
            </TouchableScale>
            <MaterialIcons size={20} onPress={setMedia} 
                color="#FD4D4D"
                name="more-vert"
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