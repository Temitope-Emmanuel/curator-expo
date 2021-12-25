export interface INote {
    body:string;
    startTime:number;
    endTime:number;
    name:string;
    audioId:string;
    id:string
}

export interface IMediaNotes {
    id:string;
    notes:INote[]
}[]
  