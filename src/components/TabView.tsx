import * as React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Constants from 'expo-constants';
import { Foundation, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { Flex, Icon, IconButton, useToast, Pressable, Text, HStack, Badge } from 'native-base';
import Input from './Input';
import { useForm } from 'react-hook-form';
import { AntDesign } from "@expo/vector-icons"
import { useAsyncStorage } from '../views/utils/AsyncStorage';
import { useRoute } from '@react-navigation/native';
import { IAudioNote, IPlaylistNotes } from '../models/AudioNote';
import { RootStackParamList } from "../models/route"
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import useMediaService from '../views/utils/mediaPlayer';
import { nanoid } from "nanoid/non-secure"
import { TimeFormatter } from '../views/utils/Playlist';
import { useTime } from '../views/utils/hooks/useTime';

const FirstRoute = () => (
    <View style={[styles.container, { backgroundColor: 'whitesmoke' }]} />
);
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
    notes: IAudioNote[];
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
    const [foundPlaylist, setFoundPlaylist] = React.useState<IPlaylistNotes>({
        id: "",
        notes: []
    })
    const [playlistNote, asyncStorage] = useAsyncStorage<IPlaylistNotes>({
        initialState: [],
        key: "@@playlistnote",
        toast
    })
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
    React.useEffect(() => {
        formatTime.current = new TimeFormatter()
    },[])
    React.useEffect(() => {
        if(state?.positionMillis && state.positionMillis !== startTime){
            setStartTime(state.positionMillis)
        }
    },[state])
    React.useEffect(() => {
        if(state && state.isPlaying && body.length){
            togglePlaying()
        }
    },[body])
    React.useEffect(() => {
        if(startTime){
            setEndTime(startTime+7000)
        }
    },[startTime])

    
    const addToPlaylist = ({
        audioId, body, id, name, endTime, startTime
    }: IAudioNote) => {
        const newNotes: IAudioNote = {
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
        console.log("calling the delete functions")
        asyncStorage.addData(filteredPlaylist)
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
            <NoteContainer formatTime={formatTime.current} handleDelete={handleDelete} notes={foundPlaylist.notes} />
            <Flex bg="whitesmoke" position="absolute" bottom={0} left={0} width="100%">
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
                            {`${formatTime.current?.getMMSSFromMillis(startTime) ?? '00:00'}`}
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
                    <Text>
                        ---
                    </Text>
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
                            {`${formatTime.current?.getMMSSFromMillis(endTime) ?? '00:00'}`}
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
    const [idx, setIndex] = React.useState(1)
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
        first: FirstRoute,
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