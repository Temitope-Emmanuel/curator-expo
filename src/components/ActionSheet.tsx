import React from "react"
import {Actionsheet,Text} from "native-base"

interface ItemType {
    label:string;
    icon?:JSX.Element,
    onPress:() => void;
}

const ActionSheetComp:React.FC<{
    title:string;
    items:ItemType[];
    open:boolean;
    onOpen:() => void;
    onClose:() => void
}> = ({
    title,items,
    onClose,onOpen,open
}) => {

    return(
        <>
            <Actionsheet isOpen={open} onClose={onClose}>
                <Actionsheet.Content style={{backgroundColor:"#FD4D4D"}}>
                    <Text style={{textAlign:"left"}}>
                        {title}
                    </Text>
                    {items.map(({label,onPress,icon},idx) => (
                        <Actionsheet.Item startIcon={
                            icon ? icon : undefined
                        } 
                        key={idx} onPress={onPress}>
                            {/* <HStack alignItems="center" space={2}>
                                
                                <Text>
                                </Text>
                            </HStack> */}
                                    {label}
                        </Actionsheet.Item>
                    ))}
                    <Text>
                        <Actionsheet.Item onPress={onClose}>
                            Cancel
                        </Actionsheet.Item>
                    </Text>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    )
}

export default ActionSheetComp