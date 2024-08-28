/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    textLight: 'rgba(54, 69, 79,0.9)',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    surface: '#1e293b',
    blurBackground: 'rgba(0,0,0,0.7)',
    blue: 'rgb(79,70,229)',
    areaSelected: 'rgba(191,191,191,0.3)',
    itemSelected: 'rgba(96, 130, 182,0.2)',
    error: '#e34f4f',
    iconSelected: 'rgb(142,209,237)',
    button: 'rgb(202,233,243)'
  },
  dark: {
    text: '#ECEDEE',
    textLight: 'rgba(191,191,191,0.6)',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    surface: '#1e293b',
    blurBackground: 'rgba(0,0,0,0.7)',
    blue: 'rgba(96, 130, 182,1)',
    areaSelected: 'rgba(129, 133, 137,0.1)',
    itemSelected: 'rgba(96, 130, 182,0.2)',
    error: '#e34f4f',
    iconSelected: 'rgb(27,81,138)',
    button: 'rgba(96, 130, 182,0.2)'
  },
};
