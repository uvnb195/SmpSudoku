import { Colors } from '@/constants/Colors'
import React, { memo } from 'react'
import { Animated, Text, useColorScheme, View } from 'react-native'
import { useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import { updatePosition } from '../global_state/puzzleSlice'
import DoubleTapView from './DoubleTapView'

interface Props {
    size: number,
    value: number,
    index: { row: number, col: number },
    style?: string,
    isBasedNumber: boolean,
    handleDoubleTap: () => void
}

const Item = (props: Props) => {
    const theme = useColorScheme()
    const { row, col } = props.index

    const fontSize = Math.floor(props.size / 2)
    const fontWeight = props.isBasedNumber ? '900' : '400'
    const hintSize = Math.floor(props.size / 3)
    const { row: rowCheck, col: colCheck } = useSelector((state: RootState) => state.puzzle.position)
    const {
        hints: hintList,
        based: puzzleList,
        solved: solvedList,
        valueSelected,
        showError } = useSelector((state: RootState) => state.puzzle)

    const dispatch = useDispatch()

    // handle backgroud color
    const backgroundColor = () => {
        // check is item selected
        if (rowCheck == row && colCheck == col) return Colors[theme!!].itemSelected
        // check in row or col selected
        else if (rowCheck == row || colCheck == col) return Colors[theme!!].areaSelected
        // check in box
        else if (Math.floor(rowCheck / 3) == Math.floor(row / 3) && Math.floor(colCheck / 3) == Math.floor(col / 3))
            return Colors[theme!!].areaSelected
        return 'transparent'
    }

    const isInRow = (value: number | undefined) => {
        if (!value || value == 0) return false
        let count = 0
        for (let i = 0; i < 9; i++) {
            if (puzzleList[row][i] != 0 && puzzleList[row][i] == value) {
                count++
                if (count > 1)
                    return true
            }
            else if (solvedList[row][i] != 0 && solvedList[row][i] == value) {
                count++
                if (count > 1)
                    return true
            }
        }
        return false
    }

    const isInCol = (value: number | undefined) => {
        if (!value || value == 0) return false
        let count = 0
        for (let i = 0; i < 9; i++) {
            if (puzzleList[i][col] != 0 && puzzleList[i][col] == value) {
                count++
                if (count > 1) return true
            }
            else if
                (solvedList[i][col] != 0 && solvedList[i][col] == value) {
                count++
                if (count > 1)
                    return true
            }
        }
        return false
    }

    const isInBox = (value: number | undefined) => {
        if (!value || value == 0) return false
        const rowStart = Math.floor(row / 3) * 3
        const colStart = Math.floor(col / 3) * 3
        let count = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (
                    puzzleList[rowStart + i][colStart + j]
                    == value
                    || solvedList[rowStart + i][colStart + j] == value) {
                    count++
                    if (count > 1) {
                        return true
                    }
                }
            }
        }
        return false
    }

    const showErrorColorSelected = () => {
        if (showError === true
            && (isInBox(valueSelected)
                || isInCol(valueSelected)
                || isInRow(valueSelected))) {
            return Colors[theme!!].error
        }
        return Colors[theme!!].blue
    }

    const showErrorColorDefault = (value: number) => {
        if (showError === true
            && (isInBox(value) || isInCol(value) || isInRow(value))) {
            return Colors[theme!!].error
        }
        return props.isBasedNumber ? Colors[theme!!].textLight : Colors[theme!!].text
    }

    const selectedNumberColorWithError = () => {
        if (valueSelected == props.value) {
            if (showError === true) {
                return showErrorColorSelected()
            }
            return Colors[theme!!].blue
        }
        return showErrorColorDefault(props.value)
    }
    const numberAnimation = useAnimatedStyle(() => ({
        transform: [{ scale: withSequence(withTiming(1.2, { duration: 100 }), withTiming(0.8, { duration: 100 }), withTiming(1, { duration: 100 })) }]
    }), [valueSelected])

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
                backgroundColor: backgroundColor()
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
                            color: selectedNumberColorWithError()
                        }
                    ]}>{props.value}</Text>
                : renderHint(row, col)}
        </DoubleTapView>
    )
}

export default memo(Item)