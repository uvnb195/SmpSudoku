import { Colors } from '@/constants/Colors'
import React, { ReactNode, useEffect, useState } from 'react'
import { Pressable, useColorScheme, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { useDispatch } from 'react-redux'

interface Props {
    style?: ViewStyle
    colors?: string[],
    status: boolean,
    backgroundColor?: string,
    disable: boolean,
    iconStart?: () => ReactNode,
    iconEnd?: () => ReactNode,
    handlePress: (status: boolean) => void
}

const CustomDropDownButton = (
    {
        style,
        status,
        iconStart,
        iconEnd,
        disable,
        handlePress: handlePressButton }: Props) => {
    const theme = useColorScheme()
    const dispatch = useDispatch()

    const animation = useDerivedValue(() => withTiming(status ? 1 : 0, { duration: 200 }), [status])

    const bouncing = useSharedValue(1)
    const bouncingAnimation = useAnimatedStyle(() => ({
        transform: [{ scale: bouncing.value }]
    }))

    const switchAnimationStart = useAnimatedStyle(() => ({
        opacity: (1 - animation.value),
    }))

    const switchAnimationEnd = useAnimatedStyle(() => ({
        opacity: (animation.value),
    }))

    const handlePress = () => {
        handlePressButton(!status)
    }

    const [disableButton, setDisableButton] = useState(false)

    useEffect(() => {
        bouncing.value = withSequence(
            withTiming(0, { duration: 200 }),
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 200 })
        )
        setDisableButton(true)
        setTimeout(() => setDisableButton(false), 600)
        return () => {
            bouncing.value = 1
        }
    }, [status])



    return (
        <Pressable
            disabled={disable || disableButton}
            onPress={() => {
                handlePress()
            }}
            className='rounded-full justify-center items-center z-20'
            style={[
                {
                    width: 60,
                    height: 60
                },
                style]}>
            {/* on */}
            <Animated.View className={'w-full h-full rounded-full items-center justify-center absolute'}
                style={[
                    {
                        borderColor: Colors[theme!!].text
                    },
                    switchAnimationStart,
                    bouncingAnimation]}>
                {iconStart && iconStart()}
            </Animated.View>
            {/* off */}
            <Animated.View className={'w-full h-full items-center justify-center absolute'}
                style={[
                    {
                        borderColor: Colors[theme!!].text
                    },
                    switchAnimationEnd,
                    bouncingAnimation]}>
                {iconEnd && iconEnd()}
            </Animated.View>
        </Pressable>
    )
}

export default CustomDropDownButton