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

interface CustomRaceFinishScreenState {
    racePublic: boolean
    finished: boolean
}
export class CustomRaceFinishScreen extends Component<{ navigation: any }, CustomRaceFinishScreenState>{
    constructor(props: any) {
        super(props)
        this.state = {
            finished: false,
            racePublic: false
        }
    }

    sendRaceToServer = () => {
        const customRace = { ...store.getState().customRace };
        const user: any = store.getState().user._id
        customRace.visibleToEveryone = this.state.racePublic;
        customRace.user_id = user
        const color = Math.floor(Math.random() * 16777215).toString(16);
        customRace.raceColors = `#${color}`
        console.log(customRace)
        racesApi.addRace(customRace).then(() => {
            this.setState({ finished: true })
        }).catch((err) => {
            alert('There seems to be a problem with our servers, please try again later.')
            return;
        })
    }

    finish = () => {
        this.props.navigation.navigate('CustomRaceStartScreen');
        store.dispatch({ type: ActionType.cleanCustomRace })
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.finished ?
                    <View>
                        <View>
                            <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay source={require('../../../assets/lottieAnimations/confeetiAnimation.json')} />
                        </View>
                        <AppText fontSize={30} padding={5} textAlign={'center'}>Done!</AppText>
                        <AppText fontSize={18} padding={5} textAlign={'center'}>Your new race will be available for you on the race screen!</AppText>
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Done'} onPress={() => { this.finish() }} />
                    </View>
                    :
                    <View>
                        <AppText fontSize={25} padding={5} textAlign={'center'}>Almost Done!</AppText>
                        <AppText fontSize={18} padding={15} textAlign={'center'}>Would you like to share your creation with everyone on DnCreate?</AppText>
                        <AppText fontSize={18} padding={10} textAlign={'center'}>If you wish for this race to become public and visible everyone toggle the option below</AppText>
                        <Switch value={this.state.racePublic} onValueChange={() => {
                            if (this.state.racePublic) {
                                this.setState({ racePublic: false })
                                return;
                            }
                            this.setState({ racePublic: true })
                        }} />
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Finish'} onPress={() => { this.sendRaceToServer() }} />
                    </View>
                }

            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        justifyContent: "center",
        alignItems: "center"
    }
});