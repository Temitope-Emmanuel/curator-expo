import { Button, Icon, Text, useDisclose, useToast, VStack } from "native-base"
import Input from "./Input"
import Modal from "./Modal"
import React from "react"
import { useForm } from "react-hook-form"
import {AntDesign,MaterialIcons,FontAwesome} from "@expo/vector-icons"
import PasswordInput from "./Password"
import useFirebaseService from "../utils/firebase"

interface InputProps {
    password: string;
    username:string;
    email: string
}

const AuthModal: React.FC<{
    openModal: boolean;
    toggleModal: () => void;
}> = ({
    openModal, toggleModal
}) => {
        const toast = useToast()
        const {auth,loginUser,createNewUserWithEmailAndPassword} = useFirebaseService()
        const { control, formState, handleSubmit } = useForm<InputProps>({
            defaultValues: {
                email: "",
                username:"",
                password: ""
            }
        })
        const { isOpen: submitting, onToggle: toggleSubmitting } = useDisclose()
        
        const onSubmit = async ({ email, password, username }: InputProps) => {
            return loginUser({
                email, password
            }).then((data) => {
                toggleModal()
            }).catch(err => {
                if (err.code === "auth/user-not-found") {
                    createNewUserWithEmailAndPassword({ email, password, username }).then(() => {
                        toggleModal
                    })
                    .catch(err => {
                        console.log("there's been an err",JSON.stringify(err))
                    })
                } else {
                    toast.show({
                        title: "Unable to create login User",
                        status: "error",
                        description: `Error:${err.message}`
                    })
                }
            })
        }
        const submitWithGoogle = () => {
            toggleSubmitting()
            // firebaseService.signInWithGoogle().then(() => {
            //   toggleSubmitting()
            //   toggleModal()
            // }).catch(() => {
            //   toggleSubmitting()
            //   toggleModal()
            // })
        }
        

        return (
            <Modal title="Login"
                open={openModal}
                handleToggle={toggleModal}
            >
                <VStack space={2}>
                    <Input control={control} name="email"
                        placeholder="Input Email"
                        rightIcon={
                            <MaterialIcons name="email" />
                        } />
                    <PasswordInput control={control} />
                    <Input control={control} name="username"
                        placeholder="Input Username"
                        rightIcon={
                            <FontAwesome name="user" />
                        } />
                    <Button isLoading={submitting || formState.isSubmitting || !formState.isValid}
                        onPress={handleSubmit(onSubmit)} isLoadingText="Creating User" >
                        Create User
                    </Button>
                </VStack>
                <Text mx="auto" my="2">
                    Or
                </Text>
                <Button variant="outline" disabled={submitting || formState.isSubmitting}
                    startIcon={
                        <Icon as={AntDesign} size="6" name="google" />
                    } onPress={submitWithGoogle}
                >
                    Sign In with Google
                </Button>
            </Modal>

        )
    }

export default AuthModal