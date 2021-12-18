import { StorageType, useAsyncStorage } from "./AsyncStorage"
import { useToast } from "native-base";
import React from "react";
import TrackPlayer,{Capability,RepeatMode} from "react-native-track-player"
import { defaultMedia, IMedia, IMediaPlaylist } from "../../models/Media"
import { IPlaylistState } from "../../models/PlaylistState";
import { PlaylistClass } from "./Playlist";
import { createGenericContext } from "./hooks";



export class TrackPlayerClass {
    media:IMedia<"audio">
    constructor({media}:{
        media:IMedia<"audio">
    }) {
        this.init()
        this.media = media;
    }

    async init() {
        await TrackPlayer.setupPlayer()
        await TrackPlayer.updateOptions({
            stopWithApp:false,
            capabilities:[
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop
            ],
            compactCapabilities:[Capability.Play,Capability.Pause]
        })
        await TrackPlayer.add({
            url:this.media.uri,
            title:this.media.name,
            artist:this.media.name,
            duration:this.media.size
        })

        TrackPlayer.setRepeatMode(RepeatMode.Queue)
    }
}

const [useTrackService, TrackServiceContextProvider] = createGenericContext<{
    // getAudio: (mediaId:string) => Promise<StorageType>;
    // seekTo: (positionNumber: number) => Promise<void>
    // changeTrack:(media:IMedia<"audio">) => void;
    // currentMedia:IMedia<"audio">;
    // togglePlaying:() => void;
    // state:IPlaylistState;
    // mediaArr:number[];
    // start:() => void;
    // seeking:boolean;
    // playing:boolean;
}>()

export const TrackServiceProvider = <P extends object>(Component: React.ComponentType<P>) => {
    return function Provider({ ...props }) {
        const toast = useToast()
        const [playing,setPlaying] = React.useState<boolean>(false)
        const [seeking,setSeeking] = React.useState<boolean>(false)
        const [state,setState] = React.useState<IPlaylistState>()
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

        React.useEffect(() => {

        },[])

        return(
            <TrackServiceContextProvider
                value={{}}
            >
                <Component {...props as P} />
            </TrackServiceContextProvider>
        )
    }
}

export type mediaServiceType = ReturnType<typeof useTrackService>

export default useTrackService