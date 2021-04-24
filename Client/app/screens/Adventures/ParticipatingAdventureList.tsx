import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AdventureModel } from '../../models/AdventureModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { io } from 'socket.io-client';
import { Config } from '../../../config';
import { CharacterModel } from '../../models/characterModel';
import adventureApi from '../../api/adventureApi';
import errorHandler from '../../../utility/errorHander';
import logger from '../../../utility/logger';
import AdventureLists from '../../components/AdventureLists';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppText } from '../../components/AppText';
const socket = io(Config.serverUrl);

interface ParticipatingAdventureListState {
    participatingAdventures: AdventureModel[]
    loading: boolean
    characters: CharacterModel[]
}

export class ParticipatingAdventureList extends Component<{ navigation: any }, ParticipatingAdventureListState>{
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            participatingAdventures: [],
            characters: store.getState().characters

        }

    }
    componentDidMount() {
        this.getParticipatingAdv().then(() => {
            this.setState({ loading: false })
        })
        socket.on(`adventure-removedChange`, (adventureIdentifier: string) => {
            this.refreshParticipating(adventureIdentifier || '')
        });
    }

    getParticipatingAdv = async () => {
        try {
            if (this.state.participatingAdventures.length === 0) {
                let charIds = [];
                for (let character of this.state.characters) {
                    if (character._id !== undefined) {
                        charIds.push(character._id)
                    }
                }
                const adventures = await adventureApi.getParticipationAdventures(charIds);
                let participatingAdventures: any = []
                if (!adventures.ok) {
                    logger.log(adventures)
                    return;
                }
                if (adventures.data.length === 0) {
                    this.setState({ participatingAdventures })
                    return;
                }
                if (adventures.data[0] === undefined) {
                    return;
                }
                for (let adventure of adventures.data) {
                    participatingAdventures.push(adventure[0])
                }
                this.setState({ participatingAdventures }, () => {
                    store.dispatch({ type: ActionType.ClearParticipatingAdv, payload: this.state.participatingAdventures })
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    refreshParticipating = (adventureIdentifier: string) => {
        const participatingAdventures = this.state.participatingAdventures;
        let index = 0;
        for (let adventure of this.state.participatingAdventures) {
            if (adventureIdentifier === adventure.adventureIdentifier) {
                this.setState({ loading: true }, async () => {
                    participatingAdventures.splice(index, 1)
                    this.setState({ participatingAdventures, loading: false }, () => {
                        store.dispatch({ type: ActionType.ClearParticipatingAdv, payload: participatingAdventures })
                    })
                })
            }
            index++
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    this.state.participatingAdventures.length === 0 ?
                        <View style={{ paddingTop: 200, alignItems: 'center', justifyContent: "center" }}>
                            <AppText textAlign={'center'} fontSize={22}>You are not participating in any adventures.</AppText>
                        </View>
                        :
                        <AdventureLists adventures={store.getState().participatingAdv} openAdventure={(adventure: AdventureModel) => {
                            this.props.navigation.navigate("SelectedParticipationAdv", { adventure: adventure })
                        }} />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});