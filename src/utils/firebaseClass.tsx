import {LogBox} from "react-native"
import config from "./firebaseConfig"
import * as firebaseApp from "firebase"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

class Firebase {
    public auth:ReturnType<typeof firebaseApp.default.auth>;
    public storage:ReturnType<typeof firebaseApp.default.storage>;
    public firestore:ReturnType<typeof firebaseApp.default.firestore>;
    constructor() {
        if(!firebaseApp.default.apps.length){
            firebaseApp.default.initializeApp(config)
        }else{
            firebaseApp.default.app()
        }
        this.auth = firebaseApp.default.auth();
        this.storage = firebaseApp.default.storage();
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