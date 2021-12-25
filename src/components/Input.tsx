import React from "react"
import { Input, Icon, Box} from "native-base"
import {Controller} from "react-hook-form"
import { ViewProps, StyleProp, TextStyle } from "react-native"

const InputComponent:React.FC<{
  leftIcon?:any;
  control:any;
  name:string;
  placeholder?:string;
  rightIcon?:any;
  containerStyle?:ViewProps["style"];
  inputStyle?:StyleProp<TextStyle>;
}> = ({
    leftIcon,rightIcon,containerStyle,inputStyle,
    name,control,placeholder
}) => {

  return (
    <Box w="100%" style={containerStyle}>
      <Controller
        control={control} name={name} defaultValue=""
        render={({field:{onChange,onBlur,value}}) => (
          <Input value={value} onBlur={onBlur}
          onChangeText={onChange} style={inputStyle}
            InputLeftElement={
                leftIcon ?
              <Icon
                as={leftIcon}
                size="md"
                m={2}
                _light={{
                  color: "black",
                }}
                _dark={{
                  color: "gray.300",
                }}
              /> : undefined
            }
            InputRightElement={
                rightIcon ?
                rightIcon 
               : undefined
            }
            placeholder={placeholder} // mx={4}
            _light={{
              placeholderTextColor: "blueGray.400",
            }}
            _dark={{
              placeholderTextColor: "blueGray.50",
            }}
          />
        )}
      />
    </Box>
  )
}

export default InputComponent