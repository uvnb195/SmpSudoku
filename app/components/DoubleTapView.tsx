import { TapGestureHandler } from 'react-native-gesture-handler'

import React, { ReactNode, useEffect, useState } from 'react'
import { ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'

interface Props {
    value: number,
    style: ViewStyle,
    children: ReactNode,
    accessDoubleTap: boolean,
    handleTapAction?: (position: { x: number, y: number }) => void,
    handleDoubleTapAction: () => void
}

const DoubleTapView = ({
    value,
    style,
    children,
    accessDoubleTap,
    handleTapAction,
    handleDoubleTapAction }: Props) => {
    const dispatch = useDispatch()

    const { valueSelected } = useSelector((state: RootState) => state.puzzle)

    const [positionOnLayout, setPositionOnLayout] = useState<{ x: number, y: number } | null>(null)

    const handleDoubleTap = () => {
        if (!accessDoubleTap) return

        handleDoubleTapAction()
    }

    const handleTap = () => {
        if (positionOnLayout) {
            handleTapAction && handleTapAction(positionOnLayout)
        }
        setTimeout(() => { animation.value = 1 }, 150)
    }

    const animation = useSharedValue(1)
    const animationScale = useAnimatedStyle(() => ({
        transform: [{ scale: animation.value }]
    }))

    const startAnimation = () => {
        animation.value = withSequence(
            withTiming(1.5, { duration: 50 }),
            withTiming(0.5, { duration: 50 }),
            withTiming(1, { duration: 50 })
        )
    }




    useEffect(() => {
        if (valueSelected == value)
            startAnimation()
    }, [valueSelected])

    return (
        <TapGestureHandler
            onBegan={handleTap}
            onEnded={handleDoubleTap}
            numberOfTaps={2}>
            <Animated.View
                style={[
                    style,
                    animationScale
                ]}
                className='flex-row flex-wrap items-center justify-center'
                onLayout={(e) => {
                    e.target.measureInWindow((x, y, height, width) => {
                        const centerX = x + (width / 2)
                        const centerY = y + (height / 2)
                        setPositionOnLayout({ x: centerX, y: centerY })
                    })
                }}
            >
                {children}
            </Animated.View>
        </TapGestureHandler>
    )
}

export default DoubleTapView