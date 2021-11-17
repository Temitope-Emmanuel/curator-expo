import React from "react"
import firebase from "firebase"
import Firebase, {createFirebase} from "./firebaseClass"
import { createGenericContext } from "./hooks"
import { useToast } from "native-base"
import { IAccount } from "../../models/Account"


const [useFirebaseService,FirebaseServiceContextProvider] = createGenericContext<{
    currentUser:firebase.User | null;
    loginUser:(arg:{email:string,password:string}) => Promise<firebase.auth.UserCredential>;
    createNewUserWithEmailAndPassword:(arg:{email:string,password:string}) => Promise<void>
} & Firebase>()

export const FirebaseServiceProvider = <P extends object>(Component:React.ComponentType<P>) => {
    const firebase = createFirebase()

    return function Provider({...props}){
        const toast = useToast()
        const userCollection = React.useRef(() => firebase.firestore.collection("Users"))
        const [auth,setAuth] = React.useState<firebase.User | null>(null)
        
        const handleAuthStateChange = (newAuth:firebase.User | null) => {
            if(newAuth){
                setAuth(newAuth)
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

        const createNewUserWithEmailAndPassword = async ({ email, password }: {
            email: string;
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
                        username: (data.additionalUserInfo.profile as any)?.name || ""
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
                    currentUser:auth,
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