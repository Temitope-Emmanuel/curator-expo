import React from "react"
import {StyleSheet} from "react-native"
// import useFirebaseService from "@src/utils/Firebase/Firebase"
import AntIcon from "@expo/vector-icons/AntDesign"
import { HStack, Heading, IconButton, Avatar } from "native-base"



const Header:React.FC<{
    toggleModal:() => void
}> = ({
    toggleModal
}) => {
    const {isAuthenticated,profile} = {
        isAuthenticated:false,
        profile:{
            photoURL:"",
            displayName:""
        }
    }
    // const {currentUser:{
    //     isAuthenticated,profile
    // }} = useFirebaseService()
    return(
        <HStack style={styles.nav}>
        <HStack space={1} style={styles.subNav}>
          <AntIcon size={20} style={{ color: "#FD4D4D" }} name="book" />
          <Heading 
          // color="#FD4D4D"
          >
            Curator
          </Heading>
        </HStack>
        <IconButton
        icon={
          <Avatar m={2}
            source={{
              uri:isAuthenticated && profile.photoURL.length ? profile.photoURL as string : undefined
            }}
          >
            {
              isAuthenticated ? profile.displayName?.split(" ").map(item => item.charAt(0)).join("") : "NE"
            }
          </Avatar>
        }
         onPress={toggleModal}/>
      </HStack>
      
    )
}

const styles = StyleSheet.create({
    nav: {
      alignItems: 'center',
      justifyContent: "space-between"
    },
    subNav: {
      flex: 1,
      alignItems: 'center'
    }
  })
  

export default Header