import { Colors } from '@/constants/Colors'
import React, { ReactNode, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, useColorScheme, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { useDispatch } from 'react-redux'
import { useLoading } from '../context/ContextProvider'

interface Props {
    style?: ViewStyle
    iconStart?: () => ReactNode,
    iconEnd?: () => ReactNode
}

const CustomTranformButton = (
    {
        style,
        iconStart,
        iconEnd }: Props) => {
    const theme = useColorScheme()
    const dispatch = useDispatch()

    const { loading, pause, setPause } = useLoading()

    const animation = useDerivedValue(() => withTiming(pause ? 1 : 0, { duration: 300 }), [pause])

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

    // const loadingAnimation = 

    const handlePress = () => {
        setPause(!pause)
    }

    const [disableButton, setDisableButton] = useState(false)

    useEffect(() => {
        setDisableButton(true)
        bouncing.value = withSequence(
            withTiming(0, { duration: 200 }),
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 200 })
        )
        setTimeout(() => setDisableButton(false), 600)
    }, [pause])


    return (
        <>
            {loading
                ? <View className='rounded-full justify-center items-center z-20 border'
                    style={[
                        {
                            width: 60,
                            height: 60,
                            borderColor: Colors[theme!!].text
                        },
                        style,
                    ]}>
                    <ActivityIndicator size={32}
                        color={Colors[theme!!].blue} />
                </View>

                : <Pressable
                    disabled={disableButton}
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
                    <Animated.View className={'w-full h-full rounded-full items-center justify-center absolute border-2'}
                        style={[
                            {
                                borderColor: Colors[theme!!].text
                            },
                            switchAnimationStart,
                            bouncingAnimation]}>
                        {iconStart && iconStart()}
                    </Animated.View>
                    {/* off */}
                    <Animated.View className={'w-full h-full rounded-full items-center justify-center absolute border-2'}
                        style={[
                            {
                                borderColor: Colors[theme!!].text
                            },
                            switchAnimationEnd,
                            bouncingAnimation]}>
                        {iconEnd && iconEnd()}
                    </Animated.View>
                </Pressable>
            }
        </>
    )
}

export default CustomTranformButton