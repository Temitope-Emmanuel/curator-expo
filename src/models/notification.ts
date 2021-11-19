import { BaseModel } from "./BaseModel";

export interface INotification extends BaseModel {
    status: "success" | "failed" | "error";
    type: "upload";
    seen:boolean;
    description:string
}