import React from "react"
import { createGenericContext } from "./hooks"
import { defaultMedia, IMedia } from "../../models/Media"
import { useToast } from "native-base"
import { useAsyncStorage } from "./AsyncStorage"
import { PlaylistClass } from "./Playlist"
import waveform from "../../assets/data/waveform.json"
import { IPlaylistState } from "../../models/PlaylistState"

const [useMediaService, MediaServiceContextProvider] = createGenericContext<{
    seekTo: (positionNumber: number) => Promise<void>
    changeTrack:(media:IMedia<"audio">) => void;
    getAudio: (mediaId:string) => Promise<void>;
    currentMedia:IMedia<"audio">;
    togglePlaying:() => void;
    start:() => void;
}>()

export const MediaServiceProvider = <P extends object>(Component: React.ComponentType<P>) => {
    return function Provider({ ...props }) {
        const toast = useToast()
        const [playing,setPlaying] = React.useState<boolean>(false)
        const [seeking,setSeeking] = React.useState<boolean>(false)
        const [state,setState] = React.useState<IPlaylistState>()
        const playlist = React.useRef<PlaylistClass>()
        const [mediaArr,setMediaArr] = React.useState<number[]>([])
        const [currentMedia,setCurrentMedia] = React.useState<IMedia<"audio">>(defaultMedia)
        const [mediaList, mediaListAsyncStorage] = useAsyncStorage({
            initialState: [],
            key: "@@media",
            toast
        })
        const [playlistDetail, playlistAsyncStorage] = useAsyncStorage({
            initialState: [],
            key: "@@playlist",
            toast
        })

        const createAudioArr = (milliSeconds: number) => {
            const seconds = Math.ceil(milliSeconds / 1000);
            const array = waveform.samples.slice(0,seconds)
            setMediaArr(array)
        }

        const getAudio = async (mediaId:string) => {
            const response = await mediaListAsyncStorage.getData(mediaId)
            if(response){
                setCurrentMedia(response as IMedia<"audio">)
            }
        }

        const start = () => {
            if(!playlist.current){
                playlist.current = new PlaylistClass({
                    toast,
                    handleStatusUpdate:setState
                })
            }
        }

        const changeTrack = (media:IMedia<"audio">) => {
            playlist.current.loadNewPlaybackInstance(media)
        }

        const toggleMediaState = async (shouldPlay: boolean) => {
            if (playlist.current) {
                if (shouldPlay) {
                    await playlist.current.playbackInstance.playAsync()
                } else {
                    await playlist.current.playbackInstance.pauseAsync()
                }
            }
        }
        const togglePlaying = React.useCallback(() => {
            toggleMediaState(!playing)
        },[playing])
        const seekTo = async (positionNumber:number) => {
            const response = await playlist.current.playbackInstance.setStatusAsync({
                positionMillis:positionNumber
            })
            console.log('this is the response',JSON.stringify(response))
        }
        const savedPlaylistDetail = () => {}
        React.useEffect(() => {
            if(state){
                if(mediaArr.length <= 0 && state.durationMillis){
                    createAudioArr(state.durationMillis)
                }
                if(state.didJustFinish){
                    savedPlaylistDetail()
                }
                if(state.isPlaying !== playing){
                    const currentPlaying = state.didJustFinish ? true : state.isPlaying;
                    setPlaying(currentPlaying)
                }
            }else{
                if(playing){
                    setPlaying(false)
                }
            }
        },[state])

        React.useEffect(() => {
            if(currentMedia.id){
                changeTrack(currentMedia)
            }
        },[currentMedia])

        return (
            <MediaServiceContextProvider
                value={{
                    currentMedia,
                    changeTrack,
                    togglePlaying,
                    getAudio,
                    seekTo,
                    start
                }}
            >
                <Component {...props as P} />
            </MediaServiceContextProvider>
        )
    }
}

export type mediaServiceType = ReturnType<typeof useMediaService>

export default useMediaService