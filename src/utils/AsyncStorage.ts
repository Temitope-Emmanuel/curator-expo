import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMedia,IMediaPlaylist } from "../models/Media";
import { IToastProps } from "../models/Toast";
import { IAudioNote,IPlaylistNotes } from "../models/AudioNote";

export type StorageType = IMedia<"audio"> | IMediaPlaylist | IPlaylistNotes
type AcceptedKey = "@@media" | "@@playlist" | "@@playlistnote"
type ISetStatus<K> = React.Dispatch<React.SetStateAction<K>>;

class AsyncStorageClass<K extends {id:string}> {
  key: string;
  storage:K[];
  setStorage:ISetStatus<K[]>;
  toast: IToastProps;
  constructor({
    key,
    toast,
    storage,
    setStorage
  }: {
    key: AcceptedKey;
    storage:K[]
    setStorage:ISetStatus<K[]>;
    toast: IToastProps;
  }) {
    this.key = key;
    this.storage = storage
    this.setStorage = setStorage
    this.toast = toast;
    this.init();
  }

  init = () => {
    try {
      AsyncStorage.getItem(this.key).then((data) => {
        if(data){
          const parsedResponse = JSON.parse(data)
          this.updateStorage(parsedResponse)
          if(parsedResponse.length){
            this.toast.show({
              title: "Data loaded",
              status: "success",
            });
          }
        }else{
          this.updateStorage([])
        }
      });
    } catch (err) {
      this.toast.show({
        title: `Error:${err.messsage}`,
        placement: "bottom",
        status: "error",
      });
    }
  };

  addData = async (value: K) => {
    try{
      const filteredData = [...this.storage]
      const foundFormerIdx = filteredData.findIndex(item => item.id === value.id)
      if(foundFormerIdx >= 0){
        filteredData.splice(foundFormerIdx,1,value)
        await this.storeData(filteredData);
      }else{
        const newData = [...this.storage,value];
        await this.storeData(newData);
      }
    }catch(err){
      this.toast.show({
        title: `Error: unable to add data`,
        description: `${err.messsage}`,
        placement: "bottom",
        status: "error",
      });
    }
  };
  
  removeData = (id: any) => {
    const newData = this.storage.filter((item) => item.id != id);
    this.storeData(newData)
    return newData;
  };

  updateStorage = (value:K[]) => {
    this.setStorage(value)
    this.storage = value
  }

  // For setting the asyncStorage
  private storeData = async (value: K[]) => {
    try {
      await AsyncStorage.setItem(this.key, JSON.stringify(value));
      this.updateStorage(value)
    } catch (err: any) {
      this.toast.show({
        title: `Error:${err.messsage}`,
        placement: "bottom",
        status: "error",
      });
    }
  };
  // For accessing the asyncStorage
  getData = async (id:string) => {
    try {
      const value = this.storage.find(item => item.id === id);
      return value;
    } catch (err: any) {
      this.toast.show({
        title: `Error:${err.messsage}`,
        placement: "bottom",
        status: "error",
      });
    }
  };
  deleteStorage = async () => {
    return AsyncStorage.removeItem(this.key);
  };
}


export const useAsyncStorage = <K extends {id:string}>({
  initialState,
  toast,key
}:{
  toast:IToastProps;
  key:AcceptedKey
  initialState:K[]
}):[K[],AsyncStorageClass<K>] => {
  const [storage,setStorage] = React.useState<K[]>(initialState)
  const asyncStorage = React.useRef<AsyncStorageClass<K>>()

  React.useEffect(() => {
    asyncStorage.current = new AsyncStorageClass({
      key,
      toast,
      storage,
      setStorage
    })
  },[])

  return [
    storage,asyncStorage.current
  ]
}