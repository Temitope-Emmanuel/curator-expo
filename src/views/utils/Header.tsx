import React from "react"
import { StyleSheet } from "react-native"
import useFirebaseService from "./firebase"
import { AntDesign } from "@expo/vector-icons"
import { HStack, Heading, IconButton, Avatar } from "native-base"



const Header: React.FC<{
  toggleModal: () => void
}> = ({
  toggleModal
}) => {
    const { profile, isAuthenticated } = useFirebaseService()

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
            <Avatar m={1} bg="gray.800" color="white"
            // source={{
            // uri: isAuthenticated && profile.photoURL.length ? profile.photoURL as string : undefined
            // }}
            >
              {
                isAuthenticated ? `${profile.username[0]}${profile.username[1]}`.toUpperCase() : "NE"
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