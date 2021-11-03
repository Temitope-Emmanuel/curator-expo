import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMedia } from "../../models/Media";
import { IToastProps } from "../../models/Toast";

export class AsyncStorageClass {
  key: string;
  toast: IToastProps;
  localData: IMedia<"audio">[];
  constructor({
    key,
    toast,
  }: {
    key: "@@media" | "@@playlist";
    toast: IToastProps;
  }) {
    this.key = key;
    this.toast = toast;
    this.init();
  }

  init = async () => {
    try {
      AsyncStorage.getItem(this.key).then((data) => {
        if(data){
          const parsedResponse = JSON.parse(data)
          this.localData = parsedResponse;
          if(parsedResponse.length){
            this.toast.show({
              title: "Data loaded",
              status: "success",
            });
          }
        }else{
          this.localData = []
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

  addData = async (value: IMedia<"audio">) => {
    try{
      const newData = [...this.localData,value];
      await this.storeData(newData);
      return newData
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
    const newData = this.localData.filter((item) => item.id != id);
    this.storeData(newData)
    return newData;
  };

  // For setting the asyncStorage
  private storeData = async (value: IMedia<"audio">[]) => {
    try {
      await AsyncStorage.setItem(this.key, JSON.stringify(value));
      this.localData = value
    } catch (err: any) {
      console.log("there's been an err",{err})
      this.toast.show({
        title: `Error:${err.messsage}`,
        placement: "bottom",
        status: "error",
      });
    }
  };
  // For accessing the asyncStorage
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(this.key);
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
