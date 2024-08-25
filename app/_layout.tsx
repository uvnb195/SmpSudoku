import { Stack } from 'expo-router'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import ContextProvider from './context/ContextProvider'
import { store } from './global_state'

const RootLayout = () => {

  return (
    <ContextProvider>
      <Provider store={store} >
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </Provider>
    </ContextProvider>
  )
}

export default RootLayout