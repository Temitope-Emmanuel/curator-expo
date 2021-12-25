import { defaultMedia, IMedia } from "../models/Media";
import { IToastProps } from "../models/Toast";
import { Audio,AVPlaybackStatus, AVPlaybackStatusToSet } from "expo-av"
import { AVPlaybackSource } from "expo-av/build/AV";

type ISetStatus<K> = React.Dispatch<React.SetStateAction<K>>;

export class TimeFormatter {
    totalSeconds = (millisSeconds:number) => {
        return Math.round(millisSeconds/1000);
    }
    padWithZero = (number:number) => {
        const string = number.toString();
        if(number < 10){
            return "0" + string;
        }
        return string
    }
    getMMSSFromMillis(millis:number){
        const totalSeconds = this.totalSeconds(millis);
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);
        return this.padWithZero(minutes) + ":" + this.padWithZero(seconds);
    }
}
export class PlaylistClass {
    toast:IToastProps;
    currentMedia:IMedia<'audio'> = defaultMedia;
    formatTime:TimeFormatter
    seeking:boolean;
    shouldPlayAtEndOfSeek:boolean;
    playbackInstance:Audio.Sound = null;
    handleUpdate:ISetStatus<AVPlaybackStatus> = null;
    constructor({
        currentMedia,toast,handleStatusUpdate
    }:{
        toast:IToastProps;
        handleStatusUpdate:ISetStatus<AVPlaybackStatus>;
        currentMedia?:IMedia<"audio">
    }){
        this.toast = toast;
        this.formatTime = new TimeFormatter()
        this.handleUpdate = handleStatusUpdate;
        if(currentMedia?.id){
            this.currentMedia = currentMedia;
        }
        this.init()
    }
    init() {
        Audio.setAudioModeAsync({
            // allowsRecordingIOS:false,
            staysActiveInBackground:true,
            // interruptionModeIOS:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            // playsInSilentModeIOS:true,
            shouldDuckAndroid:true,
            interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid:true,

        })
    }
    async loadNewPlaybackInstance(media:IMedia<"audio">) {
        console.log("we are reaching here")
        try{
            if(this.playbackInstance != null){
                await this.playbackInstance.unloadAsync()
                this.playbackInstance = null;
                this.currentMedia = defaultMedia;
            }
            const initialPlayback:AVPlaybackSource = {
                uri:media.uri
            }
            const initialStatus:AVPlaybackStatusToSet = {
                shouldPlay:true,
                // rate:1.0,
                volume:1.0,
                isMuted:false,
                isLooping:false,
                progressUpdateIntervalMillis:1000,
                // shouldCorrectPitch:true
            }
            const {sound,status} = await Audio.Sound.createAsync(
                initialPlayback,initialStatus
                ,this.handlePlaybackUpdate
            )
            this.playbackInstance = sound;
            this.handlePlaybackUpdate(status)
            this.currentMedia = media
        }catch(err) {
            this.toast.show({
                title:"Unable to load audio",
                description:err.message || "Something went wrong",
                status:"error"
            })
        }
    }
    handlePlaybackUpdate = async(status:AVPlaybackStatus | any) => {  
        this.handleUpdate({
            ...status,
            ...(status.durationMillis && {
                totalSeconds:this.formatTime.totalSeconds(status.durationMillis),
                totalTime:this.formatTime.getMMSSFromMillis(status.durationMillis)
            }),
            ...(status.positionMillis && {currentTime:this.formatTime.totalSeconds(status.positionMillis)}),
            ...(status.positionMillis && {currentTimeFormat:this.formatTime.getMMSSFromMillis(status.positionMillis)}),
            ...(status.playableDurationMillis && {playableTime:this.formatTime.totalSeconds(status.playableDurationMillis)})
        })
    }
    async stop() {
        if(this.playbackInstance){
            await this.playbackInstance.unloadAsync()
            this.playbackInstance = null
        }
    }
    
}


// Bro. Abraham = 0;
// Sis. Winifred = 1; 1 saved;
// Sis. Goodness = 5; 1 filled, 
// Bro. Tobe = 3;