import { Colors } from '@/constants/Colors'
import React from 'react'
import { Pressable, Text, useColorScheme, View } from 'react-native'
import { ArrowUturnLeftIcon, PauseIcon, PlayIcon, TrophyIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import { decrementHintRemainingInFile, guessNumber, isPuzzleFinished, undoInFile } from '../global_state/FileSystem'
import { addNumber, decrementHintRemaining, undo, updatePosition } from '../global_state/puzzleSlice'
import CustomTranformButton from './CustomTranformButton'
import HintButton from './HintButton'

const CustomFooter = () => {
    const theme = useColorScheme()
    const dispatch = useDispatch()

    const {
        hintRemaining,
        solved,
        rootPuzzle
    } = useSelector((state: RootState) => state.puzzle)

    const handleShowAHint = async () => {
        if (hintRemaining == 0) return

        const status = isPuzzleFinished(solved)
        if (!status.finished) {
            const { row, col } = status
            const hintValue = rootPuzzle[row!!][col!!]
            dispatch(updatePosition({
                position: {
                    x: 0,
                    y: 0,
                    row: row!!,
                    col: col!!
                }
            }))
            dispatch(addNumber(hintValue))
            dispatch(decrementHintRemaining())
            const guessNumberRes = await guessNumber(
                hintValue,
                { row: row!!, col: col!! },
                false)
            const updateHintRemainingRes = await
                decrementHintRemainingInFile()
        }
    }

    const handleUndo = async () => {
        dispatch(undo())

        await undoInFile()
    }

    return (
        <View className='flex-1 w-full h-full flex-col'>
            {/* top */}
            <View className=' items-center justify-between flex-row min-h-[50px] pr-4'>
                {/* count down */}
                <View className='h-full flex-row items-center justify-center min-w-[70px] max-w-[100px]'>
                    <View className='w-2 h-2 rounded-full mx-2'
                        style={{
                            backgroundColor: Colors[theme!!].blue
                        }} />
                    <Text className='min-w-[70px] max-w-[100px] px-1'
                        style={{
                            color: Colors[theme!!].text
                        }}
                        numberOfLines={1}>00 :  00 : 00</Text>
                </View>

                {/* hint button */}
                <HintButton
                    hintRemaining={hintRemaining}
                    theme={theme || 'light'}
                    handlePress={handleShowAHint} />
                {/* <CustomTransformSwitch
                    style={{
                        marginHorizontal: 8,
                        marginVertical: 8
                    }}
                    backgroundColor={Colors.dark.itemSelected}
                    iconStart={() => <ShieldExclamationIcon
                        size={20}
                        color={Colors[theme!!].text}
                    />}
                    iconEnd={() =>
                        <ShieldCheckIcon
                            size={20}
                            color={Colors[theme!!].background} />}
                >
                </CustomTransformSwitch> */}

            </View>

            {/* middle */}
            <View className='w-full h-[100px] items-center justify-center' >
                <CustomTranformButton
                    iconEnd={() => <PlayIcon size={40}
                        color={Colors[theme!!].blue}
                        style={{ marginLeft: 5 }} />}
                    iconStart={() => <PauseIcon size={40}
                        color={Colors[theme!!].blue} />}
                />

                {/* undo button */}
                <View className='absolute top-0 left-12 bottom-0 justify-center items-center w-[50px]'>
                    <Pressable className='rounded-full w-[48px] h-[48px] items-center justify-center'
                        style={{
                            backgroundColor: Colors[theme!!].button
                        }}
                        onPress={handleUndo}>
                        <ArrowUturnLeftIcon color={Colors[theme!!].text} size={28} />
                    </Pressable>
                </View>

                {/* record button */}
                <View className='absolute top-0 right-12 bottom-0 justify-center items-center w-[50px]'>
                    <Pressable className='rounded-full w-[48px] h-[48px] items-center justify-center'
                        style={{
                            backgroundColor: Colors[theme!!].button
                        }}>
                        <TrophyIcon
                            color={Colors[theme!!].text} size={28} />
                    </Pressable>
                </View>

            </View>

            {/* bottom */}
            <View className='px-2 w-full absolute bottom-0 justify-end'>
                <Text style={{
                    color: Colors[theme!!].textLight
                }}>v1.0.0</Text></View>
        </View>
    )
}

export default CustomFooter