export class Config {

    public static serverUrl: string;
    public static _initialize() {
        if (__DEV__) {
            Config.serverUrl = "http://192.168.1.18:9000";
        } else {
            Config.serverUrl = "https://skysurf.herokuapp.com";
        }

    }
}

Config._initialize();