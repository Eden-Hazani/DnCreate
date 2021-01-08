import React from 'react'
import { View } from "react-native";
import * as FacebookAds from 'expo-ads-facebook';
import { AdMobBanner } from 'expo-ads-admob'
import logger from '../../utility/logger';

function MainAds({ faceBookBannerId, adMobBannerId }: any) {
    const random = Math.random()
    return (
        <View>
            <AdMobBanner
                style={{ alignItems: "center", }}
                bannerSize="banner"
                adUnitID={adMobBannerId}
                servePersonalizedAds={false} />

            {/* <FacebookAds.BannerAd
                    placementId={faceBookBannerId}
                    type="standard"
                    onError={(error: any) => { logger.log(new Error(JSON.stringify(error.nativeEvent))) }}
                /> */}


        </View>
    );
}

export default React.memo(MainAds);