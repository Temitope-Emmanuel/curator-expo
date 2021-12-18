export interface IAudioNote {
    body:string;
    startTime:number;
    endTime:number;
    name:string;
    audioId:string;
    id:string
}

export interface IPlaylistNotes {
    id:string;
    notes:IAudioNote[]
}[]
  