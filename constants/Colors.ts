/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF6B6B";
const tintColorDark = "#4ECDC4";

export const Colors = {
    light: {
        text: "#2D3436",
        background: "#FFFFFF",
        tint: tintColorLight,
        icon: "#636E72",
        tabIconDefault: "#B2BEC3",
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: "#DFE6E9",
        background: "#2D3436",
        tint: tintColorDark,
        icon: "#81ECEC",
        tabIconDefault: "#74B9FF",
        tabIconSelected: tintColorDark,
    },
};
