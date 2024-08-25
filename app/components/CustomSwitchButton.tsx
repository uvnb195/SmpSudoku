import { Colors } from '@/constants/Colors'
import React, { ReactNode } from 'react'
import { Pressable, useColorScheme, ViewStyle } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'

interface Props {
    style?: ViewStyle
    status: boolean
    handlePress: (v: boolean) => void,
    colors?: string[],
    backgroundColor?: string,
    children: ReactNode // icon
}

const CustomSwitchButton = (
    { style, status: enableNote, handlePress, children, colors: listColor, backgroundColor }: Props) => {
    const theme = useColorScheme()
    const colors = listColor ? listColor :
        theme == 'dark'
            ? [Colors.dark.textLight, Colors.dark.tint]
            : [Colors.light.textLight, Colors.light.tint]
    const animation = useDerivedValue(() => withTiming(enableNote ? 1 : 0, { duration: 300 }), [enableNote])
    const translateX = useDerivedValue(() => withTiming(enableNote ? 16 : 0, { duration: 300 }), [enableNote])
    const colorsAnimation = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            animation.value,
            [0, 1],
            [...colors]
        ),
        transform: [{ translateX: translateX.value }]
    }))

    const setBgColor = () => {
        if (backgroundColor) return backgroundColor
        else return Colors[theme!!].background
    }

    return (
        <Pressable
            onPress={() => handlePress(!enableNote)}
            className='h-7 w-12 rounded-full justify-center bg-black'
            style={[{
                backgroundColor: setBgColor()
            }, style]}>
            <Animated.View style={colorsAnimation} className={'h-6 w-6 absolute rounded-full left-1 items-center justify-center'}>
                {children}
            </Animated.View>
        </Pressable>
    )
}

export default CustomSwitchButton