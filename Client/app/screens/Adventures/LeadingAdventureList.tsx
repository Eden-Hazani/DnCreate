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
import AuthContext from '../../auth/context';
import { AppText } from '../../components/AppText';
const socket = io(Config.serverUrl);

interface LeadingAdventureListListState {
    leadingAdventures: AdventureModel[]
    loading: boolean
    characters: CharacterModel[]
}

export class LeadingAdventureList extends Component<{ navigation: any }, LeadingAdventureListListState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            leadingAdventures: [],
            characters: store.getState().characters

        }

    }
    componentDidMount() {
        this.getLeadingAdv().then(() => {
            this.setState({ loading: false })
        })
    }

    getLeadingAdv = async () => {
        try {
            if (this.state.leadingAdventures.length === 0) {
                const leadingAdventures = await adventureApi.getLeadingAdventures(this.context.user._id);
                if (leadingAdventures.data !== undefined && leadingAdventures.ok) {
                    this.setState({ leadingAdventures: leadingAdventures.data }, () => {
                        store.dispatch({ type: ActionType.SetLeadingAdv, payload: this.state.leadingAdventures })
                    })
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    this.state.leadingAdventures.length === 0 ?
                        <View style={{ paddingTop: 200, alignItems: 'center', justifyContent: "center" }}>
                            <AppText textAlign={'center'} fontSize={22}>You are not leading in any adventures.</AppText>
                        </View>
                        :
                        <AdventureLists adventures={this.state.leadingAdventures} openAdventure={(adventure: AdventureModel) => {
                            this.props.navigation.navigate("SelectedLeadingAdv", { adventure: adventure })
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