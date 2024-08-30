import { Colors } from '@/constants/Colors'
import React, { memo } from 'react'
import { Animated, Text, View } from 'react-native'
import { useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import { updatePosition } from '../global_state/puzzleSlice'
import DoubleTapView from './DoubleTapView'

interface Props {
    theme: 'dark' | 'light'
    size: number,
    value: number,
    index: { row: number, col: number },
    style?: string,
    isBasedNumber: boolean,
    handleDoubleTap: () => void
}

const Item = (props: Props) => {
    const { row, col } = props.index
    const { theme } = props

    const fontSize = Math.floor(props.size / 2)
    const fontWeight = props.isBasedNumber ? '900' : '400'
    const hintSize = Math.floor(props.size / 3)
    const { row: rowCheck, col: colCheck } = useSelector((state: RootState) => state.puzzle.position)
    const {
        rootPuzzle,
        hints: hintList,
        based: puzzleList,
        solved: solvedList,
        valueSelected } = useSelector((state: RootState) => state.puzzle)

    const dispatch = useDispatch()

    // handle backgroud color
    const getBackgroundColor = () => {
        // check is item selected
        if (rowCheck == row && colCheck == col) return Colors[theme].itemSelected
        // check in row or col selected
        else if (rowCheck == row || colCheck == col) return Colors[theme].areaSelected
        // check in box
        else if (Math.floor(rowCheck / 3) == Math.floor(row / 3) && Math.floor(colCheck / 3) == Math.floor(col / 3))
            return Colors[theme].areaSelected
        return 'transparent'
    }

    const getNumberColor = () => {
        // error color
        if (solvedList[row][col] != 0
            && solvedList[row][col] != rootPuzzle[row][col])
            return Colors[theme].error
        // selects color
        if (puzzleList[row][col] == valueSelected
            || solvedList[row][col] == valueSelected)
            return Colors[theme].blue
        // others
        return props.isBasedNumber
            ? Colors[theme].textLight
            : Colors[theme].text
    }

    const numberAnimation = useAnimatedStyle(() => ({
        transform: [{
            scale: withSequence(
                withTiming(1.2, { duration: 100 }),
                withTiming(0.8, { duration: 100 }),
                withTiming(1, { duration: 100 }))
        }]
    }))

    const renderHint = (row: number, col: number) => {
        const hints = []
        for (let i = 0; i < 9; i++) {
            hints.push(
                hintList[row][col][i] == true
                    ? <Animated.View
                        key={i}
                        className=' items-center justify-evenly'
                        style={[
                            {
                                width: hintSize,
                                height: hintSize
                            },
                        ]}>
                        <Text style={{
                            fontSize: Math.floor(hintSize / 1.5),
                            color: theme == 'dark' ? Colors.dark.textLight : Colors.light.textLight
                        }}>{i + 1}</Text>
                    </Animated.View>
                    :
                    <View key={i}
                        style={{ width: hintSize, height: hintSize }} />
            )
        }

        return hints
    }


    return (
        <DoubleTapView
            value={props.value}
            style={{
                height: props.size,
                width: props.size,
                backgroundColor: getBackgroundColor()
            }}
            accessDoubleTap={!props.isBasedNumber}
            handleTapAction={({ x, y }) => {
                dispatch(updatePosition({
                    position: {
                        x, y, col, row,
                        valueSelected: props.value && props.value
                    }
                }))
            }}
            handleDoubleTapAction={props.handleDoubleTap}
        >

            {props.value != 0 ?
                <Text style={
                    [
                        {
                            fontSize: fontSize,
                            lineHeight: props.size,
                            fontWeight: fontWeight,
                            color: getNumberColor()
                        }
                    ]}>{props.value}</Text>
                : renderHint(row, col)}
        </DoubleTapView>
    )
}

export default memo(Item)