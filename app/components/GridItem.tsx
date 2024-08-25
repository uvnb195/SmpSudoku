import { Colors } from '@/constants/Colors'
import React, { useState } from 'react'
import { ColorSchemeName, useColorScheme, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import { updateNoteStatus } from '../global_state/FileSystem'
import CustomModal from './CustomModal'
import Item from './Item'

interface Props {
    size: number
    numberSize: number
}

const GridItem = ({ size, numberSize }: Props) => {
    const theme = useColorScheme()
    const dispatch = useDispatch()

    const animatedOpacity = useSharedValue(0)

    const selectorPosition = useSelector((state: RootState) => state.puzzle.position)
    const { solved: listSolved, mode, based } = useSelector((state: RootState) => state.puzzle)

    const updateNote = async (v: boolean) => {
        const response = await updateNoteStatus(based, v, mode)
    }

    const [visible, setVisible] = useState(false)

    // render items
    const renderGrid = (
        size: number,
        theme: ColorSchemeName,
        listSolved: number[][]
    ) => {
        const { based: listPuzzle } = useSelector((state: RootState) => state.puzzle)

        let items = []
        const borderColor = Colors[theme!!].text

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const number = listPuzzle[i][j] == 0
                    ? listSolved[i][j] : listPuzzle[i][j]

                const key = `${i}${j}`

                const hasBorderBottom = ((i + 1) % 3 == 0
                    && (i + 1) % 9 != 0)
                const hasBorderLeft = (j % 3 == 0
                    && j % 9 != 0)

                items.push(
                    <View key={key}
                        style={{
                            width: size,
                            height: size,
                            borderColor,
                            borderBottomWidth: hasBorderBottom ? 2 : 0,
                            borderLeftWidth: hasBorderLeft ? 2 : 0
                        }}
                        className={'items-center justify-center'}>
                        <Item
                            isBasedNumber={listPuzzle[i][j] != 0}
                            size={size}
                            value={number}
                            index={{ row: i, col: j }} handleDoubleTap={() => {
                                setVisible(true)
                            }} />
                    </View>
                )
            }
        }

        return items
    }

    return (
        <View style={{
            width: size,
            height: size
        }} className='flex-wrap justify-evenly items-center border flex-row'>

            {renderGrid(numberSize, theme, listSolved)}

            <CustomModal
                visible={visible}
                onDisableModal={v => {
                    setVisible(v)
                }}
                position={{
                    x: selectorPosition.x,
                    y: selectorPosition.y
                }}
                theme={theme!!}
                size={size}
                handleNoteStatus={updateNote} />
        </View>
    )
}

export default GridItem