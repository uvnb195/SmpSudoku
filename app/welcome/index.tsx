import { Colors } from '@/constants/Colors'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, useColorScheme, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import OnBoardingItem from '../components/OnBoardingItem'
import { CheckIcon, ChevronDoubleRightIcon } from 'react-native-heroicons/solid'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { getLocales } from 'expo-localization'
import { router } from 'expo-router'

const Onboarding = () => {
    const languageCode = getLocales()[0].languageCode
    const theme = useColorScheme()

    const selectModeSrc = theme == 'dark'
        ? require('../../assets/lotties/SelectMode-Dark.json')
        : require('../../assets/lotties/SelectMode-Light.json')

    const flatListRef = useRef<FlatList>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const data = [0, 1]

    const handleChangeCurrent = useCallback((index: number) => {
        setCurrentIndex(index)
    }, [currentIndex])

    const opacity = useSharedValue(0)

    const opacityAnimation = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))


    useEffect(() => {
        if (currentIndex == data.length - 1) {
            setTimeout(() => {
                opacity.value = withTiming(1, { duration: 500 })
            }, 500);
        } else opacity.value = 0
        return () => { opacity.value = 0 }
    }, [currentIndex])

    const handleFinish = async () => {
        router.replace('/')
    }

    return (
        <SafeAreaView
            className='flex-1 flex-col'
            style={{
                backgroundColor: Colors[theme!!].background
            }}>

            <View className='w-full h-[90vh]'>
                <FlatList
                    ref={flatListRef}
                    horizontal
                    data={data}
                    renderItem={({ index }) =>
                        <OnBoardingItem index={index}
                            languageCode={languageCode == 'vi'
                                ? languageCode : 'global'} />}
                    pagingEnabled
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={({ viewableItems }) => {
                        if (viewableItems[0] && viewableItems[0].isViewable)
                            handleChangeCurrent(viewableItems[0].index!!)
                    }}
                />
            </View>

            {/* bottom */}
            <View className='flex-1 justify-end'>
                {/* pagination */}
                <View className=' absolute top-0 flex-row left-0 right-0 items-center justify-center h-5 gap-x-1'>
                    {data.map((_, index) => {
                        const isSelected = index == currentIndex
                        return <View
                            style={{
                                backgroundColor: isSelected
                                    ? Colors[theme!!].text
                                    : Colors[theme!!].button,
                                width: isSelected
                                    ? 12
                                    : 10,
                                height: isSelected
                                    ? 12
                                    : 10,
                            }}
                            className='w-2 h-2 rounded-full' key={index} />
                    }
                    )}
                </View>
                {currentIndex == data.length - 1 &&
                    <Animated.View className='self-end mr-4 mb-4'
                        style={opacityAnimation}>
                        <Pressable className='flex-row items-center gap-2'
                            onPress={handleFinish}>
                            <Text
                                className='text-xl'
                                style={{
                                    color: Colors[theme!!].text
                                }}>Finish</Text>
                            <ChevronDoubleRightIcon color={
                                Colors[theme!!].text
                            } />
                        </Pressable>
                    </Animated.View>
                }
            </View>
        </SafeAreaView>
    )
}

export default Onboarding