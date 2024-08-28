import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { WINDOW_WIDTH } from '@/constants/WindowDimession'
import LottieView from 'lottie-react-native'
import { getLocales } from 'expo-localization'
import { GifSource, TextSource } from '@/constants/OnBoardingSource'
import { Colors } from '@/constants/Colors'

interface Props {
    languageCode: 'vi' | 'global'
    index: number,
}

const OnBoardingItem = ({ index, languageCode }: Props) => {
    const theme = useColorScheme()
    const src = index == 0
        ? GifSource[theme!!].selectMode
        : GifSource[theme!!].showDialog
    const textSrc = index == 0
        ? TextSource[languageCode].selectMode
        : TextSource[languageCode].showDialog
    const texts = textSrc.split('{enter}')
    return (
        <View className='h-[90vh]'
            style={{
                width: WINDOW_WIDTH
            }}>
            <LottieView
                autoPlay
                style={{
                    width: '100%',
                    height: '50%'
                }}
                source={src} />
            <View className='flex-1 p-4 border-white border'>
                {texts.map((value, index) =>
                    <Text
                        key={index}
                        className='text-xl font-light'
                        style={{
                            color: Colors[theme!!].text
                        }}>{value}</Text>
                )}
            </View>
        </View>
    )
}

export default OnBoardingItem