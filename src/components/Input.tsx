import React from "react"
import { Input, Icon, Box} from "native-base"
import {Controller} from "react-hook-form"

const InputComponent:React.FC<{
    leftIcon?:any;
    control:any;
    name:string;
    placeholder?:string;
    rightIcon?:any;
}> = ({
    leftIcon,rightIcon,
    name,control,placeholder
}) => {

  return (
    <Box w="100%">
      <Controller
        control={control} name={name} defaultValue=""
        render={({field:{onChange,onBlur,value}}) => (
          <Input value={value} onBlur={onBlur}
          onChangeText={onChange}
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
              <Icon
                as={rightIcon}
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