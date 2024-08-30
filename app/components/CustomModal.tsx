import { Colors } from '@/constants/Colors'
import React, { useEffect } from 'react'
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import { PencilIcon } from 'react-native-heroicons/outline'
import { TrashIcon } from 'react-native-heroicons/solid'
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import { guessNumber } from '../global_state/FileSystem'
import { addNumber, deleteNumber, setEnableNote } from '../global_state/puzzleSlice'
import CustomSwitchButton from './CustomSwitchButton'

interface Props {
    style?: ViewStyle,
    size: number,
    position: { x: number, y: number },
    visible: boolean,
    theme: 'dark' | 'light',
    handleNoteStatus: (v: boolean) => void,
    onDisableModal: (v: boolean) => void,
}

const CustomModal = ({ visible, onDisableModal, style, size, position, handleNoteStatus, theme }: Props) => {

    const numberSize = 40
    const popupSize = 120
    const switchSize = { width: 48, height: 28 }
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

    const { x, y } = position

    const circleSize = 70

    const scale = useSharedValue(0)

    const scaleAnimation = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))

    const { note: noteStatus } = useSelector((state: RootState) => state.puzzle)

    const { row, col } = useSelector((state: RootState) => state.puzzle.position)

    const dispatch = useDispatch()

    useEffect(() => {
        if (visible)
            scale.value = withTiming(1, { duration: 200 })
        return () => {
            scale.value = 0
        }

    }, [visible])
    const fontSize = useDerivedValue(() => withTiming(noteStatus ? numberSize / 2 : numberSize - 8, { duration: 200 }), [noteStatus])

    const fontSizeAnimation = useAnimatedStyle(() => ({
        fontSize: fontSize.value
    }))

    const colorsAnimation = useAnimatedStyle(() => ({
        color: interpolateColor(
            fontSize.value,
            [numberSize - 8, numberSize / 2],
            [Colors[theme!!].text, Colors[theme!!].blue])
    }))

    const handleAddNumber = async (num: number) => {
        dispatch(addNumber(num))
        onDisableModal(false)
        const response = await guessNumber(
            num,
            { row, col },
            noteStatus)
    }

    const handlePressDelete = () => {
        dispatch(deleteNumber())
        onDisableModal(false)
    }

    const renderNumber = (index: number) => {
        return (
            <Pressable
                key={index}
                style={{
                    width: numberSize - 4,
                    height: numberSize - 4,
                    backgroundColor: (theme == 'dark' ? Colors.dark.background : Colors.light.background)
                }}
                className='items-center justify-center m-[1px] rounded-full indi'
                onPress={() => {
                    handleAddNumber(index)
                }}
            >
                <View className={'w-full h-full items-center justify-center'}>
                    <Animated.Text style={[
                        colorsAnimation,
                        fontSizeAnimation,
                        {
                            backgroundColor: 'transparent',
                            lineHeight: numberSize - 4
                        }]}
                    >{index}</Animated.Text>
                </View>
            </Pressable>

        )
    }

    const handleHideModal = async () => {
        onDisableModal(false)
    }


    return (
        <Modal visible={visible}
            transparent>
            <Pressable className='flex-1 items-center justify-center'
                style={{ backgroundColor: Colors.dark.blurBackground }}
                onPress={handleHideModal}>
                <View className='absolute top-0 left-0 right-0 bottom-0'>
                    <View className='absolute' style={{
                        top: position?.y,
                        left: position?.x
                    }} />
                    <Animated.View style={[{
                        width: popupSize,
                        height: popupSize,
                        left: (x < popupSize / 2 ? 0 : (x + popupSize / 2 >= SCREEN_WIDTH) ? SCREEN_WIDTH - popupSize : x - popupSize / 2),
                        top: (y < popupSize / 2 ? 0 : (y + popupSize / 2 > SCREEN_HEIGHT) ? SCREEN_HEIGHT - popupSize / 2 : y - popupSize / 2),
                    }, scaleAnimation]}
                        className='absolute'
                    >

                        <FlatList
                            className='w-full h-full'
                            data={Array(9).fill(0).map((_value, index) => index + 1)}
                            renderItem={({ item }) => renderNumber(item)}
                            keyExtractor={(item, index) =>
                                item + ""}
                            numColumns={3}
                            contentContainerStyle={{
                                gap: 2,
                                alignItems: 'center'
                            }}
                            columnWrapperStyle={{
                                gap: 2,
                                alignItems: 'center'
                            }}
                        />

                        <CustomSwitchButton
                            status={noteStatus}
                            handlePress={(v) => {
                                dispatch(setEnableNote(!noteStatus))
                                handleNoteStatus(v)
                            }}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: -switchSize.height - 10,
                            }}>

                            <PencilIcon size={16} color={Colors[theme].background} />
                        </CustomSwitchButton>

                        {/* delete button */}
                        <Pressable className='absolute items-center justify-center rounded-full w-8 h-8'
                            onPress={handlePressDelete}
                            style={{
                                backgroundColor: Colors[theme].background,
                                left: 0,
                                top: -switchSize.height - 10
                            }}>
                            <TrashIcon size={20} color={Colors[theme].text} />
                        </Pressable>
                    </Animated.View>
                </View>
            </Pressable>
        </Modal>
    )
}

export default CustomModal

const styles = StyleSheet.create