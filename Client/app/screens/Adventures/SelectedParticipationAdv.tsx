import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Config } from '../../../config';
import logger from '../../../utility/logger';
import adventureApi from '../../api/adventureApi';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { AdventureModel } from '../../models/AdventureModel';
import { store } from '../../redux/store';

interface SelectedParticipationAdvState {
    adventure: AdventureModel
    profilePicList: any[]
    loading: boolean
}

export class SelectedParticipationAdv extends Component<{ navigation: any, route: any }, SelectedParticipationAdvState> {
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
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
            this.setState({ profilePicList: picList }, () => {
                this.setState({ loading: false })
            })
        } catch (err) {
            logger.log(new Error(err))
        }
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
                        <AppButton padding={15} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.props.navigation.navigate('Adventures') }}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"Back"} />
                        <View>
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