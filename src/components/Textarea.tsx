import React from "react"
import { Box, TextArea} from "native-base"
import {Controller} from "react-hook-form"
import { StyleProp, TextStyle, ViewProps } from "react-native"

const TextAreaComponent:React.FC<{
  control:any;
  name:string;
  placeholder?:string;
  containerStyle?:ViewProps["style"];
  inputStyle?:StyleProp<TextStyle>;
}> = ({
  name,control,placeholder,
  containerStyle,inputStyle
}) => {

  return (
    <Box w="100%" style={containerStyle}>
      <Controller
        control={control} name={name} defaultValue=""
        render={({field:{onChange,onBlur,value}}) => (
          <TextArea value={value} onBlur={onBlur}
            onChangeText={onChange} style={inputStyle}
            placeholder={placeholder}
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