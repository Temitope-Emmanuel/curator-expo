import React, { useState } from 'react';
import {
  Box,
  Text,
  Pressable,
  Icon,
  HStack,
  VStack,
  Spacer,
  Image,
} from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { IMedia } from '../models/Media';
import TouchableScale from 'react-native-touchable-scale';

const SwipeList:React.FC<{
  data:IMedia<"audio">[];
  showMore:(arg:string) => void;
  handlePress:(arg:string) => void;
  handleDelete:(arg:string) => void;
}> = ({data,handleDelete,showMore,handlePress}) => {
  
  const [listData, setListData] = useState<IMedia<"audio">[]>([]);

  React.useEffect(() => {
    setListData(data)
  },[data])

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => () => {
    closeRow(rowMap, rowKey);
    handleDelete(rowKey)
  };

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey);
  };


  const renderItem = ({ item, index }) => (
    <TouchableScale key={index}
      activeScale={0.9}
      tension={50}
      friction={7}
      useNativeDriver style={{backgroundColor:"whitesmoke"}}
      onPress={() => handlePress(item.uri)}
    >
        <Box bg="whitesmoke"
          mb="1"
        >
          <HStack alignItems="center" space={3}>
            <Image source={require("../assets/Images/cover.jpg")}
             alt="image" style={{width:75, height:75}} />
            <VStack>
              <Text color="coolGray.800"  _dark={{ color: 'warmGray.50' }}  bold>
                {item.name}
              </Text>
              <Text color="coolGray.600" _dark={{ color: 'warmGray.200' }}>
                {"this is is a description"}
              </Text>
            </VStack>
            <Spacer />
          </HStack>
        </Box>
    </TouchableScale>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
      <Pressable
        w="70"
        ml="auto"
        // cursor="pointer"
        bg="coolGray.200"
        justifyContent="center"
        onPress={() => {
          showMore(data.item.id)
          closeRow(rowMap, data.item.id) 
        }}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Icon
            as={<Entypo name="dots-three-horizontal" />}
            size="xs"
            color="coolGray.800"
          />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            More
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        w="70"
        bg="red.500"
        justifyContent="center"
        onPress={deleteRow(rowMap, data.item.id)}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  return (
      <SwipeListView
        keyExtractor={item => item.id}
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-130}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
  );
}


export default SwipeList