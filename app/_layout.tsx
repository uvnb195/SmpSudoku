import { router, Slot, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import ContextProvider from './context/ContextProvider'
import { store } from './global_state'
import { isFirstTime } from './global_state/AsyncStorage'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

const RootLayout = () => {
  const theme = useColorScheme()

  useEffect(() => {
    // check first time open app
    const isFirst = isFirstTime()
    isFirst.then(v => {
      if (v == true) {
        router.replace('/welcome')
      }
    })
  }, [])

  return (

    <>
      <ContextProvider>
        <Provider store={store} >
          <GestureHandlerRootView>
            <Slot />
          </GestureHandlerRootView>
        </Provider>
      </ContextProvider>

      <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
    </>

  )
}

export default RootLayout