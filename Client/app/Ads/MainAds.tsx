import React, { useState } from 'react'
import { View } from "react-native";
import * as FacebookAds from 'expo-ads-facebook';
import { AdMobBanner } from 'expo-ads-admob'
import logger from '../../utility/logger';
import { UserModel } from '../models/userModel';

interface Props {
    faceBookBannerId: string;
    adMobBannerId: string;
    bannerCallTime: boolean;
    user: UserModel | null
}

function MainAds({ faceBookBannerId, adMobBannerId, bannerCallTime, user }: Props) {
    FacebookAds.AdSettings.setMediationService('admob');

    return (
        <>
            {bannerCallTime &&
                <View>{user && user._id && user.premium ? <View></View> :
                    <AdMobBanner
                        style={{ alignItems: "center", }}
                        bannerSize="banner"
                        adUnitID={adMobBannerId}
                        servePersonalizedAds={false} />}
                </View>}
        </>
    );
}

export default React.memo(MainAds);