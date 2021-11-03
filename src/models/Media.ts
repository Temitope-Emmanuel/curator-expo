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
    id:string;
    size:number;
    uri:string;
    description?:string;
}

export interface IMediaPlaylist {
    position:number;
    id:string;
    name:string;
    uri:string;
    totalTimesPlayed:number;
    timeline:{
        timestamp:number;
        description:string
    }[]
}

export const defaultMedia:IMedia<"audio"> = {
    name:"",
    description:"",
    id:"",
    // fileCopyUri:"",
    size:0,
    // title:"",
    // type:"audio",
    uri:""
}