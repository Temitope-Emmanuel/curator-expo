import React from "react"
import useMediaService from "./mediaPlayer"
import MiniPlayer from "../components/MiniPlayer"
import { Flex } from "native-base"


export const MediaLayoutProvider = <P extends object>(Component: React.ComponentType<P>) => {
    return function Provider({ ...props }) {
        const {currentMedia,playing,togglePlaying} = useMediaService()
        
        return (
            <>
                <Component {...props as P} />
                {/* <Flex height="15%">
                    <MiniPlayer artist="omoOlogoYhammy" name="No child left behind"
                        {...{playing,togglePlaying}} />
                </Flex> */}
            </>
        )
    }
}
