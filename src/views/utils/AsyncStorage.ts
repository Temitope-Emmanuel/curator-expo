import AsyncStorage from "@react-native-async-storage/async-storage"
import { IToastProps } from "../../models/Toast";


export class AsyncStorageClass {
    key:string;
    toast:IToastProps
    constructor({
        key,
        toast
    }:{
        key:"@playlist",
        toast:IToastProps
    }) {
        this.key = key
        this.toast = toast
    }

    // For setting the asyncStorage
  storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem(this.key, value)
    } catch (err:any) {
        this.toast.show({
            title: `Error:${err.messsage}`,
            placement: "bottom",
            status: "error"
          })
    }
  }
  // For accessing the asyncStorage
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(this.key)
      return value
    } catch (err:any) {
        this.toast.show({
        title: `Error:${err.messsage}`,
        placement: "bottom",
        status: "error"
        })
    }
  }
  deleteData = async () => {
    return AsyncStorage.removeItem(this.key)
  }
}