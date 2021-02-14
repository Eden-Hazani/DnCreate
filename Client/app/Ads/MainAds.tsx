import React, { useState } from 'react'
import { View } from "react-native";
import * as FacebookAds from 'expo-ads-facebook';
import { AdMobBanner } from 'expo-ads-admob'
import logger from '../../utility/logger';

function MainAds({ faceBookBannerId, adMobBannerId }: any) {
    // FacebookAds.AdSettings.clearTestDevices();
    FacebookAds.AdSettings.setMediationService('admob');
    // const [showFaceBookAd, setFaceBookAd] = useState(false);
    return (<AdMobBanner
        style={{ alignItems: "center", }}
        bannerSize="banner"
        adUnitID={adMobBannerId}
        servePersonalizedAds={false} />

    );
}

export default React.memo(MainAds);