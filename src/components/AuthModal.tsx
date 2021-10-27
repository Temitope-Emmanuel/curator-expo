// import useFirebaseService from "@src/utils/Firebase/Firebase"
import { Button, Text, useDisclose, useToast, VStack } from "native-base"
import Input from "./Input"
import Modal from "./Modal"
import React from "react"
import { useForm } from "react-hook-form"
// import MaterialIcon from "@expo/vector-icons/MaterialIcons"
// import AntIcon from "@expo/vector-icons/AntDesign"
import PasswordInput from "./Password"

interface InputProps {
    password: string;
    email: string
}

const AuthModal: React.FC<{
    openModal: boolean;
    toggleModal: () => void;
}> = ({
    openModal, toggleModal
}) => {
        const toast = useToast()
        const { control, formState, handleSubmit } = useForm<InputProps>({
            defaultValues: {
                email: "",
                password: ""
            }
        })
        // const firebaseService = useFirebaseService()
        const { isOpen: submitting, onToggle: toggleSubmitting } = useDisclose()
        
        const onSubmit = async ({ email, password }: InputProps) => {
            // return firebaseService.loginUser({
            //     email, password
            // }).then((data) => {
            //     toggleModal()
            //     toast.show({
            //         title: "User Successfully Logged In",
            //         placement: "bottom",
            //         status: "success"
            //     })
            // }).catch(err => {
            //     if (err.code === "auth/user-not-found") {
            //         firebaseService.createNewUser({ email, password })
            //     } else {
            //         toast.show({
            //             title: "Unable to create login User",
            //             status: "error",
            //             description: `Error:${err.message}`
            //         })
            //     }
            // })
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
                    {/* <Input control={control} name="email"
                        placeholder="Input Email"
                        rightIcon={
                            <MaterialIcon name="email" />
                        } /> */}
                    <PasswordInput control={control} />
                    <Button isLoading={submitting || formState.isSubmitting || !formState.isValid}
                        onPress={handleSubmit(onSubmit)} isLoadingText="Creating User" >
                        Create User
                    </Button>
                </VStack>
                <Text mx="auto" my="2">
                    Or
                </Text>
                {/* <Button variant="outline" disabled={submitting || formState.isSubmitting}
                    startIcon={
                        <AntIcon name="google" />
                    } onPress={submitWithGoogle}
                >
                    Sign In with Google
                </Button> */}
            </Modal>

        )
    }

export default AuthModal