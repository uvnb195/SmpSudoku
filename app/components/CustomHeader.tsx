import { Colors } from '@/constants/Colors'
import { getModeName, SudokuMode } from '@/constants/SudokuMode'
import { WINDOW_HEIGHT } from '@/constants/WindowDimession'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/outline'
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { useLoading } from '../context/ContextProvider'
import { RootState } from '../global_state'
import { resetFile } from '../global_state/FileSystem'
import { changeMode } from '../global_state/puzzleSlice'
import CustomDropDownButton from './CustomDropdownButton'
import CustomTextMode from './CustomTextMode'

interface Props {
    theme: 'light' | 'dark'
}

const CustomHeader = ({ theme }: Props) => {
    const dispatch = useDispatch()
    const { mode } = useSelector((state: RootState) => state.puzzle)
    const { loading, setLoading, pause } = useLoading()

    const translateY = useDerivedValue(() =>
        withTiming(loading || pause ?
            Math.floor(WINDOW_HEIGHT / 2 - 100)
            : 0, { duration: 600 }),
        [loading, pause])
    const scale = useDerivedValue(() =>
        withSpring(loading || pause ? 1.5 : 1, { duration: 600 }), [loading, pause])

    const animationStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value }
        ],
    }))

    const handlePressBackgroundExpandedMenu = () => {
        setShowMode(false)
    }
    const [showMode, setShowMode] = useState(false)
    const selectedRef = useRef<SudokuMode>(mode)

    const showModeMenu = useDerivedValue(() => withTiming(showMode ? 1 : 0, { duration: 200 }), [showMode])

    const showModeAnimation = useAnimatedStyle(() => ({
        transform: [{ scaleY: showModeMenu.value }]
    }))


    const handleShowMode = async (v: boolean, selectedMode?: SudokuMode) => {
        setShowMode(v)
        if (selectedMode != undefined) {
            selectedRef.current = selectedMode
        }
    }

    const clearFile = async () => {
        await resetFile()
        dispatch(changeMode(selectedRef.current))
    }

    useEffect(() => {
        if (mode != selectedRef.current) {
            setLoading(true)
            clearFile()
        }
    }, [selectedRef.current])

    return (
        <>
            {/* background pause */}
            {loading ?
                <View
                    className='top-0 bottom-0 left-0 right-0 absolute z-10 opacity-90'
                    style={{
                        backgroundColor: Colors[theme].background
                    }} />
                : pause && <View
                    className='top-0 bottom-0 left-0 right-0 absolute z-10 opacity-90'
                    style={{
                        backgroundColor: Colors[theme].background
                    }} />
            }


            {/* background expanded menu */}
            {showMode &&
                <View
                    className='top-0 bottom-0 left-0 right-0 absolute z-20 opacity-90'
                    style={{
                        backgroundColor: Colors[theme].background
                    }}>
                    <Pressable className='w-full h-full'
                        onPress={handlePressBackgroundExpandedMenu} />
                </View>}
            <Animated.View className='items-center justify-center w-full h-[20vh] z-30 flex-col'
                style={[
                    { borderColor: Colors[theme!!].text },
                    animationStyle
                ]}>
                <Animated.Text className='text-4xl font-extrabold w-full max-w-[80vh] overflow-hidden text-center m-4'
                    style={[
                        {
                            color: theme == 'dark' ? Colors.dark.text : Colors.light.text
                        }
                    ]} ellipsizeMode='clip' numberOfLines={1}>
                    SmpSudoku
                </Animated.Text>

                {/* select mode */}
                <Pressable className='w-[200px] flex-row items-center justify-between px-10'
                    style={{
                        position: 'absolute',
                        bottom: 16
                    }}
                    disabled={loading}
                    onPress={() => handleShowMode(true)}>

                    {/* selected text */}
                    <CustomTextMode isSelected={false}>
                        {getModeName(selectedRef.current)}
                    </CustomTextMode>

                    {/* expanded menu */}
                    {showMode &&
                        <Animated.View className='absolute px-2 border rounded-lg w-[90px]'
                            style={[
                                {
                                    top: mode * (-30),
                                    left: 32,
                                    backgroundColor: Colors[theme].background,
                                    borderColor: Colors[theme].textLight
                                },
                                showModeAnimation
                            ]}>
                            <Pressable
                                onPress={() => {
                                    handleShowMode(false, SudokuMode.easy)
                                }}>
                                <CustomTextMode
                                    isSelected={selectedRef.current == 0}
                                >{getModeName(0)}</CustomTextMode>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    handleShowMode(false, SudokuMode.normal)
                                }}>
                                <CustomTextMode
                                    isSelected={selectedRef.current == 1}
                                >{getModeName(1)}</CustomTextMode>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    handleShowMode(false, SudokuMode.hard)
                                }}>
                                <CustomTextMode
                                    isSelected={selectedRef.current == 2}
                                >{getModeName(2)}</CustomTextMode>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    handleShowMode(false, SudokuMode.expert)
                                }}>
                                <CustomTextMode
                                    isSelected={selectedRef.current == 3}
                                >{getModeName(3)}</CustomTextMode>
                            </Pressable>
                        </Animated.View>}

                    <CustomDropDownButton
                        disable={loading}
                        style={{
                            width: 40,
                            height: 40
                        }}
                        iconEnd={() => <XMarkIcon size={24}
                            color={Colors[theme!!].text} />}
                        iconStart={() => <ChevronDownIcon size={24}
                            color={Colors[theme!!].text} />}

                        handlePress={(v) => handleShowMode(v)}
                        status={showMode} />

                </Pressable>
            </Animated.View>
        </>

    )
}

export default CustomHeader