import React from "react"
import Header from "../utils/Header"
import { IMedia } from "../models/Media"
import AuthModal from "../components/AuthModal"
import { StyleSheet } from "react-native"
import UploadModal from "../components/UploadModal"
import ActionSheet from "../components/ActionSheet"
import { RootStackParamList } from "../models/route"
import * as DocumentPicker from "expo-document-picker"
import { useAsyncStorage } from "../utils/AsyncStorage"
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5"
import { Box, useToast, useDisclose, Divider, Flex } from "native-base"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons"
import SwipeList from "../components/SwipeList"
import { AntDesign } from "@expo/vector-icons"
import FAB from "../components/Fab"


const Home: React.FC<{
} & BottomTabScreenProps<RootStackParamList,"Home">> = (props) => {
  const toast = useToast()
  const [playlist,asyncStorage] = useAsyncStorage<IMedia<"audio">>({
    initialState:[],
    key:"@@media",
    toast
  })
  const {isOpen:showUpload, onToggle:toggleUpload} = useDisclose()
  const { isOpen: openFAB, onToggle: toggleFAB } = useDisclose()
  const { isOpen: openModal, onToggle: toggleModal } = useDisclose()
  const { isOpen: isOpenActionSheet, onOpen: openActionSheet, onClose: closeActionSheet } = useDisclose()
  const [currentMedia, setCurrentMedia] = React.useState<IMedia<"audio">>()

  const handleCurrentMedia = React.useMemo(() =>
    (uri:string) => {
      const foundMedia = playlist.find(item => item.uri === uri)
      if (foundMedia) {
        setCurrentMedia(foundMedia as any)
        openActionSheet()
      }
    }, [playlist])

  const handleNavigation = (arg: string) => {
    props.navigation.navigate("MediaDetail", { uri: arg })
  }
  const handleDelete = (id: string) => {
    asyncStorage.removeData(id)
    closeActionSheet()
  }

  const PickSingleDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory:false
      })
      if (res.type === "success") {
        const { type, ...newAudio } = res
        await asyncStorage.addData({ ...newAudio, id: newAudio.uri })
      }
      toggleFAB()
    } catch (err) {
      toast.show({
        status: "error",
        title: "Something went wrong when selecting file",
        description: err.message ?? ""
      })
    }
  }

  const handleUploadToggle = () => {
    toggleUpload()
    closeActionSheet()
  }

  return (
    <Box style={{position:"relative",flex:1}} >
      <Box style={styles.root}>
        <Header toggleModal={toggleModal} />
        <Divider />
        <Flex flex={1} width="100%">
          <SwipeList handleDelete={handleDelete}
           handlePress={handleNavigation} showMore={handleCurrentMedia}
           data={playlist as IMedia<"audio">[]}
          />
        </Flex>
        {/* <FAB open={openFAB} toggle={toggleFAB}
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
        /> */}
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
              label: "Upload",
              icon: "cloud-upload",
              iconType: MaterialCommunityIcon,
              onPress: handleUploadToggle
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
      {
        openModal &&
        <AuthModal openModal={openModal}
          toggleModal={toggleModal}
        />
      }
      {
        showUpload && 
        <UploadModal open={showUpload} toast={toast}
         media={currentMedia} handleToggle={toggleUpload} 
        />
      }
    </Box>
  )
}

const styles = StyleSheet.create({
  root: {
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