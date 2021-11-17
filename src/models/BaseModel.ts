import * as FirebaseApp from "firebase"

export interface BaseModel {
    createdAt: ReturnType<typeof FirebaseApp.default.firestore.FieldValue.serverTimestamp>;
    id: string;
}