import React from "react"
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { Flex, VStack, HStack, IconButton, Image, Text } from "native-base"
import ToggleComponent from "./ToggleComponent"
import { Slider } from "./Slider"

const MiniPlayer:React.FC<{
    playing:boolean;
    artist:string;
    name:string
    showNext?:boolean
    togglePlaying:() => void
}> = ({
    showNext,playing,togglePlaying,
    artist,name
}) => {
    const progress = {
        position:1000,
        duration:10000,
        buffered:4000
    }
    return (
        <Flex flexDirection="row" alignItems="center">
            <Image alt="this is an image"
                source={require("../assets/Images/cover.jpg")}
                style={{ width: 100, height: 100 }}
            />
            <Flex flex={1}>
                <Flex justifyContent="space-between"
                 flexDirection="row"
                >
                    <VStack>
                        <Text>
                            {name}
                        </Text>
                        <Text>
                            {artist}
                        </Text>
                    </VStack>
                    <HStack>
                        <ToggleComponent open={playing} toggle={togglePlaying}
                            FirstComponent={
                                <IconButton position="absolute"
                                    _icon={{
                                        as: FontAwesome5,
                                        name: "pause"
                                    }}
                                />
                            }
                            SecondComponent={
                                <IconButton position="absolute"
                                    _icon={{
                                        as: FontAwesome5,
                                        name: "play"
                                    }}
                                />
                            }
                        />
                        {
                            showNext &&
                            <IconButton
                                _icon={{
                                    as: MaterialCommunityIcons,
                                    name: "skip-next",
                                    size: "lg"
                                }}
                            />
                        }
                    </HStack>
                </Flex>
                <Slider value={(progress.position / progress.duration) * 100}
                    minValue={0} maxValue={100} defaultValue={0}
                >
                    <Slider.Track>
                        <Slider.FilledTrack />
                    </Slider.Track>
                </Slider>
            </Flex>
        </Flex>
    )
}

export default MiniPlayer