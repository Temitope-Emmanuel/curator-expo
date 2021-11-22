import React from "react"
import {Flex,Text,Image, VStack,HStack, useDisclose, IconButton} from "native-base"
import useMediaService from "./mediaPlayer"
import {FontAwesome5,MaterialCommunityIcons} from "@expo/vector-icons"
import ToggleComponent from "../../components/ToggleComponent"


export const MediaLayoutProvider = <P extends object>(Component: React.ComponentType<P>) => {
    return function Provider({ ...props }) {
        const {currentMedia} = useMediaService()
        const {isOpen:open,onToggle:toggle} = useDisclose(true)
        
        return (
            <>
                <Component {...props as P} />
                <Flex height="7.5%" width="100%" flexDirection="row">
                    <Image alt="this is an image" 
                        source={require("../../assets/Images/cover.jpg")}
                         style={{width:100, height:100}} 
                    />
                    <VStack flex={1} p={3}>
                        <Text>
                            Cry your heart out
                        </Text>
                        <Text>
                            Adele
                        </Text>
                    </VStack>
                    <HStack ml="auto" flex={1} justifyContent="flex-end"
                     alignItems="center" space={3}>
                         <ToggleComponent open={open} toggle={toggle}
                            FirstComponent={
                                <IconButton position="absolute"
                                    _icon={{
                                        as:FontAwesome5,
                                        name:"play"
                                    }}
                                />
                            }
                            SecondComponent={
                                <IconButton position="absolute"
                                    _icon={{
                                        as:FontAwesome5,
                                        name:"pause"
                                    }}
                                />
                            }
                         />
                        <IconButton
                            _icon={{
                                as:MaterialCommunityIcons,
                                name:"skip-next",
                                size:"lg"
                            }}
                        />
                    </HStack>
                </Flex>
            </>
        )
    }
}
