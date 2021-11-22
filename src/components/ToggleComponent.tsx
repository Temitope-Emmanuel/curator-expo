import React from "react"
import {StyleSheet} from "react-native"
import TouchableScale from "react-native-touchable-scale"
import {PresenceTransition} from "native-base"

export const ToggleComponent:React.FC<{
    FirstComponent:JSX.Element;
    SecondComponent:JSX.Element;
    open:boolean;
    toggle:() => void;
}> = ({
    FirstComponent,SecondComponent,
    open,toggle
}) => {
  return (
    <TouchableScale onPress={toggle} style={styles.container} >
        <PresenceTransition
            visible={open}
            initial={{
                opacity: 0,
                scale: 0
            }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 200
                }
            }}
        >
            {FirstComponent}
        </PresenceTransition>
        <PresenceTransition
            visible={!open}
            initial={{
                opacity: 0,
                scale: 0
            }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 200
                }
            }}
        >
            {SecondComponent}
        </PresenceTransition>
    </TouchableScale>
  )
}

const styles = StyleSheet.create({
    container:{
        width:"30%",
        height:"100%"
    }
})

export default ToggleComponent