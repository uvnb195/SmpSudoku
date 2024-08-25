import { Colors } from '@/constants/Colors'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@/constants/WindowDimession'
import React, { useEffect } from 'react'
import { useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { } from 'react-native-heroicons/solid'
import { useDispatch, useSelector } from 'react-redux'
import CustomFooter from '../components/CustomFooter'
import CustomHeader from '../components/CustomHeader'
import GridItem from '../components/GridItem'
import { useLoading } from '../context/ContextProvider'
import { RootState } from '../global_state'
import { loadBased, loadHints, loadSolved } from '../global_state/FileSystem'
import { createBased, createHints, createSolved } from '../global_state/puzzleSlice'

const Home = () => {
    const theme = useColorScheme()
    // resetFile();

    const boudedSize = Math.min(Math.round(WINDOW_WIDTH),
        Math.round(WINDOW_HEIGHT * 0.6))

    const gridItemSize = Math.floor(boudedSize / 3)
    const numberSize = Math.floor(gridItemSize / 3)


    const dispatch = useDispatch()

    const { mode, solved, based, hints } = useSelector((state: RootState) => state.puzzle)
    const { setLoading } = useLoading()

    useEffect(() => {
        setLoading(true)

        // get based,solved and hints if exist, otherwise create new base
        const getData = async () => {
            const basedResponse = await loadBased(mode)
            const solvedResponse = await loadSolved()
            const hintsResponse = await loadHints()

            console.log('get based:', basedResponse.msg, basedResponse.data)

            if (basedResponse.success && basedResponse.data) {
                dispatch(createBased(basedResponse.data))
            }

            if (solvedResponse.success
                && solvedResponse.data.length > 0)
                dispatch(createSolved(solvedResponse.data))

            if (hintsResponse.success
                && hintsResponse.data.length > 0)
                dispatch(createHints(hintsResponse.data))
        }

        getData()

        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [mode])

    return (
        <SafeAreaView className='items-center flex-1 flex-col'
            style={{
                backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background
            }}>

            {/* Logo */}
            <CustomHeader theme={theme!!} />

            {/* body */}
            <GridItem
                size={boudedSize}
                numberSize={numberSize} />

            {/* footer */}
            <View className='flex-auto w-full justify-evenly items-center flex-row' >
                <CustomFooter />
            </View>

        </SafeAreaView>
    )
}

export default Home