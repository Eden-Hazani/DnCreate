import AsyncStorage from "@react-native-community/async-storage";

export class Colors {
    public static primary: string;
    public static primaryBackground: string;
    public static white: string;
    public static text: string;
    public static bitterSweetRed: string;
    public static borderLight: string;
    public static lightGray: string;
    public static danger: string;
    public static black: string;
    public static softBlack: string;
    public static totalWhite: string;
    public static yellow: string;
    public static orange: string;
    public static shadowBlue: string;
    public static strongOrange: string;
    public static berries: string;
    public static paleGreen: string;
    public static metallicBlue: string;
    public static pinkishSilver: string;
    public static pageBackground: string;
    public static elementForeground: string;
    public static inactiveTint: string;
    public static whiteInDarkMode: string;
    public static async InitializeAsync() {
        await AsyncStorage.getItem('colorScheme').then(scheme => {
            if (scheme === "firstUse") {
                Colors.primary = '#F2A65A'
                Colors.primaryBackground = '#F58549'
                Colors.white = '#FCFFF7'
                Colors.text = '#DF9B6D'
                Colors.bitterSweetRed = '#F76C5E'
                Colors.borderLight = '#AB9F9D'
                Colors.danger = '#ff5252'
                Colors.lightGray = '#DDDDDD'
                Colors.black = "#000000"
                Colors.totalWhite = "#FFFFFF"
                Colors.yellow = "#F8F4A6"
                Colors.orange = "#BB6B00"
                Colors.shadowBlue = "#7284A8"
                Colors.berries = "#8C5383"
                Colors.paleGreen = "#9EBD6E"
                Colors.metallicBlue = "#028090"
                Colors.pinkishSilver = "#FFD29D"
                Colors.pageBackground = "#FFFFFF"
                Colors.elementForeground = "#FFFFFF"
                Colors.inactiveTint = "#000000"
                Colors.whiteInDarkMode = "#000000"
            }
            if (scheme === "light") {
                Colors.primary = '#F2A65A'
                Colors.primaryBackground = '#F58549'
                Colors.white = '#FCFFF7'
                Colors.text = '#DF9B6D'
                Colors.bitterSweetRed = '#F76C5E'
                Colors.borderLight = '#AB9F9D'
                Colors.danger = '#ff5252'
                Colors.lightGray = '#DDDDDD'
                Colors.black = "#000000"
                Colors.totalWhite = "#FFFFFF"
                Colors.yellow = "#F8F4A6"
                Colors.orange = "#BB6B00"
                Colors.shadowBlue = "#7284A8"
                Colors.berries = "#8C5383"
                Colors.paleGreen = "#9EBD6E"
                Colors.metallicBlue = "#028090"
                Colors.pinkishSilver = "#FFD29D"
                Colors.pageBackground = "#FFFFFF"
                Colors.elementForeground = "#FFFFFF"
                Colors.inactiveTint = "#000000"
                Colors.whiteInDarkMode = "#000000"
            }
            if (scheme === "dark") {
                Colors.primary = '#F2A65A'
                Colors.primaryBackground = '#F58549'
                Colors.white = '#FCFFF7'
                Colors.text = '#DF9B6D'
                Colors.bitterSweetRed = '#bb86fc'
                Colors.borderLight = '#AB9F9D'
                Colors.danger = '#ff5252'
                Colors.lightGray = '#81778d'
                Colors.black = "#000000"
                Colors.totalWhite = "#FFFFFF"
                Colors.yellow = "#F8F4A6"
                Colors.orange = "#BB6B00"
                Colors.shadowBlue = "#7284A8"
                Colors.berries = "#8C5383"
                Colors.paleGreen = "#9EBD6E"
                Colors.metallicBlue = "#028090"
                Colors.pinkishSilver = "#d8b9ff"
                Colors.pageBackground = "#121212"
                Colors.elementForeground = "#1d1d1d"
                Colors.inactiveTint = "#FFFFFF"
                Colors.whiteInDarkMode = "#FFFFFF"
            }
        })
    }
}

Colors.InitializeAsync();
