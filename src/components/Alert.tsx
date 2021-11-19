import React from "react"
import {
    Alert,
    HStack,
    VStack,
    Text,
    Divider,
    Flex,
    Box,
    CloseIcon,
    IconButton,
    IAlertProps
} from "native-base"

const AlertComponent:React.FC<{
   title:string;
   description:string;
} & Pick<IAlertProps,"status">> = ({
    description,title,status,
}) => {

    return (
        <Alert w="100%" status={status} variant="left-accent">
            <VStack space={2} flexShrink={1} w="100%">
                <HStack
                    flexShrink={1}
                    space={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon />
                        <Text
                            fontSize="md"
                            fontWeight="medium"
                            _dark={{
                                color: "coolGray.800",
                            }}
                        >{title}</Text>
                    </HStack>
                </HStack>
                <Box
                    pl="6"
                    _dark={{
                        _text: {
                            color: "coolGray.600",
                        },
                    }}
                >
                    {description}
                </Box>
            </VStack>
        </Alert>
    )
}

export default AlertComponent