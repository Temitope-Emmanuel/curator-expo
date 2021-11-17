import { BaseModel } from "./BaseModel";

export interface IAccount extends BaseModel {
    email: string;
    verified: boolean;
    photoURL: string;
    provider: "email" | "google";
    username: string;
}