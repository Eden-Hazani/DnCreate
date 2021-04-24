import React, { Component } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import NumberScroll from '../../components/NumberScroll';
import { Colors } from '../../config/colors';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CustomRaceBonusACState {
    acAmount: number
    activatedInterface: boolean
    confirmed: boolean
}
export class CustomRaceBonusAC extends Component<{ navigation: any }, CustomRaceBonusACState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            acAmount: 0,
            activatedInterface: false
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }
    onFocus = () => {
        const acAmount = store.getState().customRace.addedACPoints;
        if (this.state.confirmed) {
            this.setState({ confirmed: false })
        }
        if (acAmount && acAmount > 0) {
            this.setState({ acAmount, activatedInterface: true })
        }
    }

    confirmAndContinue = () => {
        this.setState({ confirmed: true })
        const storeItem = { ...store.getState().customRace };
        storeItem.addedACPoints = this.state.acAmount

        store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceBackImage");
        }, 800);
    }

    render() {
        const storeItem = store.getState().customRace.addedACPoints || 0;
        return (
            <View style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View style={{
                        paddingTop: 50,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <AppText fontSize={18} padding={5} textAlign={'center'}>Does your race offer a bonus in AC points?</AppText>
                        <Switch value={this.state.activatedInterface} onValueChange={() => {
                            if (this.state.activatedInterface) {
                                this.setState({ activatedInterface: false })
                                return;
                            }
                            this.setState({ activatedInterface: true })
                        }} />
                        {this.state.activatedInterface &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText fontSize={18} padding={5} textAlign={'center'}>How many bonus AC points?</AppText>
                                <View style={{ borderColor: Colors.whiteInDarkMode, width: 170, height: 70, borderWidth: 1, borderRadius: 15, }}>
                                    <NumberScroll modelColor={Colors.pageBackground}
                                        startingVal={storeItem}
                                        max={10} getValue={(bonusAmount: number) => {
                                            this.setState({ acAmount: bonusAmount })
                                        }} />
                                </View>
                            </View>
                        }
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Continue'} onPress={() => { this.confirmAndContinue() }} />
                    </View>
                }
            </View>
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