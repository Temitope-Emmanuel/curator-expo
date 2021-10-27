import { defaultMedia, IMedia } from "../../models/Media";
import { IToastProps } from "../../models/Toast";
import { Audio,AVPlaybackStatus, AVPlaybackStatusToSet } from "expo-av"
import { AVPlaybackSource } from "expo-av/build/AV";

type ISetStatus<K> = React.Dispatch<React.SetStateAction<K>>;

export class PlaylistClass {
    toast:IToastProps;
    currentMedia:IMedia<'audio'> = defaultMedia;
    seeking:boolean;
    shouldPlayAtEndOfSeek:boolean;
    playbackInstance:Audio.Sound | null = null;
    handleUpdate:ISetStatus<AVPlaybackStatus> = null;
    constructor({
        currentMedia,toast,handleStatusUpdate
    }:{
        toast:IToastProps;
        handleStatusUpdate:ISetStatus<AVPlaybackStatus>;
        currentMedia:IMedia<"audio">
    }){
        this.toast = toast;
        this.handleUpdate = handleStatusUpdate;
        this.currentMedia = currentMedia;
        this.init()
        console.log(this.handleUpdate,handleStatusUpdate)
    }

    init() {
        Audio.setAudioModeAsync({
            allowsRecordingIOS:false,
            staysActiveInBackground:true,
            interruptionModeIOS:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playsInSilentModeIOS:true,
            shouldDuckAndroid:true,
            interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid:true
        })
    }

    async loadNewPlaybackInstance(media:IMedia<"audio">) {
        if(this.playbackInstance != null){
            await this.playbackInstance.unloadAsync()
            this.playbackInstance = null;
        }
        const initialPlayback:AVPlaybackSource = {
            uri:media.uri
        }
        const initialStatus:AVPlaybackStatusToSet = {
            shouldPlay:true,
            rate:1.0,
            shouldCorrectPitch:true,
            volume:1.0,
            isMuted:false,
            isLooping:false
        }
        const {sound,status} = await Audio.Sound.createAsync(
            initialPlayback,initialStatus
            ,this.handlePlaybackUpdate
        )
        this.playbackInstance = sound;
        this.handlePlaybackUpdate(status)
        // console.log("this is handle status update",{handleStatusUpdate:this.handlePlaybackUpdate})
    }

    handlePlaybackUpdate = async(status:AVPlaybackStatus) => {
        this.handleUpdate(status)
    }

    async stop() {
        if(this.playbackInstance){
            await this.playbackInstance.unloadAsync()
            this.toast.show({
                title:"Successfully stopped audio",
                status:"success"
            })
            this.playbackInstance = null
        }
    }
    
}