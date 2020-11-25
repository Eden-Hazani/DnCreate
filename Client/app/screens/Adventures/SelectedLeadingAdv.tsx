import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Config } from '../../../config';
import adventureApi from '../../api/adventureApi';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemDelete } from '../../components/ListItemDelete';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { AdventureModel } from '../../models/AdventureModel';
import errorHandler from '../../../utility/errorHander';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';

interface SelectedLeadingAdvState {
    adventure: AdventureModel
    loading: boolean
    refreshing: boolean
    profilePicList: any[]
}

export class SelectedLeadingAdv extends Component<{ navigation: any, route: any }, SelectedLeadingAdvState> {
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            profilePicList: [],
            adventure: this.props.route.params.adventure,
            loading: true,
            refreshing: false,
        }
    }
    async componentDidMount() {
        let userArray: string[] = []
        for (let item of this.state.adventure.participants_id) {
            userArray.push(item.user_id)
        }
        const userPicList: any = await adventureApi.getUserProfileImages(userArray)
        const picList = userArray.map((item, index) => [item, userPicList.data.list[index]])
        this.setState({ profilePicList: picList }, () => {
            this.setState({ loading: false })
        })
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

    characterWindow = async (character: any) => {
        this.setState({ loading: true })
        const char = await userCharApi.getChar(character._id);
        if (!char.ok) {
            errorHandler(char)
            this.setState({ loading: false })
            return;
        }
        this.setState({ loading: false }, () => {
            this.props.navigation.navigate("SelectCharacter", { character: char.data, isDm: true })
        })
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

    reloadAdventure = async (adventureIdentifier: string) => {
        this.setState({ loading: true })
        await adventureApi.getSingleLeadingAdventure(this.context.user._id, adventureIdentifier).then(confirmedAdventure => {
            if (!confirmedAdventure.ok) {
                alert(confirmedAdventure.data);
                return;
            }
            this.setState({ adventure: confirmedAdventure.data[0] }, async () => {
                let userArray: string[] = []
                for (let item of this.state.adventure.participants_id) {
                    userArray.push(item.user_id)
                }
                const userPicList: any = await adventureApi.getUserProfileImages(userArray)
                const picList = userArray.map((item, index) => [item, userPicList.data.list[index]])
                console.log(picList)
                console.log(this.state.adventure.participants_id.length)
                this.setState({ profilePicList: picList, loading: false })
            })
        })
    }

    render() {
        const adventure = this.state.adventure;
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingBottom: 15 }}>
                            <AppText fontSize={25} textAlign={'center'}>{adventure.adventureName}</AppText>
                            <AppText>Setting: {adventure.adventureSetting}</AppText>
                        </View>
                        <AppText color={Colors.bitterSweetRed} fontSize={20}>Participants</AppText>
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
                                    renderItem={({ item, index }) => <ListItem
                                        title={item.name}
                                        subTitle={item.characterClass}
                                        imageUrl={this.state.profilePicList[index][1] ? `${Config.serverUrl}/uploads/profile-imgs/${this.state.profilePicList[index][1]}` : `${Config.serverUrl}/assets/${item.image}`}
                                        direction={'row'}
                                        headerFontSize={18}
                                        headColor={Colors.bitterSweetRed}
                                        subFontSize={15}
                                        padding={20} width={60} height={60}
                                        headTextAlign={"left"}
                                        subTextAlign={"left"}
                                        justifyContent={"flex-start"} textDistanceFromImg={10}
                                        renderRightActions={() =>
                                            <ListItemDelete onPress={() => { this.removeFromAdventure(item) }} />}
                                        onPress={() => this.characterWindow(item)} />}
                                    ItemSeparatorComponent={ListItemSeparator}
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this.reloadAdventure(adventure.adventureIdentifier)
                                    }} />
                            </View>
                        }
                        <View style={{ flex: .5, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
                            <AppText fontSize={18}>Adventure identifier:</AppText>
                            <AppText fontSize={20} color={Colors.bitterSweetRed}>{adventure.adventureIdentifier}</AppText>
                        </View>
                        <View style={{ flex: .2, flexDirection: "row", justifyContent: "space-evenly" }}>
                            <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => { this.back() }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Back"} />
                            <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => {
                                Alert.alert("Delete", "Are you sure you want to delete this adventure?", [{ text: 'Yes', onPress: () => this.deleteAdventure() }, { text: 'No' }])
                            }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Delete Adventure"} />
                        </View>
                    </View>
                }
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