import React from "react"
import {Actionsheet,Icon,Text} from "native-base"

interface ItemType {
    label:string;
    iconType?:any;
    icon?:string;
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
                    {items.map(({label,onPress,iconType,icon},idx) => (
                        <Actionsheet.Item startIcon={
                            icon ? <Icon as={iconType} size="6" name={icon} /> : undefined
                        } 
                        key={idx} onPress={onPress}>
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