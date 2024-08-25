import { Colors } from '@/constants/Colors'
import React from 'react'
import { Pressable, Text, useColorScheme, View } from 'react-native'
import { ArrowPathRoundedSquareIcon, PauseIcon, PlayIcon, ShieldCheckIcon, ShieldExclamationIcon, TrophyIcon } from 'react-native-heroicons/outline'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../global_state'
import CustomTranformButton from './CustomTranformButton'
import CustomTransformSwitch from './CustomTransformSwitchButton'

const CustomFooter = () => {
    const theme = useColorScheme()
    const dispatch = useDispatch()
    const { showError } = useSelector((state: RootState) => state.puzzle)


    return (
        <View className='flex-1 w-full h-full flex-col'>
            {/* top */}
            <View className=' items-center justify-between flex-row min-h-[50px]'>
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

                <CustomTransformSwitch
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
                </CustomTransformSwitch>

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

                <View className='absolute top-0 left-12 bottom-0 justify-center items-center w-[50px]'>
                    <Pressable className='rounded-full w-[48px] h-[48px] items-center justify-center'
                        style={{
                            backgroundColor: Colors[theme!!].itemSelected
                        }}>
                        <ArrowPathRoundedSquareIcon color={Colors[theme!!].text} size={28} />
                    </Pressable>
                </View>

                <View className='absolute top-0 right-12 bottom-0 justify-center items-center w-[50px]'>
                    <Pressable className='rounded-full w-[48px] h-[48px] items-center justify-center'
                        style={{
                            backgroundColor: Colors[theme!!].itemSelected
                        }}>
                        <TrophyIcon color={Colors[theme!!].text} size={28} />
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