import config from "./firebaseConfig"
import * as firebaseApp from "firebase"
import "firebase/auth"
import "firebase/firestore"


class Firebase {
    public auth:ReturnType<typeof firebaseApp.default.auth>;
    public firestore:ReturnType<typeof firebaseApp.default.firestore>;
    constructor() {
        if(!firebaseApp.default.apps.length){
            firebaseApp.default.initializeApp(config)
        }else{
            firebaseApp.default.app()
        }
        this.auth = firebaseApp.default.auth();
        this.firestore = firebaseApp.default.firestore()
    }
    getServerTimestamp = () => firebaseApp.default.firestore.FieldValue.serverTimestamp()
}

export const createFirebase = () : Firebase => {
    let firebase = null;
    if(!firebase || typeof window === "undefined"){
        firebase = new Firebase()
    }
    return firebase
}

export default Firebase