import React from "react"
import { StyleSheet } from "react-native"
import { AVPlaybackStatus } from "expo-av"
import { useToast, View, Text } from "native-base";
import { useAsyncStorage } from "./utils/AsyncStorage";
import { PlaylistClass } from "./utils/Playlist";
import { IMedia } from "../models/Media";
import { RootStackParamList } from "../models/route";
import { FULL_BAR_WIDTH } from "./utils/constants"
import Animated, {
    useAnimatedRef,
    useSharedValue, withTiming
} from "react-native-reanimated";
import waveform from "../assets/data/waveform.json"
import TabView from "../../src/components/TabView"
import WaveFormContainer from "../components/WaveFormContainer";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

const MediaDetail: React.FC<{} & BottomTabScreenProps<RootStackParamList,"MediaDetail">> = ({
    route
}) => {
        const toast = useToast();
        const scrollX = useSharedValue(0);
        const bufferedPoint = useSharedValue(0)
        const playlist = React.useRef<PlaylistClass>()
        const [playing, setPlaying] = React.useState(false)
        const [sliding, setSliding] = React.useState(false)
        const scrollRef = useAnimatedRef<Animated.ScrollView>();
        const [state, setState] = React.useState<AVPlaybackStatus>()
        const [playlistArr, setPlaylistArr] = React.useState<number[]>([])
        const [currentMedia, setCurrentMedia] = React.useState<IMedia<"audio">>()
        // useDerivedValue(() => {
        //     return playing
        // }, [playing])
        const [_, mediaAsyncStorage] = useAsyncStorage({
            initialState: [],
            key: "@@media",
            toast
        })
        const [playlistDetail, playlistAsyncStorage] = useAsyncStorage({
            initialState: [],
            key: "@@playlist",
            toast
        })
        // useDerivedValue(() => {
        //     return sliding
        // }, [sliding])

        const updateProgress = () => {
            "worklet";

            if (scrollX) {
                scrollX.value = withTiming(scrollX.value + (FULL_BAR_WIDTH * 2));
            }
        };

        const createAudioArr = (milliSeconds: number) => {
            const seconds = Math.ceil(milliSeconds / 1000);
            const array = waveform.samples.slice(0, seconds)
            console.log(array.length)
            setPlaylistArr(array)
        }

        const getAudio = async () => {
            const response = await mediaAsyncStorage?.getData(route.params.uri as string)
            if (response) {
                setCurrentMedia(response as IMedia<"audio">)
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
                        handleStatusUpdate: setState
                    })
                }
                playlist.current?.loadNewPlaybackInstance(media)
            }
        }

        React.useEffect(() => {
            createAudioArr(100000)
            const interval = setInterval(() => updateProgress(), 150);
            return () => clearInterval(interval);

            // return () => {
            //     if (playlist.current) {
            //         playlist.current?.stop()
            //         // savedPlaylistDetail().then(() => {
            //         // }).catch(err => {
            //         //     toast.show({
            //         //         title:"Unable to save data",
            //         //         description:err.message || "Unable to save playlist information",
            //         //         status:"error"
            //         //     })
            //         // })
            //     }
            // }
        }, [])

        // React.useEffect(() => {
        //     if (currentMedia?.uri && !state) {
        //         // start(currentMedia)
        //     }
        // }, [currentMedia])

        // React.useEffect(() => {
        //     if (playlistArr.length <= 0 && (state as any)?.durationMillis) {
        //         createAudioArr((state as any).durationMillis)
        //     }

        //     if ((state as any)?.didJustFinish || (state as any)?.isPlaying) {
        //         if ((state as any)?.didJustFinish) {
        //             // savedPlaylistDetail()
        //         }
        //         if ((state as any).currentTime) {
        //             updatePosition((state as any).currentTime)
        //         }
        //         if ((state as any).playableDurationMillis) {
        //             updateBuffering((state as any).playableDurationMillis / 1000)
        //         }
        //         if ((state as any)?.isPlaying !== playing) {
        //             const currentPlaying = (state as any).didJustFinish ? true : (state as any).isPlaying;
        //             setPlaying(currentPlaying)
        //         }
        //     } else {
        //         // Only update value if true
        //         if (playing) {
        //             setPlaying(false)
        //         }
        //     }
        // }, [state])


        // React.useEffect(() => {
        //     if (mediaAsyncStorage && !currentMedia) {
        //         getAudio()
        //     }
        // }, [mediaAsyncStorage])

        // const savedPlaylistDetail = () => {
        //     return playlistAsyncStorage.addData({
        //         id: currentMedia.name,
        //         uri: currentMedia.uri,
        //         position: (state as any)?.positionMillis,
        //         totalTimesPlayed: 1,
        //         description: "",
        //         name: currentMedia.name,
        //         size: 0,
        //         timeline: []
        //     })
        // }

        const updatePosition = (currentTime: number) => {
            'worklet';
            if (playing && !sliding) {
                const currentPanX = currentTime * FULL_BAR_WIDTH
                scrollX.value = withTiming(Number.isNaN(currentPanX) ? 1 : currentPanX)
                console.log("this is the scrollX", JSON.stringify(scrollX))
            }
        }

        const updateBuffering = (bufferedPointArg: number) => {
            'worklet';
            if (bufferedPointArg) {
                const currentBufferedPoint = bufferedPointArg * FULL_BAR_WIDTH;
                bufferedPoint.value = withTiming(-currentBufferedPoint)
            }
        }

        // const pauseMedia = async (shouldPlay: boolean) => {
        //     if (playlist.current) {
        //         if (shouldPlay) {
        //             await playlist.current.playbackInstance.playAsync()
        //         } else {
        //             await playlist.current.playbackInstance.pauseAsync()
        //         }
        //     }
        // }

        // const toggleSetPlaying = React.useCallback(() => {
        //     pauseMedia(!playing)
        // }, [playing])

        // const seekTo = async (positionNumber: number) => {
        //     if (playlist.current) {
        //         const response = await playlist.current.playbackInstance.setStatusAsync({
        //             positionMillis: positionNumber
        //         })
        //         // console.log("this is the response",response,positionNumber)
        //     }
        // }

       
        return (
            <View style={styles.container}>
                <WaveFormContainer waveform={waveform.samples} />
                <TabView/>
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "flex-end"
    },
    cover: {
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null
    },
    content: {
        flex: 0.5,
        justifyContent: "center"
    }
})

export default MediaDetail