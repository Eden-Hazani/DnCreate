import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
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
import { CreateQuest } from './leaderComponents/CreateQuest';
import logger from '../../../utility/logger';
import { io } from 'socket.io-client';
import { AdventureChat } from './AdventureChat';
import { IconGen } from '../../components/IconGen';
const socket = io(Config.serverUrl);

const { width, height } = Dimensions.get('window')


interface SelectedLeadingAdvState {
    adventure: AdventureModel
    loading: boolean
    refreshing: boolean
    profilePicList: any[]
    questCreationModal: boolean
    innerLoading: boolean
}

export class SelectedLeadingAdv extends Component<{ navigation: any, route: any }, SelectedLeadingAdvState> {
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            questCreationModal: false,
            profilePicList: [],
            adventure: this.props.route.params.adventure,
            loading: true,
            refreshing: false,
            innerLoading: false
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = async () => {
        try {
            const leadingAdv = store.getState().leadingAdv;
            const adventure = leadingAdv.find(adv => adv._id === this.props.route.params.adventure._id);
            if (adventure !== undefined) {
                this.setState({ adventure })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    reloadAdventureAfterQuest = () => {
        try {
            const leadingAdv = store.getState().leadingAdv;
            const adventure = leadingAdv.find(adv => adv._id === this.props.route.params.adventure._id);
            if (adventure !== undefined) {
                this.setState({ adventure })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    getUserProfileImg = async (adventure: AdventureModel) => {
        let userArray: string[] = []
        if (adventure.participants_id !== undefined) {
            for (let item of adventure.participants_id) {
                if (item.user_id !== undefined) {
                    userArray.push(item.user_id)
                }
            }
            const userPicList: any = await adventureApi.getUserProfileImages(userArray)
            const picList = userArray.map((item, index) => [item, userPicList.data.list[index]])
            this.setState({ profilePicList: picList }, () => {
                this.setState({ loading: false })
            })
        }
    }

    async componentDidMount() {
        try {
            store.dispatch({ type: ActionType.ReplaceLeadAdventure, payload: this.state.adventure })
            await this.getUserProfileImg(this.state.adventure)

            this.props.navigation.addListener('beforeRemove', (e: any) => {
                e.preventDefault();
            })
            socket.on(`adventure-${this.state.adventure._id}-change`, (updatedAdventure: any) => {
                this.setState({ innerLoading: true }, async () => {
                    await this.getUserProfileImg(updatedAdventure)
                    this.setState({ adventure: updatedAdventure, innerLoading: false })
                    store.dispatch({ type: ActionType.ReplaceLeadAdventure, payload: updatedAdventure })
                })
            });

        } catch (err) {
            logger.log(new Error(err))
        }
    }
    back = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        this.props.navigation.navigate("Adventures")
    }

    removeFromAdventure = (item: any) => {
        try {
            const adventure = { ...this.state.adventure };
            if (adventure.participants_id !== undefined) {
                const participants_id = adventure.participants_id.filter((participant: any) => participant._id !== item._id)
                adventure.participants_id = participants_id;
                this.setState({ adventure }, () => {
                    store.dispatch({ type: ActionType.UpdateSingleAdventure, payload: this.state.adventure })
                    adventureApi.leaveAdventure(this.state.adventure)
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    characterWindow = async (character: any) => {
        try {
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
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    deleteAdventure = async () => {
        try {
            if (this.state.adventure.adventureIdentifier !== undefined && this.state.adventure.leader_id !== undefined) {
                const response = await adventureApi.deleteAdventure(this.state.adventure.adventureIdentifier, this.state.adventure.leader_id);
                if (!response.ok) {
                    errorHandler(response.status);
                    return;
                }
                store.dispatch({ type: ActionType.DeleteAdventure, payload: this.state.adventure._id });
                this.back();
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    reloadAdventure = async (adventureIdentifier: string) => {
        try {
            this.setState({ loading: true })
            await adventureApi.getSingleLeadingAdventure(this.context.user._id, adventureIdentifier).then(confirmedAdventure => {
                if (!confirmedAdventure.ok) {
                    alert(confirmedAdventure.data);
                    return;
                }
                if (confirmedAdventure.data !== undefined && confirmedAdventure.ok) {
                    this.setState({ adventure: confirmedAdventure.data[0] }, async () => {
                        let userArray: string[] = []
                        if (this.state.adventure.participants_id !== undefined) {
                            for (let item of this.state.adventure.participants_id) {
                                if (item.user_id !== undefined) {
                                    userArray.push(item.user_id)
                                }
                            }
                        }
                        const userPicList: any = await adventureApi.getUserProfileImages(userArray)
                        const picList = userArray.map((item, index) => [item, userPicList.data.list[index]])
                        this.setState({ profilePicList: picList, loading: false })
                    })
                }
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        const adventure = this.state.adventure;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View style={{ flex: 1, paddingBottom: '15%' }}>
                        <View style={{ paddingBottom: 15 }}>
                            <AppText fontSize={25} textAlign={'center'} color={Colors.bitterSweetRed}>{adventure.adventureName}</AppText>
                            <AppText padding={10} textAlign={'center'}>Setting: {adventure.adventureSetting}</AppText>
                        </View>
                        <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={20}>Participants</AppText>
                        {adventure.participants_id !== undefined && adventure.participants_id.length === 0 ?
                            <View style={styles.main}>
                                <AppText textAlign={'center'} fontSize={15}>No one is currently participating in this adventure.</AppText>
                                <AppText textAlign={'center'} fontSize={15}>Share the adventure identifier with your friends to let them join.</AppText>
                            </View>
                            :
                            <View style={{ paddingBottom: 50 }}>
                                {this.state.innerLoading ? <AppActivityIndicator visible={this.state.innerLoading} /> :
                                    <>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ position: 'absolute', left: -10 }}>
                                                <IconGen name={'chevron-left'} size={70} iconColor={Colors.bitterSweetRed} />
                                            </View>
                                            <FlatList
                                                style={{ width, paddingBottom: 15 }}
                                                data={adventure.participants_id}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                pagingEnabled={true}
                                                keyExtractor={(currentParticipants, index) => index.toString()}
                                                renderItem={({ item, index }) => <TouchableOpacity
                                                    onLongPress={() => this.removeFromAdventure(item)}
                                                    onPress={() => this.characterWindow(item)}
                                                    style={{ width: width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image
                                                        style={{ width: 100, height: 100 }}
                                                        source={{ uri: this.state.profilePicList[index][1] ? `${Config.serverUrl}/uploads/profile-imgs/${this.state.profilePicList[index][1]}` : `${Config.serverUrl}/assets/races/${item.image}` }} />
                                                    <AppText padding={10} fontSize={20}>{item.name}</AppText>
                                                </TouchableOpacity>}
                                            />
                                            <View style={{ position: 'absolute', right: -10 }}>
                                                <IconGen name={'chevron-right'} size={70} iconColor={Colors.bitterSweetRed} />
                                            </View>
                                        </View>
                                        <AppText padding={5} textAlign={'center'} fontSize={15}>Long press on a member to remove from the adventure</AppText>
                                    </>
                                }
                            </View>
                        }
                        <View>
                            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", paddingBottom: 50 }}>
                                <AppText fontSize={18}>Adventure identifier:</AppText>
                                <AppText fontSize={20} color={Colors.bitterSweetRed}>{adventure.adventureIdentifier}</AppText>
                            </View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppButton
                                    borderRadius={15} width={150} height={70} title={"Adventure Chat"} backgroundColor={Colors.bitterSweetRed}
                                    onPress={() => this.props.navigation.navigate('AdventureChat',
                                        {
                                            participantChar: { name: "DM", _id: this.context.user._id },
                                            adventureIdentifier: this.state.adventure.adventureIdentifier,
                                            adventure_id: this.state.adventure._id,
                                            premiumStatus: this.context.user.premium ? "OK" : "DM_ERROR"
                                        }
                                    )} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: '100%' }}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => { this.setState({ questCreationModal: true }) }}
                                        fontSize={18} borderRadius={25} width={120} height={65} title={"Quest Creator"} />
                                    <AppButton backgroundColor={Colors.bitterSweetRed}
                                        onPress={() => { this.props.navigation.navigate("AdventurePictureGallery", { adventure: this.state.adventure }) }}
                                        fontSize={18} borderRadius={25} width={120} height={65} title={"Image Gallery"} />
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <AppButton padding={20} backgroundColor={Colors.pinkishSilver}
                                        onPress={() => { this.props.navigation.navigate("ActiveQuestList", { adventure: adventure, isDmLevel: true }) }}
                                        fontSize={18} borderRadius={25} width={120} height={65} title={"Active Quests"} />
                                    <AppButton padding={20} backgroundColor={Colors.metallicBlue}
                                        onPress={() => { this.props.navigation.navigate("CompletedQuestList", { adventure: adventure, isDmLevel: true }) }}
                                        fontSize={18} borderRadius={25} width={120} height={65} title={"Completed Quests"} />
                                </View>
                                <Modal visible={this.state.questCreationModal} animationType="slide">
                                    <CreateQuest edit={{ true: false }} adventure={this.state.adventure} close={(val: boolean) => {
                                        this.setState({ questCreationModal: val })
                                        this.reloadAdventureAfterQuest();
                                    }} />
                                </Modal>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => { this.back() }}
                                    fontSize={18} borderRadius={25} width={120} height={65} title={"Back"} />
                                <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => {
                                    Alert.alert("Delete", "Are you sure you want to delete this adventure?", [{ text: 'Yes', onPress: () => this.deleteAdventure() }, { text: 'No' }])
                                }}
                                    fontSize={18} borderRadius={25} width={120} height={65} title={"Delete Adventure"} />
                            </View>
                        </View>
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15
    },
    main: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});