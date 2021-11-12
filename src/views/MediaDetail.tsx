import React from "react"
import { StyleSheet } from "react-native"
import WaveForm from "../components/Waveform"
import { AVPlaybackStatus } from "expo-av"
import { useToast, View, Text } from "native-base";
import { useAsyncStorage } from "./utils/AsyncStorage";
import { PlaylistClass } from "./utils/Playlist";
import { IMedia } from "../models/Media";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../models/route";
import { StackNavigationProp } from "@react-navigation/stack"
import { STICK_FULL_WIDTH } from "./utils/constants"
import Animated, {
    useAnimatedRef, useAnimatedScrollHandler,
    useSharedValue, withTiming
} from "react-native-reanimated";
import { Dimensions } from "react-native";
import waveform from "../assets/data/waveform.json"
import * as FileSystem from "expo-file-system"
// import TabView from "../../src/components/TabView"

const width = Dimensions.get("window")

const MediaDetail: React.FC<{
    route: RouteProp<RootStackParamList, "Media Detail">;
    navigation: StackNavigationProp<RootStackParamList, "Media Detail">
}> = ({
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
              scrollX.value = withTiming(scrollX.value + (STICK_FULL_WIDTH));
            }
          };
        
        
        const createAudioArr = (milliSeconds: number) => {
            console.log("this is the milliseconds",milliSeconds)
            const seconds = Math.ceil(milliSeconds / 1000);
            const array = waveform.samples.slice(0,seconds)
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
            // const getData = async () => {
            //     // console.log(FileSystem.cacheDirectory)
            //     const cache = await FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}DocumenPicker`)
            //     // const cache = await FileSystem.readAsStringAsync("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%40kashakunin%2Ftodo-app/DocumentPicker/5f40f970-281c-489f-9747-71b07434372f.mp3")
            //     console.log( "This is the cache",{cache})
            // }
            // getData()
            // const interval = setInterval(() => updateProgress(), 1000);
            // return () => clearInterval(interval);
          
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

        React.useEffect(() => {
            if (currentMedia?.uri && !state) {
                start(currentMedia)
                // getFileInfo(currentMedia.uri)
            }
        }, [currentMedia])

        React.useEffect(() => {
            if (playlistArr.length <= 0 && (state as any)?.durationMillis) {
                createAudioArr((state as any).durationMillis)
            }

            if ((state as any)?.didJustFinish || (state as any)?.isPlaying) {
                if ((state as any)?.didJustFinish) {
                    // savedPlaylistDetail()
                }
                if ((state as any).currentTime) {
                    updatePosition((state as any).currentTime)
                }
                if ((state as any).playableDurationMillis) {
                    updateBuffering((state as any).playableDurationMillis / 1000)
                }
                if ((state as any)?.isPlaying !== playing) {
                    const currentPlaying = (state as any).didJustFinish ? true : (state as any).isPlaying;
                    setPlaying(currentPlaying)
                }
            } else {
                // Only update value if true
                if (playing) {
                    setPlaying(false)
                }
            }
        }, [state])


        React.useEffect(() => {
            if (mediaAsyncStorage && !currentMedia) {
                getAudio()
            }
        }, [mediaAsyncStorage])

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
                const currentPanX = currentTime * STICK_FULL_WIDTH
                scrollX.value = withTiming(Number.isNaN(currentPanX) ? 1 : currentPanX)
                console.log("this is the scrollX",JSON.stringify(scrollX))
            }
        }

        const updateBuffering = (bufferedPointArg: number) => {
            'worklet';
            if (bufferedPointArg) {
                const currentBufferedPoint = bufferedPointArg * STICK_FULL_WIDTH;
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

        const scrollHandler = useAnimatedScrollHandler({
            onScroll: ({ contentOffset: { x } }) => {
                scrollX.value = x
            }
        })
        // useDerivedValue(() => {
        //     scrollTo(scrollRef, scrollX.value, 0, true)
        // })

        // console.log( "this is the waveform", {playlistArr})

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Animated.ScrollView
                        ref={scrollRef} showsHorizontalScrollIndicator={false}
                        bounces={false} horizontal
                        scrollEventThrottle={16} onScroll={scrollHandler}
                    >
                        <View style={{ flex: 1 }} >
                            <WaveForm
                                primaryColor="white" secondaryColor="#e6d0bb"
                                waveform={playlistArr}
                            />
                            <View style={StyleSheet.absoluteFillObject}>
                                <WaveForm progress={scrollX} waveform={playlistArr}
                                    primaryColor="#e95f2a" secondaryColor="#f5c19f"
                                />
                            </View>
                        </View>
                    </Animated.ScrollView>
                </View>
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