import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import racesApi from '../../api/racesApi';
import AuthContext from '../../auth/context';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import LottieView from 'lottie-react-native';
import { AdMobRewarded } from 'expo-ads-admob'
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { Config } from '../../../config';
import { Image } from 'react-native-expo-image-cache';

interface CustomRaceFinishScreenState {
    racePublic: boolean
    finished: boolean
    requestingAdConfirm: boolean
    spamGuard: boolean
}
export class CustomRaceFinishScreen extends Component<{ navigation: any }, CustomRaceFinishScreenState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            requestingAdConfirm: false,
            finished: false,
            racePublic: false,
            spamGuard: false
        }
    }

    getRandomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    componentDidMount() {
        if (!this.context.user.premium && !store.getState().customRaceEditing) {
            AdMobRewarded.setAdUnitID(Config.adAndroidRewarded);
            AdMobRewarded.requestAdAsync()
        }
    }


    sendRaceToServerWithAds = () => {
        this.setState({ requestingAdConfirm: true })
        AdMobRewarded.getIsReadyAsync().then(async (isReady) => {
            if (isReady) {
                await AdMobRewarded.showAdAsync()
            }
            if (!isReady) {
                AdMobRewarded.requestAdAsync().then(async () => {
                    await AdMobRewarded.showAdAsync()
                })
            }
        })
        AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => {
            if (!this.state.spamGuard)
                this.setState({ requestingAdConfirm: false, spamGuard: true }, () => {
                    const customRace = { ...store.getState().customRace };
                    const user: any = store.getState().user._id
                    customRace.visibleToEveryone = this.state.racePublic;
                    customRace.user_id = user
                    const color = this.getRandomColor()
                    customRace.raceColors = color
                    racesApi.addRace(customRace).then(() => {
                        this.setState({ finished: true })
                    }).catch((err) => {
                        alert('There seems to be a problem with our servers, please try again later.')
                        return;
                    })
                })
        })
    }

    sendRaceToServerWithoutAds = () => {
        const customRace = { ...store.getState().customRace };
        const user: any = store.getState().user._id
        customRace.visibleToEveryone = this.state.racePublic;
        customRace.user_id = user
        const color = this.getRandomColor()
        customRace.raceColors = color
        racesApi.addRace(customRace).then(() => {
            this.setState({ finished: true })
        }).catch((err) => {
            alert('There seems to be a problem with our servers, please try again later.')
            return;
        })
    }

    editRace = () => {
        const customRace = { ...store.getState().customRace };
        customRace.visibleToEveryone = this.state.racePublic;
        racesApi.editRace(customRace).then(() => {
            store.dispatch({ type: ActionType.CustomRaceEditing, payload: false })
            this.props.navigation.navigate('CreationScreen')
        }).catch((err) => {
            alert('There seems to be a problem with our servers, please try again later.')
            return;
        })
    }

    finish = () => {
        this.props.navigation.navigate('CustomRaceStartScreen');
        store.dispatch({ type: ActionType.cleanCustomRace })
    }

    componentWillUnmount() {
        AdMobRewarded.removeAllListeners()
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {store.getState().customRaceEditing ?
                    <View style={{ alignItems: "center" }}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/changeDragon.png`} style={{ width: 250, height: 250 }} />
                        <AppText textAlign={'center'} fontSize={25}>Press Edit to publish your changes</AppText>
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Edit'} onPress={() => { this.editRace() }} />
                    </View>
                    :
                    <View>
                        {this.state.finished ?
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: .2, justifyContent: "center", alignItems: "center" }}>
                                    <LottieView style={{ zIndex: 1, width: "100%", height: 250 }} autoPlay source={require('../../../assets/lottieAnimations/confeetiAnimation.json')} />
                                </View>
                                <View style={{ flex: .8 }}>
                                    <AppText fontSize={30} padding={5} textAlign={'center'}>Done!</AppText>
                                    <AppText fontSize={18} padding={5} textAlign={'center'}>Your new race will be available for you on the race screen!</AppText>
                                    <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                        borderRadius={25} title={'Done'} onPress={() => { this.finish() }} />
                                </View>
                            </View>
                            :
                            <ScrollView>
                                <AppText fontSize={25} padding={5} textAlign={'center'}>Almost Done!</AppText>
                                <AppText fontSize={18} padding={15} textAlign={'center'}>Would you like to share your creation with everyone on DnCreate?</AppText>
                                <AppText fontSize={18} padding={10} textAlign={'center'}>If you wish for this race to become public and visible everyone toggle the option below</AppText>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Switch value={this.state.racePublic} onValueChange={() => {
                                        if (this.state.racePublic) {
                                            this.setState({ racePublic: false })
                                            return;
                                        }
                                        this.setState({ racePublic: true })
                                    }} />
                                </View>
                                {!this.context.user.premium ?
                                    <View style={{ paddingBottom: 70 }}>
                                        <AppText fontSize={18} padding={10} textAlign={'center'}>DnCreate uses server space to store your races,
                                as such you will be served an ad to complete the race creation setup and store your new race for free!</AppText>
                                        <AppText fontSize={18} padding={10} textAlign={'center'}>If you wish to disable ads on DnCreate consider donating on Patreon.</AppText>
                                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                            borderRadius={25} title={'Finish'} onPress={() => { this.sendRaceToServerWithAds() }} />
                                        {this.state.requestingAdConfirm &&
                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                <AppText fontSize={18} padding={10} textAlign={'center'}>Awaiting ad approval.</AppText>
                                                <View style={{ height: 70, width: 70 }}>
                                                    <AppActivityIndicator visible={this.state.requestingAdConfirm} />
                                                </View>
                                            </View>
                                        }
                                    </View>
                                    :
                                    <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                        borderRadius={25} title={'Finish'} onPress={() => { this.sendRaceToServerWithoutAds() }} />
                                }
                            </ScrollView>
                        }
                    </View>}

            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    }
});