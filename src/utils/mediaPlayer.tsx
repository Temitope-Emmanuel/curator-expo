import React from "react"
import { createGenericContext } from "./hooks/useGenericContext"
import { defaultMedia, IMedia, IMediaPlaylist } from "../models/Media"
import { useToast } from "native-base"
import { StorageType, useAsyncStorage } from "./AsyncStorage"
import { PlaylistClass } from "./Playlist"
import waveform from "../assets/data/waveform.json"
import { IPlaylistState } from "../models/PlaylistState"

const [useMediaService, MediaServiceContextProvider] = createGenericContext<{
    getAudio: (mediaId:string) => Promise<StorageType>;
    seekTo: (positionNumber: number) => Promise<void>
    changeTrack:(media:IMedia<"audio">) => void;
    currentMedia:IMedia<"audio">;
    togglePlaying:() => void;
    state:IPlaylistState;
    mediaArr:number[];
    start:() => void;
    seeking:boolean;
    playing:boolean;
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
        const [mediaList, mediaListAsyncStorage] = useAsyncStorage<IMedia<"audio">>({
            initialState: [],
            key: "@@media",
            toast
        })
        const [playlistDetail, playlistAsyncStorage] = useAsyncStorage<IMediaPlaylist>({
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
            return response
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

        const savedPlaylistDetail = () => {
            return playlistAsyncStorage.addData({
                id: currentMedia.name,
                uri: currentMedia.uri,
                position: (state as any)?.positionMillis,
                totalTimesPlayed: 1,
                // description: "",
                name: currentMedia.name,
                // size: 0,
                timeline: []
            })
        }

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
            if(currentMedia?.id){
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
                    mediaArr,
                    playing,
                    seeking,
                    seekTo,
                    state,
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