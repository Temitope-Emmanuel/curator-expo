import React from "react"
import { Box, TextArea} from "native-base"
import {Controller} from "react-hook-form"
import { ViewProps } from "react-native"

const TextAreaComponent:React.FC<{
    control:any;
    name:string;
    placeholder?:string;
    style?:ViewProps["style"]
}> = ({
    name,control,placeholder,style
}) => {

  return (
    <Box w="100%" {...{style}}>
      <Controller
        control={control} name={name} defaultValue=""
        render={({field:{onChange,onBlur,value}}) => (
          <TextArea value={value} onBlur={onBlur}
            onChangeText={onChange}
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

export default TextAreaComponent