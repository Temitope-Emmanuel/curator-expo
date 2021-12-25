import React from "react"
import firebase from "firebase"
import Firebase, {createFirebase} from "./firebaseClass"
import { createGenericContext } from "./hooks/useGenericContext"
import { useToast } from "native-base"
import { IAccount } from "../models/Account"


const [useFirebaseService,FirebaseServiceContextProvider] = createGenericContext<{
    profile:IAccount | null;
    isAuthenticated:boolean;
    loginUser:(arg:{email:string,password:string}) => Promise<firebase.auth.UserCredential>;
    createNewUserWithEmailAndPassword:(arg:{email:string,username?:string,password:string}) => Promise<void>
} & Firebase>()

export const FirebaseServiceProvider = <P extends object>(Component:React.ComponentType<P>) => {
    const firebase = createFirebase()

    return function Provider({...props}){
        const toast = useToast()
        const userCollection = React.useRef(() => firebase.firestore.collection("Users"))
        const [auth,setAuth] = React.useState<IAccount | null>(null)
        
        const getUserDetail = (userId:string) => {
            return userCollection.current().doc(userId).get().then(payload => {
                if(payload.exists){
                    const data:IAccount = {
                        id:userId,
                        ...payload.data() as any
                    }
                    return data
                }
            })
        }

        const handleAuthStateChange = (newAuth:firebase.User | null) => {
            if(newAuth){
                // setAuth(newAuth)
                getUserDetail(newAuth.uid).then(data => {
                    if(Object.keys(data)){
                        setAuth(data)
                    }
                })
            }else{
                setAuth(null)
            }
        }

        const addUserToFirestore = (account: IAccount) => {
            return userCollection.current().doc(account.id).set(account).then(() => {
                toast.show({
                    title: "Account created",
                    placement: "bottom",
                    status: "success"
                })
            }).catch(err => {
                throw err
            })
        }

        const loginUser = async ({ email, password }: {
            email: string;
            password: string
        }) => {
            return firebase.auth.signInWithEmailAndPassword(email, password)
        }

        const createNewUserWithEmailAndPassword = async ({ email, username, password }: {
            email: string;
            username?:string;
            password: string
        }) => {
            return firebase.auth.createUserWithEmailAndPassword(email, password).then(data => {
                if (data.additionalUserInfo?.isNewUser) {
                    const newUser: IAccount = {
                        createdAt: firebase.getServerTimestamp(),
                        id: data.user.uid,
                        email: data.user.email || data.user.providerData[0].email || "",
                        verified: data.user.emailVerified,
                        photoURL: data.user.photoURL || "",
                        provider: "email",
                        username: username || (data.additionalUserInfo.profile as any)?.name || ""
                    }
                    return addUserToFirestore(newUser)
                }
            }).catch(err => {
                throw err
            })
        }

        React.useEffect(() => {
            const listener = firebase.auth.onAuthStateChanged(handleAuthStateChange)
            
            return () => {
                listener()
            }
        },[])
        
        return(
            <FirebaseServiceContextProvider
                value={{
                    ...firebase,
                    profile:auth,
                    isAuthenticated:auth ? !!Object.keys(auth).length : false,
                    loginUser,
                    createNewUserWithEmailAndPassword
                }}
            >
                <Component {...props as P } />
            </FirebaseServiceContextProvider>
        )
    }
}

export type firebaseServiceType = ReturnType<typeof useFirebaseService>

export default useFirebaseService