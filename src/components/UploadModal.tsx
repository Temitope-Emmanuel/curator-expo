import React from "react"
import Modal from "./Modal"
import * as fileSystem from "expo-file-system"
import useFirebaseService from "../utils/firebase"
import { Progress, Text, Spinner, useDisclose } from "native-base"
import { IMedia } from "../models/Media"
import { IToastProps } from "../models/Toast"

const UploadModal:React.FC<{
    open:boolean;
    toast:IToastProps;
    media:IMedia<"audio">;
    handleToggle:() => void;
}> = ({
    handleToggle,
    media,open,toast
}) => {
    const {storage,profile} = useFirebaseService()
    const [progress,setProgress] = React.useState(0)
    const {isOpen:isUploading,onOpen:startUploading,onClose:stopUploading} = useDisclose()
    
    const uploadMedia = async (fileUri:string) => {
        setProgress(0)
        startUploading()
        const blob = await new Promise((resolve,reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response)
            }
            xhr.onerror = function(err) {
                console.log("this is the error",JSON.stringify(err))
                handleToggle()
                toast.show({
                    status: "error",
                    title: "Something went wrong when uploading file",
                    // description: err.message ?? ""
                })
            }
            xhr.responseType = "blob";
            xhr.open("GET",fileUri,true);
            xhr.send(null)
        })
        const fileRef = storage.ref(`${profile.username}-${profile.id}/playlist/${media.name}`)
        const task = fileRef.put(blob as any)
        task.on("state_changed",snapshot => {
            const currentPercent = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentPercent)
        })
        task.then(data => {
            handleToggle()
            toast.show({
                status: "success",
                title: "Upload successful",
                description: `${media.name} has been successfully uploaded`
            })
        }).catch(err => {
            toast.show({
                status: "error",
                title: "Something went wrong when uploading file",
                description: err.message ?? ""
            })
        })
    }

    React.useEffect(() => {
        uploadMedia(media.uri)
    },[])

    return(
        <Modal title="upload" open={open} handleToggle={handleToggle} >
            <Text>
                {media.name}
            </Text>
            {
                isUploading ? 
                <>
                    <Progress
                        size="xl" value={progress}
                    />
                    <Text>
                        {`${progress}%`}
                    </Text>
                </>
                 :
                <Spinner size="lg" />
            }
        </Modal>
    )
}

export default React.memo(UploadModal)