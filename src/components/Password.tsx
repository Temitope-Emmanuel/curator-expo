import React from "react"
import { Input, Icon, Box, useDisclose} from "native-base"
// import MaterialIcon from "@expo/vector-icons/MaterialIcons"
import { Controller } from "react-hook-form"

const PasswordInput:React.FC<{
  control:any
}> = ({
  control
}) => {
    const {isOpen:open,onToggle} = useDisclose()
  return (
    <Box w="100%">
      {/* <Controller 
        control={control} name="password"
        render={({field:{onBlur,onChange,value}}) => (
          <Input value={value} onChangeText={onChange}
            onBlur={onBlur} type={open ? "text" : "password"}
            InputRightElement={
              <Icon onPress={onToggle}
                as={<MaterialIcon name={open ? "remove-red-eye" : "visibility-off"} />}
                size="md"
                m={2}
                _light={{
                  color: "black",
                }}
                _dark={{
                  color: "gray.300",
                }}
              />
            }
            placeholder="Input Password" // mx={4}
            _light={{
              placeholderTextColor: "blueGray.400",
            }}
            _dark={{
              placeholderTextColor: "blueGray.50",
            }}
          />
        )}
      /> */}
    </Box>
  )
}

export default PasswordInput