import { Colors } from '@/constants/Colors'
import React from 'react'
import { ActivityIndicator, useColorScheme, View } from 'react-native'

const Loading = () => {
    const theme = useColorScheme()
    return (
        <View
            className='justify-center items-center absolute top-0 left-0 right-0 bottom-0'
            style={{
                backgroundColor: Colors[theme!!].blurBackground
            }}>
            <ActivityIndicator color={(theme == 'dark' ? Colors.dark.text : Colors.light.background)} size={40} />
        </View>
    )
}

export default Loading