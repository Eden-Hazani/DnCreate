import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Config } from '../../../config';
import adventureApi from '../../api/adventureApi';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemDelete } from '../../components/ListItemDelete';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import colors from '../../config/colors';
import { AdventureModel } from '../../models/AdventureModel';
import errorHandler from '../../../utility/errorHander';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';

interface SelectedLeadingAdvState {
    adventure: AdventureModel
}

export class SelectedLeadingAdv extends Component<{ navigation: any, route: any }, SelectedLeadingAdvState> {
    constructor(props: any) {
        super(props)
        this.state = {
            adventure: this.props.route.params.adventure,
        }
    }
    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
        })
    }
    back = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        this.props.navigation.navigate("Adventures")
    }

    removeFromAdventure = (item: any) => {
        const adventure = { ...this.state.adventure };
        const participants_id = adventure.participants_id.filter((participant: any) => participant._id !== item._id)
        adventure.participants_id = participants_id;
        this.setState({ adventure }, () => {
            store.dispatch({ type: ActionType.UpdateSingleAdventure, payload: this.state.adventure })
            adventureApi.leaveAdventure(this.state.adventure)
        })
    }

    characterWindow = (character: any) => {
        this.props.navigation.navigate("SelectCharacter", { character: character, isDm: true })
    }

    deleteAdventure = async () => {
        const response = await adventureApi.deleteAdventure(this.state.adventure.adventureIdentifier, this.state.adventure.leader_id);
        if (!response.ok) {
            errorHandler(response.status);
            return;
        }
        store.dispatch({ type: ActionType.DeleteAdventure, payload: this.state.adventure._id });
        this.back();
    }

    render() {
        const adventure = this.state.adventure;
        return (
            <View style={styles.container}>
                <View style={{ paddingBottom: 15 }}>
                    <AppText fontSize={25} textAlign={'center'}>{adventure.adventureName}</AppText>
                    <AppText>Setting: {adventure.adventureSetting}</AppText>
                </View>
                <AppText color={colors.bitterSweetRed} fontSize={20}>Participants</AppText>
                {adventure.participants_id.length === 0 ?
                    <View style={styles.main}>
                        <AppText textAlign={'center'} fontSize={15}>No one is currently participating in this adventure.</AppText>
                        <AppText textAlign={'center'} fontSize={15}>Share the adventure identifier with your friends to let them join.</AppText>
                    </View>
                    :
                    <View style={{ flex: .8 }}>
                        <FlatList
                            data={adventure.participants_id}
                            keyExtractor={(currentParticipants, index) => index.toString()}
                            renderItem={({ item }) => <ListItem
                                title={item.name}
                                subTitle={item.characterClass}
                                imageUrl={`${Config.serverUrl}/assets/${item.image}`}
                                direction={'row'}
                                headerFontSize={18}
                                headColor={colors.bitterSweetRed}
                                subFontSize={15}
                                padding={20} width={60} height={60}
                                headTextAlign={"left"}
                                subTextAlign={"left"}
                                justifyContent={"flex-start"} textDistanceFromImg={10}
                                renderRightActions={() =>
                                    <ListItemDelete onPress={() => { this.removeFromAdventure(item) }} />}
                                onPress={() => this.characterWindow(item)} />}
                            ItemSeparatorComponent={ListItemSeparator} />
                    </View>
                }
                <View style={{ flex: .5, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
                    <AppText fontSize={18}>Adventure identifier:</AppText>
                    <AppText fontSize={20} color={colors.bitterSweetRed}>{adventure.adventureIdentifier}</AppText>
                </View>
                <View style={{ flex: .2, flexDirection: "row", justifyContent: "space-evenly" }}>
                    <AppButton backgroundColor={colors.bitterSweetRed} onPress={() => { this.back() }}
                        fontSize={18} borderRadius={25} width={120} height={65} title={"Back"} />
                    <AppButton backgroundColor={colors.bitterSweetRed} onPress={() => { this.deleteAdventure() }}
                        fontSize={18} borderRadius={25} width={120} height={65} title={"Delete Adventure"} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,

    },
    main: {
        flex: .2,
        justifyContent: "center",
        alignItems: "center"
    }
});