import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { LightBulbIcon } from 'react-native-heroicons/outline'
import { Colors } from '@/constants/Colors'

interface Props {
    theme: 'dark' | 'light'
    hintRemaining: number
    handlePress: () => void
}

const HintButton = ({ theme, hintRemaining, handlePress }: Props) => {
    return (
        <Pressable
            className='rounded-full p-2'
            style={{
                backgroundColor: Colors[theme].button
            }}
            onPress={handlePress}
        >
            <LightBulbIcon size={24}
                color={Colors[theme].text} />

            {/* remaining hint */}
            <View className='absolute bottom-[-5] right-[-5] w-5 h-5 rounded-full border items-center justify-center overflow-hidden'
                style={{
                    backgroundColor: Colors[theme].blue,
                    borderColor: 'white'
                }}>
                <Text className='text-white rounded-full leading-4 self-center'
                    style={{
                        fontSize: hintRemaining == 0 ? 10 : 16
                    }}>{hintRemaining > 0 ? hintRemaining : 'Ad'}</Text>
            </View>
        </Pressable>
    )
}

export default HintButton