/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#BF94E4";
const tintColorDark = "#9B6FA3";

export const Colors = {
    light: {
        text: "#2D3436",
        background: "#FFFFFF",
        tint: tintColorLight,
        icon: "#8E7399",
        tabIconDefault: "#D4C4E3",
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: "#DFE6E9",
        background: "#2D3436",
        tint: tintColorDark,
        icon: "#C8B1E4",
        tabIconDefault: "#B8A0D9",
        tabIconSelected: tintColorDark,
    },
};
