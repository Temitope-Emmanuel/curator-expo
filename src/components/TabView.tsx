import * as React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Constants from 'expo-constants';
import { Foundation, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { Flex, Icon, IconButton,
    Button, useToast, Pressable, 
    Text, HStack, Badge, useDisclose
    } from 'native-base';
import Input from './Input';
import TextArea from "./Textarea"
import { useForm } from 'react-hook-form';
import { AntDesign } from "@expo/vector-icons"
import { useAsyncStorage } from '../utils/AsyncStorage';
import { useRoute } from '@react-navigation/native';
import { INote, IMediaNotes } from '../models/AudioNote';
import { RootStackParamList } from "../models/route"
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import useMediaService from '../utils/mediaPlayer';
import { nanoid } from "nanoid/non-secure"
import { TimeFormatter } from '../utils/Playlist';
import { useTime } from '../utils/hooks/useTime';
import MiniPlayer from './MiniPlayer';
import Modal from './Modal';
import { Slider } from './Slider';
import {Feather} from "@expo/vector-icons"
import { IToastProps } from '../models/Toast';
import { IAudioTimestamp } from '../models/AudioTimestamp';

const musicData = [
    {
        name:"Cry your heart out",
        artist:"Adele"
    },
    {
        name:"Mimo",
        artist:"Sola allyson"
    },
    {
        name:"Temisan",
        artist:"Sola Allyson"
    },
    {
        name:"Oro Oluwa",
        artist:"Sola Allyson"
    },
    {
        name:"Eji Owuro",
        artist:"Sola Allyson"
    },
]

const initialState = (arg:typeof musicData) => {
    return arg.map(item => ({
       ...item,
        playing:false
    }))
}

function reducer(state:ReturnType<typeof initialState>,action:{
    type:"toggleMediaState";
    playing:boolean;
    name:string;
}) {
    console.log("this is the action",action)
    switch(action.type){
        case 'toggleMediaState':
            const filteredState = [...state]
            const foundIdx = filteredState.findIndex(item => item.name === action.name)
            filteredState.splice(foundIdx,1,{
                ...filteredState[foundIdx],
                playing:action.playing
            })
            return filteredState
        default:
            throw new Error("Invalid action type argument")
    }
}
interface ITimestamp {
    title:string;
    description:string
}

const TimeSpan:React.FC<{
    startTime:string;
    endTime:string;
    decreaseStartTime:() => void;
    increaseStartTime:() => void;
    increaseEndTime:() => void;
    decreaseEndTime:() => void;
}> = ({
    decreaseEndTime,decreaseStartTime,startTime,endTime,
    increaseEndTime,increaseStartTime
}) => {

    return(
        <Flex w="100%" flexDirection="row" backgroundColor="blue.100">
            <Flex flexDirection="row">
                <IconButton
                    _icon={{
                        onPress:decreaseStartTime,
                        as:MaterialIcons,
                        name:"remove",
                        size:"sm",
                        height:1,
                        width:1  
                    }}
                />
                <Badge justifyContent="center">
                    {startTime}
                </Badge>
                <IconButton
                    _icon={{
                        onPress:increaseStartTime,
                        as:MaterialIcons,
                        name:"add",
                        size:"sm",
                        height:1,
                        width:1  
                    }}
                />
            </Flex>
            <Flex alignItems={"center"}>
                <Feather name="git-commit" />
            </Flex>
            <Flex flexDirection="row">
                <IconButton
                    _icon={{
                        onPress:decreaseEndTime,
                        as:MaterialIcons,
                        name:"remove",
                        size:"sm",
                        height:1,
                        width:1  
                    }}
                />
                <Badge justifyContent="center">
                    {endTime}
                </Badge>
                <IconButton
                    _icon={{
                        onPress:increaseEndTime,
                        as:MaterialIcons,
                        name:"add",
                        size:"sm",
                        height:1,
                        width:1  
                    }}
                />
            </Flex>
        </Flex>
    )
}


const AddNewTimestamp:React.FC<{
    toast:IToastProps
}> = ({
    toast
}) => {
    const { control, formState, handleSubmit } = useForm<ITimestamp>({
        defaultValues: {
            title:"",
            description:""
        }
    })
    const [playlistNote, asyncStorage] = useAsyncStorage<IAudioTimestamp>({
        initialState: [],
        key: "@@playlistnote",
        toast
    })
    const progressData = {
        position:100,
        duration:1000,
        buffered:400
    }
    const formatTime = React.useRef<TimeFormatter>()
    const [progress,setProgress] = React.useState(progressData)
    const [onChangeValue, setOnChangeValue] = React.useState(70)
    const [startTime,increaseStartTime,decreaseStartTime,setStartTime] = useTime(0)
    const [endTime,increaseEndTime,decreaseEndTime,setEndTime] = useTime(0)

    React.useEffect(() => {
        formatTime.current = new TimeFormatter()
    },[])

    const handleSliderChange = (e:number) => {
        setProgress({
            ...progress,
            position:(e/100) * progress.duration
        })
    }

    console.log(progress.position)

    return(
        <>
            <Slider mb={2} value={(progress.position/progress.duration) * 100}
                minValue={0} maxValue={100} defaultValue={70}
                onChange={handleSliderChange}
            >
                <Slider.Track>
                    <Slider.FilledTrack />
                </Slider.Track>
                    <Slider.Thumb />
            </Slider>
            <TimeSpan {...{increaseStartTime,decreaseStartTime,increaseEndTime,decreaseEndTime}}
             startTime={formatTime.current?.getMMSSFromMillis(progress.position*1000)}
             endTime={formatTime.current?.getMMSSFromMillis((progress.position + 300)*1000)}
            />
            <Input control={control} name="title" containerStyle={{marginTop:10,marginBottom:10}}
                placeholder="Input Timestamp title"
            />
            <TextArea containerStyle={{marginTop:2}}
             {...{control}} name="description"
             placeholder="Add New Description"
            />
        </>
    )
}

const TimestampRoute = () => {
    const [state,dispatch] = React.useReducer(reducer,musicData,initialState)
    const toast = useToast()
    const {isOpen:open,onToggle:toggle} = useDisclose()
    
    return(
        <>
            <View style={[styles.container, { backgroundColor: 'whitesmoke', position:'relative' }]}>
                <ScrollView>
                    {
                        state.map(({name,playing,artist},key) => (
                            <Flex height="15%" {...{key}}>
                                <MiniPlayer {...{artist,name,playing,key}}
                                    togglePlaying={React.useCallback(() => dispatch({
                                        type:"toggleMediaState",
                                        name,
                                        playing:!playing
                                    }),[playing])}
                                />
                            </Flex>
                        ))
                    }
                </ScrollView>
                <Flex position="absolute" bottom="1%" justifyContent="center" width="100%">
                    <Button width="90%" m="auto" onPress={toggle} >
                        Add New Clip
                    </Button>
                </Flex>
            </View>
            <Modal {...{open}} title="Add a new Timestamp"
                handleToggle={toggle}
            >
                <AddNewTimestamp {...{toast}} />
            </Modal>
        </>
    )
};

type Props = BottomTabScreenProps<RootStackParamList, "MediaDetail">;
type RouteProps = Props['route']

const HiddenItem:React.FC<{
    handleDelete:() => void
}> = ({
    handleDelete
}) => {
    return (
        <HStack marginLeft="auto" mr="3">
            {/* <Pressable
                // w="70"
                // ml="auto"
                color="coolGray.200"
                justifyContent="center"
                // onPress={}
                _pressed={{
                    opacity: 0.5,
                }}>
                <VStack alignItems="center" space={2}>
                    <Icon
                        as={<Entypo name="dots-three-horizontal" />}
                        size="sm"
                        color="coolGray.800"
                    />
                </VStack>
            </Pressable> */}
            <Pressable onPress={handleDelete}
                justifyContent="center"
                _pressed={{
                    opacity: 0.5,
                }}>
                <Icon as={<MaterialIcons name="delete" />} color="red.500" size="sm" />
            </Pressable>
        </HStack>
    )
}

const NoteContainer: React.FC<{
    notes: INote[];
    handleDelete:(noteId:string) => void;
    formatTime:TimeFormatter
}> = ({
    notes,handleDelete,formatTime
}) => {
    return (
        <ScrollView style={noteContainerStyles.root} >
            {notes.map((item, key) => (
                <Flex {...{ key }} style={noteContainerStyles.container} >
                    <Badge width="20%">
                        {`${formatTime.getMMSSFromMillis(item.startTime)}`}
                    </Badge>
                    <Flex style={noteContainerStyles.outline}>
                        <Text>
                            {item.body}
                        </Text>
                        <HiddenItem handleDelete={() => handleDelete(item.id)} />
                    </Flex>
                </Flex>
            ))}
        </ScrollView>
    )
}

const noteContainerStyles = StyleSheet.create({
    root: {
        marginBottom:3
    },
    container: {
        marginRight: 2,
        paddingLeft: 5
    },
    outline: {
        borderLeftColor: "grey",
        padding: 3,
        marginLeft:3,
        borderLeftWidth: 1,
        flexDirection:"row",
    }
})

const NoteTab = () => {
    const { control, reset, watch, formState, handleSubmit } = useForm<{
        body: string
    }>({
        defaultValues: {
            body: ""
        }
    })
    const {
        currentMedia,togglePlaying,
        state
    } = useMediaService()
    const [startTime,increaseStartTime,decreaseStartTime,setStartTime] = useTime(0)
    const [endTime,increaseEndTime,decreaseEndTime,setEndTime] = useTime(0)
    const toast = useToast()
    const body = watch("body")
    const route = useRoute<RouteProps>()
    const formatTime = React.useRef<TimeFormatter>()
    const [foundPlaylist, setFoundPlaylist] = React.useState<IMediaNotes>({
        id: "",
        notes: []
    })
    const [playlistNote, asyncStorage] = useAsyncStorage<IMediaNotes>({
        initialState: [],
        key: "@@playlistnote",
        toast
    })
    React.useEffect(() => {
        formatTime.current = new TimeFormatter()
    },[])
    React.useEffect(() => {
        if(state && state.isPlaying && body.length){
            togglePlaying()
        }
    },[body])
    React.useEffect(() => {
        if(state?.positionMillis && state.positionMillis !== startTime){
            setStartTime(state.positionMillis)
        }
    },[state])
    React.useEffect(() => {
        if(startTime){
            setEndTime(startTime+7000)
        }
    },[startTime])
    React.useEffect(() => {
        if (!foundPlaylist.id && playlistNote.length) {
            const foundIdx = playlistNote.findIndex(item => item.id === route.params.uri)
            if (foundIdx >= 0) {
                setFoundPlaylist(playlistNote[foundIdx])
            } else {
                if (asyncStorage) {
                    asyncStorage.addData({
                        id: route.params.uri,
                        notes: []
                    })
                    setFoundPlaylist({
                        id: route.params.uri,
                        notes: []
                    })
                }
            }
        }
    }, [playlistNote])
    
    
    const addToPlaylist = ({
        audioId, body, id, name, endTime, startTime
    }: INote) => {
        const newNotes: INote = {
            id,
            name,
            body,
            endTime,
            audioId,
            startTime
        }
        const newPlaylist = {
            id: foundPlaylist.id,
            notes: [
                ...foundPlaylist.notes,
                newNotes
            ]
        }
        asyncStorage.addData(newPlaylist)
        setFoundPlaylist(newPlaylist)
        toast.show({
            status: "success",
            description: "added new note"
        })
    }

    const handleDelete = (noteId:string) => {
        const filteredPlaylist = {
            ...foundPlaylist,
            notes:foundPlaylist.notes.filter(item => item.id !== noteId)
        }
        asyncStorage.addData(filteredPlaylist)
        setFoundPlaylist(filteredPlaylist)
    }

    const onSubmit = async ({ body }: { body: string }) => {
        addToPlaylist({
            audioId: route.params.uri,
            body,
            id: nanoid(),
            name: currentMedia.name,
            startTime: startTime ?? 0,
            endTime: endTime ?? 0
        })
        return (
            reset()
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: 'whitesmoke', position: "relative" }]}>
            <NoteContainer formatTime={formatTime.current} handleDelete={handleDelete}
             notes={foundPlaylist.notes} />
            <Flex bg="whitesmoke" position="absolute" bottom={0} left={0} width="100%">
                <TimeSpan 
                    startTime={`${formatTime.current?.getMMSSFromMillis(startTime) ?? '00:00'}`}
                    endTime={`${formatTime.current?.getMMSSFromMillis(endTime) ?? '00:00'}`}
                    {...{
                        increaseStartTime,decreaseStartTime,
                        increaseEndTime,decreaseEndTime
                    }}
                />
                <Input control={control} name="body"
                    placeholder="Write something"
                    rightIcon={
                        <IconButton onPress={handleSubmit(onSubmit)}
                            _icon={{
                                name: "addfile",
                                as: AntDesign
                            }}
                        />
                    } />
            </Flex>
        </View>
    );
}

