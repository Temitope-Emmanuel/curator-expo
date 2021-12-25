type MediaType = "audio" | "pdf"

export interface IMedia<T extends MediaType> {
    name:string;
    id:string;
    size:number;
    uri:string;
    description?:string;
    type:T
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
    size:0,
    type:"audio",
    uri:""
}