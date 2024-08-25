import { Colors } from '@/constants/Colors'
import React, { ReactNode, useEffect, useState } from 'react'
import { Pressable, useColorScheme, View, ViewStyle } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import { setShowError } from '../global_state/puzzleSlice'

interface Props {
    style?: ViewStyle
    colors?: string[],
    backgroundColor?: string,
    iconStart?: () => ReactNode,
    iconEnd?: () => ReactNode
}

const CustomTransformSwitch = (
    { style, iconStart, iconEnd, colors: listColor, backgroundColor }: Props) => {
    const theme = useColorScheme()
    const dispatch = useDispatch()

    const colors = listColor ? listColor
        : [Colors[theme!!].iconSelected, Colors[theme!!].blue]

    const { showError } = useSelector((state: RootState) => state.puzzle)
    const [status, setStatus] = useState(showError || false)

    const animation = useDerivedValue(() => withTiming(status ? 1 : 0, { duration: 300 }), [status])
    const translateX = useDerivedValue(() => withTiming(status ? 16 : 0, { duration: 300 }), [status])
    const colorsAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            animation.value,
            [0, 1],
            [...colors]
        ),
        transform: [{ translateX: translateX.value }]
    }))

    const switchAnimationStart = useAnimatedStyle(() => ({
        opacity: (1 - animation.value),
    }))

    const switchAnimationEnd = useAnimatedStyle(() => ({
        opacity: (animation.value),
    }))

    const handlePress = () => {
        setStatus(!status)
    }


    const setBgColor = () => {
        if (backgroundColor) return backgroundColor
        else return Colors[theme!!].background
    }

    useEffect(() => {
        if (status != showError) {
            dispatch(setShowError(status))
        }
    }, [status])


    return (
        <Pressable
            onPress={handlePress}
            className='h-7 w-12 py-2 rounded-full justify-center'
            style={[style]}>
            <View className='rounded-full w-full h-full'
                style={{
                    backgroundColor: setBgColor()
                }}
            ></View>
            <Animated.View style={colorsAnimation} className={'h-6 w-6 absolute rounded-full left-1 items-center justify-center z-10'}>
                {/* icon start */}
                <Animated.View className='w-4 h-4 absolute rounded-full items-center justify-center'
                    style={switchAnimationStart}
                >
                    {iconStart && iconStart()}
                </Animated.View>

                {/* icon end */}
                <Animated.View className='w-4 h-4 absolute rounded-full items-center justify-center'
                    style={[switchAnimationEnd]}>
                    {iconEnd && iconEnd()}
                </Animated.View>
            </Animated.View>
        </Pressable>
    )
}

export default CustomTransformSwitch