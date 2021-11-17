import React from "react"
import { StyleSheet } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { HStack, Heading, IconButton, Avatar } from "native-base"
import useFirebaseService from "./firebase"



const Header: React.FC<{
  toggleModal: () => void
}> = ({
  toggleModal
}) => {
  const {currentUser} = useFirebaseService()
  const { isAuthenticated, profile } = {
    isAuthenticated: false,
    profile: {
      photoURL: "",
      displayName: ""
    }
  }

  return (
    <HStack style={styles.nav}>
      <HStack space={1} style={styles.subNav}>
        {/* <AntDesign size={15} style={{ color: "#FD4D4D" }} name="book" /> */}
        <Heading
          // color="#FD4D4D"
        >
          Curator
        </Heading>
      </HStack>
      <IconButton
        icon={
          <Avatar m={1}
            source={{
              uri: isAuthenticated && profile.photoURL.length ? profile.photoURL as string : undefined
            }}
          >
            {
              isAuthenticated ? profile.displayName?.split(" ").map(item => item.charAt(0)).join("") : "NE"
            }
          </Avatar>
        }
        onPress={toggleModal} />
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