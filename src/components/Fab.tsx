import React from "react"
import {
  Box,
  IconButton,
  Stagger,Fab
} from "native-base"
import AntIcon from "@expo/vector-icons/AntDesign"


interface IconType {
    name:string;
    icon:JSX.Element;
    label:string;
    onPress:() => void
}

const FAB:React.FC<{
    icons:IconType[];
    open:boolean;
    toggle:() => void
}> = ({icons,open,toggle}) => {
  
  return (
    <Box style={{position:"absolute",right:38,bottom:100}}>
        <Box>
            <Stagger 
            visible={open}
            initial={{
                opacity: 0,
                scale: 0,
                translateY: 10
            }}
            animate={{
                translateY: 0,
                scale: 1,
                opacity: 1,
                transition: {
                type: "spring",
                mass: 0.8,
                stagger: {
                    offset: 30,
                    reverse: true,
                }
                }
            }}
            exit={{
                translateY: 34,
                scale: 0.5,
                opacity: 0,
                transition: {
                duration: 100,
                stagger: {
                    offset: 30,
                    reverse: true,
                },
                },
            }}
            >
            {icons.map(({icon,label,onPress,name},idx) => (
                <IconButton backgroundColor="#FD4D4D"
                    mb={4} onPress={onPress} key={idx}
                    variant="solid" p={1.5*(idx+1)}
                    rounded="full" icon={icon}
                />
            ))}
            </Stagger>
        </Box>
      <Fab 
        bgColor="#FD4D4D" onPress={toggle}
        right={30} bottom={10} 
        icon={<AntIcon name="pluscircle" size={30} color="#0B0E11" />}
      />
    </Box>
  )
}
export default FAB