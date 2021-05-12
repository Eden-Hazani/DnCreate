import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Config } from '../../../config';
import logger from '../../../utility/logger';
import adventureApi from '../../api/adventureApi';
import AuthContext from '../../auth/context';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { AdventureModel } from '../../models/AdventureModel';
import { CharacterModel } from '../../models/characterModel';
import { store } from '../../redux/store';
import validatePremium from './functions/validatePremium'

interface SelectedParticipationAdvState {
    adventure: AdventureModel
    profilePicList: any[]
    loading: boolean
    participantChar: CharacterModel;
    DMPremium: string
}

export class SelectedParticipationAdv extends Component<{ navigation: any, route: any }, SelectedParticipationAdvState> {
    navigationSubscription: any;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            participantChar: new CharacterModel(),
            loading: true,
            DMPremium: 'MEMBER_ERROR',
            profilePicList: [],
            adventure: this.props.route.params.adventure
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);

    }
    async componentDidMount() {
        try {
            let userArray: string[] = []
            if (this.state.adventure.participants_id) {
                for (let item of this.state.adventure.participants_id) {
                    if (item.user_id) {
                        userArray.push(item.user_id)
                    }
                }
            }
            if (userArray.length === 0) {
                this.setState({ loading: false })
                return
            }
            const userPicList: any = await adventureApi.getUserProfileImages(userArray)
            const picList = userArray.map((item, index) => [item, userPicList?.data.list[index]])
            this.isLeaderPremium();
            this.setState({ profilePicList: picList }, () => {
                this.setState({ loading: false })
            })
            if (this.state.adventure.participants_id) {
                let charIds = [];
                for (let character of store.getState().characters) {
                    if (character._id !== undefined) {
                        charIds.push(character._id)
                    }
                }
                for (let participant of this.state.adventure.participants_id) {
                    charIds.forEach((_id) => {
                        if (_id === participant._id) {
                            this.setState({ participantChar: participant })
                        }
                    })
                }
            }

        } catch (err) {
            logger.log(new Error(err))
        }
    }

    isLeaderPremium = async () => {
        const LeaderPremium = await validatePremium(this.state.adventure.leader_id || "");
        this.setState({ DMPremium: LeaderPremium });
    }

    onFocus = () => {
        const adventure = store.getState().participatingAdv.find((item, index) => item._id === this.state.adventure._id);
        if (adventure)
            this.setState({ adventure })
    }
    render() {
        const adventure = this.state.adventure;
        return (
            <View style={styles.container}>
                {this.state.loading ?
                    <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25}>{adventure.adventureName}</AppText>
                            <AppText> - World Setting - </AppText>
                            <AppText>{adventure.adventureSetting}</AppText>
                            <View style={{ paddingTop: 25 }}>
                                <AppText fontSize={20}>Party Members:</AppText>
                            </View>
                        </View>
                        <View style={styles.party}>
                            <FlatList
                                data={adventure.participants_id}
                                keyExtractor={(currentParticipants, index) => index.toString()}
                                renderItem={({ item, index }) => <ListItem
                                    title={item.name}
                                    subTitle={item.characterClass}
                                    directPicRoute={this.state.profilePicList[index][1]}
                                    imageUrl={(this.state.profilePicList.length > 0 && this.state.profilePicList[index][1]) ? `${Config.serverUrl}/uploads/profile-imgs/${this.state.profilePicList[index][1]}` : `${Config.serverUrl}/assets/races/${item.image}`}
                                    direction={'row'}
                                    headerFontSize={18}
                                    headColor={Colors.bitterSweetRed}
                                    subFontSize={15}
                                    padding={20} width={60} height={60}
                                    headTextAlign={"left"}
                                    subTextAlign={"left"}
                                    justifyContent={"flex-start"} textDistanceFromImg={10} />}
                                ItemSeparatorComponent={ListItemSeparator} />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <AppButton padding={15} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.props.navigation.navigate('Adventures') }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Back"} />
                            <AppButton backgroundColor={Colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("AdventurePictureGallery", { adventure: this.state.adventure }) }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Image Gallery"} />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <AppButton padding={20} backgroundColor={Colors.pinkishSilver}
                                onPress={() => { this.props.navigation.navigate("ActiveQuestList", { adventure: adventure, isDmLevel: false }) }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Active Quests"} />
                            <AppButton padding={20} backgroundColor={Colors.metallicBlue}
                                onPress={() => { this.props.navigation.navigate("CompletedQuestList", { adventure: adventure, isDmLevel: false }) }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Completed Quests"} />
                        </View>
                        <View>
                            <AppButton
                                borderRadius={15} width={150} height={70} title={"Adventure Chat"} backgroundColor={Colors.bitterSweetRed}
                                onPress={() => this.props.navigation.navigate('AdventureChat',
                                    {
                                        participantChar: this.state.participantChar,
                                        adventureIdentifier: this.state.adventure.adventureIdentifier,
                                        adventure_id: this.state.adventure._id,
                                        DM_id: this.state.adventure.leader_id,
                                        premiumStatus: this.state.DMPremium
                                    }
                                )} />
                        </View>
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    party: {

    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
});