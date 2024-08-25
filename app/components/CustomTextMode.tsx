import { Colors } from '@/constants/Colors'
import React from 'react'
import { Text, useColorScheme, View } from 'react-native'

const CustomTextMode = ({ children, isSelected }:
    {
        children: string,
        isSelected: boolean
    }) => {
    const theme = useColorScheme()
    return (
        <View className=' w-[80px] h-[30px]'>
            <Text className='text-xl' numberOfLines={1}
                style={{
                    color: isSelected ? Colors[theme!!].iconSelected : Colors[theme!!].text
                }}>
                {/* uppercase first letter */}
                {children.substring(0, 1).toUpperCase() + children.substring(1)}
            </Text>
        </View>
    )
}

export default CustomTextMode