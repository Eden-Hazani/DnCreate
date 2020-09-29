export class Config {
    // http://192.168.1.18:9000
    //adsAndroidBanner - ca-app-pub-5186238714913357/2206638629
    //adsIosBanner - ca-app-pub-5186238714913357/5212075912

    //adsAndroidSheet - ca-app-pub-5186238714913357/8155795848
    //adsIosSheet - ca-app-pub-5186238714913357/2028359436
    public static serverUrl: string;
    public static adAndroidInterstitial: string;
    public static adIosInterstitial: string;
    public static _initialize() {
        if (__DEV__) {
            Config.serverUrl = "http://192.168.1.18:9000";
            Config.adAndroidInterstitial = "ca-app-pub-3940256099942544/1033173712"
            Config.adIosInterstitial = "ca-app-pub-3940256099942544/4411468910"
        } else {
            Config.adAndroidInterstitial = "ca-app-pub-5186238714913357/8155795848"
            Config.adIosInterstitial = "ca-app-pub-5186238714913357/2028359436"
            Config.serverUrl = "https://dncreate.azurewebsites.net";
        }

    }
}

Config._initialize();