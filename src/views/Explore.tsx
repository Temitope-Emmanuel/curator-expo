import React from "react"
import { RootStackParamList } from "../models/route"
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs"
import SearchBar from "../components/SearchBar"
import { Container, Flex, useDisclose } from "native-base"

const Explore:React.FC<{
    // route:BottomTabScreenProps<RootStackParamList,"Explore">
} & BottomTabScreenProps<RootStackParamList,"Explore">> = ({
    navigation,route
}) => {
    const {isOpen,onToggle} = useDisclose()

    console.log("this is the open",{isOpen})

    React.useEffect(() => {
        navigation.setOptions({
            title:"Explore"
        })
    },[])

    return(
        
        <Flex mx="2" my="1" alignItems="center">
            <SearchBar open={isOpen} toggle={onToggle} />
        </Flex>
    )
}

export default Explore