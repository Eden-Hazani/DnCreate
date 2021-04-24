import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import logger from '../../utility/logger';
import racesApi from '../api/racesApi';
import AuthContext from '../auth/context';
import { AnimatedHorizontalList } from '../components/AnimatedHorizontalList';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { Colors } from '../config/colors';
import { RaceModel } from '../models/raceModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';

interface MyCreationsState {
    loading: boolean
    currentRaces: RaceModel[]
    raceColors: string[]
    startingScreen: boolean
}
export class MyCreations extends Component<{ navigation: any }, MyCreationsState>{
    navigationSubscription: any;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            startingScreen: true,
            loading: true,
            raceColors: [],
            currentRaces: []
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = () => {
        store.dispatch({ type: ActionType.cleanCustomRace })
        this.getRaces()
    }

    getRaces = async () => {
        try {
            let raceColors = [];
            const result: any = await racesApi.getUserMadeRaces(this.context.user._id);
            for (let item of result.data as any) {
                raceColors.push(item.raceColors)
            }
            this.setState({ currentRaces: result.data ? result.data : [], raceColors, loading: false })
        } catch (err) {
            logger.log(err)
        }
    }
    componentDidMount() {
        this.getRaces()
    }
    pickRace = (race: RaceModel) => {
        store.dispatch({ type: ActionType.UpdateCustomRace, payload: race })
        store.dispatch({ type: ActionType.CustomRaceEditing, payload: true })
        this.props.navigation.navigate("Creation", { screen: "BasicRaceInfo" })
    }
    render() {
        return (
            <View style={styles.container}>
                <Modal visible={this.state.startingScreen}>
                    <View style={{ flex: 1, backgroundColor: Colors.pageBackground, alignItems: "center" }}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/changeDragon.png`} style={{ width: 250, height: 250 }} />
                        <AppText textAlign={'center'} fontSize={30}>Welcome to the custom race editor</AppText>
                        <AppText textAlign={'center'} fontSize={22}>Here you can see all the custom race you created and fix any mistakes you made or imply any changes you want.</AppText>
                        <AppButton padding={20} backgroundColor={Colors.pinkishSilver} onPress={() => this.setState({ startingScreen: false })}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"O.K"} />
                    </View>
                </Modal>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    this.state.currentRaces.length === 0 ? <View style={{ paddingTop: 40 }}>
                        <AppText fontSize={25} textAlign={'center'}>You have not created any custom races, to do so please go to the creation tab.</AppText></View> :
                        <AnimatedHorizontalList
                            loadNextRaceBatch={() => { }}
                            data={this.state.currentRaces} backDropColors={this.state.raceColors}
                            onPress={(val: any) => { this.pickRace(val) }} />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});