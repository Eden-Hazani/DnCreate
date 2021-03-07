import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Unsubscribe } from 'redux';
import errorHandler from '../../../utility/errorHander';
import logger from '../../../utility/logger';
import adventureApi from '../../api/adventureApi';
import authApi from '../../api/authApi';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { AdventureModel } from '../../models/AdventureModel';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { io } from 'socket.io-client';
import { Config } from '../../../config';
import AsyncStorage from '@react-native-community/async-storage';
import InformationScroller from '../../components/InformationScroller';
import adventureInfo from '../../../jsonDump/adventuresInformation.json'
const socket = io(Config.serverUrl);

interface AdventuresState {
    firstLookModal: boolean
}

export class Adventures extends Component<{ props: any, navigation: any }, AdventuresState>{
    navigationSubscription: any;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            firstLookModal: false
        }
    }

    checkForFirstLook = async () => {
        const firstUse = await AsyncStorage.getItem('isAdventureFirstUse')
        if (!firstUse) {
            this.setState({ firstLookModal: true })
        }
    }


    componentDidMount() {
        this.checkForFirstLook()
    }


    render() {
        return (
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={styles.container}>
                    <AppText fontSize={25} textAlign={'center'} color={Colors.berries}>Adventures</AppText>
                    <View style={{ flex: .5 }}>
                        <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                            <AppText textAlign={'center'} fontSize={16}>This is where you can enter your existing adventures.</AppText>
                            <AppText textAlign={'center'} fontSize={16}>Leading adventures are the ones you created.</AppText>
                            <AppText textAlign={'center'} fontSize={16}>Participating adventures are the ones you joined on.</AppText>
                        </View>
                        <View style={styles.buttons}>
                            <AppButton backgroundColor={Colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("ParticipatingAdventureList") }} fontSize={14}
                                borderRadius={25} width={125} height={100} title={"Participating Adventures"} />
                            <AppButton backgroundColor={Colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("LeadingAdventureList") }} fontSize={14} borderRadius={25}
                                width={125} height={100} title={"Leading Adventures"} />
                        </View>
                    </View>
                    <View style={{ flex: .5 }}>
                        <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                            <AppText textAlign={'center'} fontSize={16}>This is where you can create or join adventures.</AppText>
                        </View>
                        <View style={styles.buttons}>
                            <AppButton backgroundColor={Colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("StartAdventure") }} fontSize={14} borderRadius={25}
                                width={125} height={100} title={"Start Adventure"} />
                            <AppButton backgroundColor={Colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("JoinAdventure") }} fontSize={14} borderRadius={25}
                                width={125} height={100} title={"Join Adventure"} />
                        </View>
                    </View>
                </View>
                <Modal visible={this.state.firstLookModal}>
                    <InformationScroller list={adventureInfo.list} PressClose={async (val: boolean) => {
                        this.setState({ firstLookModal: val })
                        await AsyncStorage.setItem('isAdventureFirstUse', "false")
                    }} />
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    buttons: {
        flex: .7,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-evenly"
    },
});