const ThirdRoute = () => (
    <View style={[styles.container, { backgroundColor: "blue" }]} />
)

const getIcon = (arg: "0" | "1" | "2") => {
    if (arg === "0") {
        return (<Icon as={MaterialIcons} name="notes" />)
    } else if (arg === "1") {
        return (<Icon as={Foundation} name="clipboard-notes" />)
    } else {
        return (<Icon as={FontAwesome} name="users" />)
    }
}

const TabViewContainer = () => {
    const [idx, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'Notes' },
        { key: 'second', title: 'Timestamp' },
        { key: "third", title: "Users" }
    ])

    const handleIndexChange = (index: number) => setIndex(index);

    const renderTabBar = (props) => {
        return (
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const icon = getIcon(`${i}` as any)
                    const handleIndexChange = () => setIndex(i)

                    const IconHandlePress = (e) => {
                        console.log("calling here")
                        e.preventDefault()
                        handleIndexChange()
                    }

                    return (
                        <TouchableOpacity key={i}
                            style={styles.tabItem}
                            onPress={handleIndexChange}>
                            <IconButton
                                icon={icon}
                                borderRadius="full"
                                _icon={{
                                    size: "sm",
                                    opacity: idx === i ? 100 : 50,
                                    onPress: IconHandlePress
                                }}
                                _hover={{
                                    opacity: 50
                                }}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderScene = SceneMap({
        first: TimestampRoute,
        second: NoteTab,
        third: ThirdRoute
    });

    return (
        <TabView
            navigationState={{ routes, index: idx }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight,
    },
    tabItem: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: "white",
    }
});


export default TabViewContainer