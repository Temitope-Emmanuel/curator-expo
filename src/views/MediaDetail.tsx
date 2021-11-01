import React from "react"
import WaveForm from "../components/WaveForm"
import { AVPlaybackStatus} from "expo-av"
import { useToast, useDisclose, Flex } from "native-base";
import { AsyncStorageClass } from "./utils/AsyncStorage";
import { PlaylistClass } from "./utils/Playlist";
import { IMedia } from "../models/Media";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../models/route";
import {StackNavigationProp} from "@react-navigation/stack"
import { PLAYLIST_KEY, STICK_FULL_WIDTH } from "./utils/constants"
import * as FileSystem from "expo-file-system"
import * as AudioEngine from "web-audio-engine"
import {decode} from "base64-arraybuffer"
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useWindowDimensions } from "react-native";

const MediaDetail:React.FC<{
    route:RouteProp<RootStackParamList,"Media Detail">;
    navigation:StackNavigationProp<RootStackParamList,"Media Detail">
}> = ({
    route
}) => {
    const [playlistArr,setPlaylistArr] = React.useState<number[]>([])
    const toast = useToast();
    const playing = useSharedValue(false)
    const [audioData,setAudioData] = React.useState(new Float32Array(0))
    const audioCtx = React.useRef(null)
    const [state,setState] = React.useState<AVPlaybackStatus>()
    const asyncStorage = React.useRef<AsyncStorageClass>()
    const playlist = React.useRef<PlaylistClass>()
    const {isOpen:openAddNote,onToggle:toggleAddNote} = useDisclose()
    const [volume,setVolume] = React.useState(1.0)
    const [currentMedia,setCurrentMedia] = React.useState<IMedia<"audio">>()

    const { width } = useWindowDimensions();
    const sliding = useSharedValue(false)
    const panX = useSharedValue(0)
    const maxPanX = -width;

    const createAudioArr = (milliSeconds:number) => {
        const seconds = Math.ceil(milliSeconds/1000);
        const array = new Array(seconds).fill("").map((item) => (
            Math.ceil(Math.random() * 50) + 40
        ))
        setPlaylistArr(array)
    }

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

    // Suspend functionality
    const createAudioContext = async (base64String:any) => {

        const audioCtx = new AudioEngine.default.WebAudioContext({
            context:new AudioEngine.default.OfflineAudioContext()
        })
        const arrayBuffer = decode(base64String)
        
        const channels = 1;
        const frameCount = audioCtx.sampleRate * 1;

        // Add arrayBuffer to audioBuffer
        const createdBuffer = audioCtx.createBuffer(channels,frameCount,audioCtx.sampleRate)
        const nowBuffering = createdBuffer.getChannelData(0)
        for(let i = 0; i < createdBuffer.length;i++){
            nowBuffering[i] = arrayBuffer[i]
        }

        // Create a buffer source

        const source = audioCtx.createBufferSource();
        const analyser = audioCtx.analyser;

        source.buffer = createdBuffer;
        source.connect(analyser)
        source.connect(audioCtx.destination)

        source.start()

        // console.log(createBuffer.length)

        // const view = new Uint8Array(arrayBuffer)
        // console.log(view.)
        // console.log("This is the view",{view})
        // const decodedData = await audioCtx.decodeAudioData(arrayBuffer)
        // console.log(JSON.stringify(arrayBuffer,null,2))
        // const audioBuffer = audioCtx.createBuffer(arrayBuffer)
        // console.log("this is the audioBuffer",audioBuffer.getChannel())
        // console.log(audioCtx.createBufferSource,audioCtx.createBuffer)

        
        // console.log("this is the arrayBuffer",decodedData)
        // console.log("This is the new Response",{newResponse})

        // audioCtx.decodeAudioData(base64String).then(response => {
        //     console.log("this is the response",{response})
        // })

        // console.log(base64String)
        // const analyser = audioCtx.createAnalyser()
        // const dataArray = new Float32Array(analyser.frequencyBinCount)
        // console.log(audioCtx.decodeAudioData)

        // const AudioCtx = AudioEngine.WebAudioContext
        // const audioCtx = new AudioCtx({
        //     context:new AudioCtx(),
        //     destination:undefined
        // })

        // console.log({audioCtx})
        // const audioData = audioCtx.exportAsAudioData();
        // const analyser = audioCtx.createAnalyser()
        // console.log("this is the audioCtx",JSON.stringify(audioData,null,2))
        // const dataArray = new Float32Array(analyser.frequencyBinCount)
        // const source = audioCtx.createMediaStreamSource(base64String)
        // console.log("this is the dataArray",{source})
        // source.connect(analyser)

        // analyser.getFloatTimeDomainData(dataArray)
        
        // console.log("this is the data array",{dataArray})
    }

    const getFileInfo = async (uri:string) => {
        // try{
        //     const res = await FileSystem.readAsStringAsync(`file://${uri}`,{
        //         encoding:"base64"
        //     })
        //     createAudioContext(res)
        // }catch(err){
        //     console.log("there's been an error",{err})
        // }
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
        if (currentMedia?.uri && !state) {
            start(currentMedia)
            // getFileInfo(currentMedia.uri)
        }
    }, [currentMedia])

    const updatePosition = (currentTime:number) => {
        'worklet';

        if (playing.value && !sliding.value && panX.value > maxPanX) {
            const currentPanX = currentTime * STICK_FULL_WIDTH
            panX.value = withTiming(Number.isNaN(currentPanX) ? 1 : -currentPanX)
        }
    }

    React.useEffect(() => {
        if(playlistArr.length <= 0 && (state as any)?.durationMillis){
            createAudioArr((state as any).durationMillis)
        }
        if((state as any)?.isPlaying){
            playing.value = (state as any).didJustFinish ? true : (state as any).isPlaying
            updatePosition((state as any).currentTime)
        }else{
            if(playing.value){
                playing.value = false
            }
        }
    },[state])

    const toggleSetPlaying = () => {
        "worklet"
        playing.value = !playing.value
    }
    

    return(
        <Flex style={{flex:1,backgroundColor:"black"}}>
            <WaveForm samples={playlistArr} playing={playing}
             panX={panX} toggleSetPlaying={toggleSetPlaying}
            />
        </Flex>
    )
}

export default MediaDetail