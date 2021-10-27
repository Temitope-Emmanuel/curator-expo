import { Box, useToast, useDisclose, Divider } from "native-base"
import React from "react"
import { StyleSheet, FlatList } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import AuthModal from "../components/AuthModal"
import { IMedia } from "../models/Media"
import Header from "./utils/Header"
import SingleMedia from "../components/SingleMedia"
import { AntDesign } from "@expo/vector-icons"
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5"
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons"
import ActionSheet from "../components/ActionSheet"
import * as DocumentPicker from "expo-document-picker"
import { AsyncStorageClass } from "./utils/AsyncStorage"
import FAB from "../components/Fab"
import { PLAYLIST_KEY } from "./utils/constants"

const Home: React.FC<{
  navigation: StackNavigationProp<any>;
}> = (props) => {
  const toast = useToast()
  const { isOpen: openFAB, onToggle: toggleFAB } = useDisclose()
  const asyncStorage = React.useRef<AsyncStorageClass>()
  const { isOpen: openModal, onToggle: toggleModal } = useDisclose()
  const { isOpen: isOpenActionSheet, onOpen: openActionSheet, onClose: closeActionSheet } = useDisclose()
  const [playlist, setPlayList] = React.useState<IMedia<"audio">[]>([])
  const [currentMedia, setCurrentMedia] = React.useState<IMedia<"audio">>()

  const getPlaylistData = async () => {
    const data = await asyncStorage.current?.getData()
    if (data) {
      setPlayList(JSON.parse(data))
    }
  }

  React.useEffect(() => {
    asyncStorage.current = new AsyncStorageClass({
      key: PLAYLIST_KEY,
      toast
    })
    getPlaylistData()
  }, [])

  const handleCurrentMedia = React.useMemo(() =>
    (uri: number | string) => () => {
      const foundMedia = playlist.find(item => item.uri === uri)
      if (foundMedia) {
        openActionSheet()
        setCurrentMedia(foundMedia)
      }
    }
  ,[playlist])

  const handleNavigation = (arg: string | number) => () => {
    props.navigation.navigate("MediaDetail", { uri: arg })
  }
  const handleDelete = (id: string) => {
    const filteredPlaylist = playlist.filter(item => item.uri != id)
    asyncStorage.current?.storeData(JSON.stringify(filteredPlaylist)).then(() => {
      setPlayList(filteredPlaylist)
      closeActionSheet()
    }).catch(err => {
      toast.show({
        title: "Something went wrong",
        status: "error",
        description: `Error:${err.message}`
      })
    })
  }

  const PickSingleDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "audio/*"
      })
      if (res.type === "success") {
        asyncStorage.current.storeData(JSON.stringify([...playlist, res]))
        setPlayList([...playlist as any, res as any])
      }
      toggleFAB()
    } catch (err) {
      console.log("there's been an error", { err })
    }
  }

  return (
    <>
      <Box style={styles.root}>
        <Header toggleModal={toggleModal} />
        <Divider />
        <FlatList data={playlist}
          style={styles.listContainer}
          renderItem={({ item }) => (
            <SingleMedia {...item} onClick={handleNavigation(item.uri)}
              key={item.uri} setMedia={handleCurrentMedia(item.uri)}
            />
          )} keyExtractor={item => item.uri}
        />
        <FAB open={openFAB} toggle={toggleFAB}
          icons={[
            {
              // icon: <Text>This is a text</Text>,
              iconType: AntDesign,
              icon: "addfolder",
              name: "New Folder",
              label: "This is the upload button",
              onPress: () => { console.log("This is the upload button") }
            },
            {
              // icon: <Text>This is a text</Text>,
              iconType: AntDesign,
              icon: "upload",
              name: "Upload",
              label: "This is the upload button",
              onPress: PickSingleDocument
            }
          ]}
        />
        <ActionSheet
          onOpen={openActionSheet} title={currentMedia?.name ?? ""}
          onClose={closeActionSheet} open={isOpenActionSheet}
          items={[
            {
              label: "Share",
              icon: "share",
              iconType: MaterialCommunityIcon,
              onPress: () => console.log("Clicked on the share button")
            },
            {
              label: "Delete",
              icon: "delete-sweep",
              iconType: MaterialCommunityIcon,
              onPress: () => handleDelete(currentMedia?.uri ?? "")
            },
            {
              label: "Add Tags",
              icon: "tags",
              iconType: FontAwesome5Icon,
              onPress: () => console.log("Added tags")
            }
          ]}
        />
      </Box>
      <AuthModal openModal={openModal}
        toggleModal={toggleModal}
      />
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#0B0E11",
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    flex: 1
  },
  nav: {
    alignItems: 'center',
    justifyContent: "space-between"
  },
  listContainer: {
    width: "100%",
    flex: 1
  },
  subNav: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    marginBottom: 3
  },
  container: {
    display: 'flex'
  }
})

export default Home