type MediaType = "audio" | "pdf"

export interface IMedia<T extends MediaType> {
    // id?:string | number;
    // title:string;
    // size:number;
    // description:string;
    // duration?:number;
    // pages?:number;
    // type:T;
    // fileCopyUri:string;
    // uri:string;
    name:string;
    size:number;
    uri:string;
    description?:string;
}

export const defaultMedia:IMedia<"audio"> = {
    name:"",
    description:"",
    // fileCopyUri:"",
    size:0,
    // title:"",
    // type:"audio",
    uri:""
}