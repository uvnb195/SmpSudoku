import AsyncStorage from "@react-native-async-storage/async-storage"

export const isFirstTime = async () => {
    // if this is first time user open this app, value is null

    const value = await AsyncStorage.getItem('isFirstTime')
    if (value == null) {
        await AsyncStorage.setItem('isFirstTime', 'notAnyMore')
        return true
    }
    return false
}