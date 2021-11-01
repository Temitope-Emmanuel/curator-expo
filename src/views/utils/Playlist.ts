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
    }

    handlePlaybackUpdate = async(status:AVPlaybackStatus | any) => {
        this.handleUpdate({
            ...status,
            ...(status.durationMillis && {
                totalSeconds:this.totalSeconds(status.durationMillis),
                totalTime:this.getMMSSFromMillis(status.durationMillis)
            }),
            ...(status.positionMillis && {currentTime:this.totalSeconds(status.positionMillis)}),
            ...(status.playableDurationMillis && {playableTime:this.totalSeconds(status.playableDurationMillis)})
        })
    }

    padWithZero = (number:number) => {
        const string = number.toString();
        if(number < 10){
            return "0" + string;
        }
        return string
    }
    totalSeconds = (millisSeconds:number) => {
        return millisSeconds/1000;
    }
    getMMSSFromMillis(millis:number){
        const totalSeconds = this.totalSeconds(millis);
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);
        return this.padWithZero(minutes) + ":" + this.padWithZero(seconds);
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