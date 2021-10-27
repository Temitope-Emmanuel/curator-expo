import React from "react"
import AnimationExample2 from "../components/AnimationExample2"
import { AVPlaybackStatus} from "expo-av"
import { useToast, useDisclose } from "native-base";
import { AsyncStorageClass } from "./utils/AsyncStorage";
import { PlaylistClass } from "./utils/Playlist";
import { IMedia } from "../models/Media";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../models/route";
import {StackNavigationProp} from "@react-navigation/stack"
import { PLAYLIST_KEY } from "./utils/constants"
import AudioEngine from "web-audio-engine"


const MediaDetail:React.FC<{
    route:RouteProp<RootStackParamList,"Media Detail">;
    navigation:StackNavigationProp<RootStackParamList,"Media Detail">
}> = ({
    navigation,route
}) => {
    const toast = useToast();
    const [state,setState] = React.useState<AVPlaybackStatus>()
    const asyncStorage = React.useRef<AsyncStorageClass>()
    const playlist = React.useRef<PlaylistClass>()
    const {isOpen:openAddNote,onToggle:toggleAddNote} = useDisclose()
    const [volume,setVolume] = React.useState(1.0)
    const [currentMedia,setCurrentMedia] = React.useState<IMedia<"audio">>()

    const getAudio = async () => {
        const response = await asyncStorage.current?.getData()
        if (response) {
            const parsedResponse: IMedia<"audio">[] = JSON.parse(response)
            const foundMedia = parsedResponse.find(item => item.uri === route.params.uri)
            if (foundMedia?.uri) {
                setCurrentMedia(foundMedia)
            }
        }
    }

    const start = (media: IMedia<"audio">) => {
        if (media?.uri) {
            // Check if an audio has been initialized
            if (!playlist.current) {
                // Initialize an audio
                playlist.current = new PlaylistClass({
                    toast,
                    currentMedia: media,
                    handleStatusUpdate:setState
                })
            }
            playlist.current?.loadNewPlaybackInstance(media)
        }
    }

    const createAudioContext = (base64String:any) => {
        
        const AudioContext = AudioEngine.OfflineAudioContext
        const audioContext = new AudioContext()
        const result = audioContext.decodeAudioData(base64String)
        console.log("this is the tesult",{result})
    }

    React.useEffect(() => {
        asyncStorage.current = new AsyncStorageClass({
            key: PLAYLIST_KEY,
            toast
        })
        getAudio()
        return () => {
            if (playlist.current) {
                playlist.current?.stop()
            }
        }
    }, [])
    
    React.useEffect(() => {
        if (currentMedia?.uri) {
            start(currentMedia)
        }
    }, [currentMedia])

    return(
        <AnimationExample2/>
    )
}

export default MediaDetail