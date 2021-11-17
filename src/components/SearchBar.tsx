import React from 'react';
import {
  VStack,
  Input,
  Icon,
  Box,
  Divider,
  Heading,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const SearchBar:React.FC<{
  open:boolean;
  toggle:() => void
}> = ({
  open,toggle
}) => {
return (
    <Input onFocus={toggle} onBlur={toggle}
      placeholder="Search"
      // bg="#fff"
      width="100%"
      borderRadius="4"
      borderColor="gray.500"
      py="3"
      px="1"
      fontSize="16"
      _focus={{
        borderColor:"gray.800"
      }}
      InputLeftElement={
        <Icon
          m="2"
          ml="3"
          size="7"
          color="gray.400"
          as={<MaterialIcons name="search" />}
        />
      }
    />
  );
}

export default SearchBar