import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMedia,IMediaPlaylist } from "../../models/Media";
import { IToastProps } from "../../models/Toast";

type StorageType = IMedia<"audio"> | IMediaPlaylist
type AcceptedKey = "@@media" | "@@playlist"
type ISetStatus<K> = React.Dispatch<React.SetStateAction<K>>;

class AsyncStorageClass {
  key: string;
  storage:StorageType[];
  setStorage:ISetStatus<StorageType[]>;
  toast: IToastProps;
  constructor({
    key,
    toast,
    storage,
    setStorage
  }: {
    key: AcceptedKey;
    storage:StorageType[]
    setStorage:ISetStatus<StorageType[]>;
    toast: IToastProps;
  }) {
    this.key = key;
    this.storage = storage
    this.setStorage = setStorage
    this.toast = toast;
    this.init();
    // AsyncStorage.clear()
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

  addData = async (value: StorageType) => {
    try{
      console.log("this is the data",{value})
      const newData = [...this.storage,value];
      await this.storeData(newData);
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

  updateStorage = (value:StorageType[]) => {
    this.setStorage(value)
    this.storage = value
  }

  // For setting the asyncStorage
  private storeData = async (value: StorageType[]) => {
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


export const useAsyncStorage = ({
  initialState,
  toast,key
}:{
  toast:IToastProps;
  key:AcceptedKey
  initialState:StorageType[]
}):[StorageType[],AsyncStorageClass] => {
  const [storage,setStorage] = React.useState(initialState)
  const asyncStorage = React.useRef<AsyncStorageClass>()

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