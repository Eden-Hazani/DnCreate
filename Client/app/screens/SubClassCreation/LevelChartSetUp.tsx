import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { SubClassModal } from '../../models/SubClassModal';
import { store } from '../../redux/store';
import * as customPathLevelList from '../../../jsonDump/customPathLevelList.json'
import { AppText } from '../../components/AppText';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../config/colors';
import { levelUpChartModal } from '../../models/levelUpChartModal';
import { ActionType } from '../../redux/action-type';
import subClassesApi from '../../api/subClassesApi';
import logger from '../../../utility/logger';
import AuthContext from '../../auth/context';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
interface LevelChartSetUpState {
    customSubclass: SubClassModal
    finishModal: boolean
    loading: boolean
    isPublic: boolean
}
export class LevelChartSetUp extends Component<{ navigation: any }, LevelChartSetUpState>{
    static contextType = AuthContext;
    public navigationSubscription: any;
    public navigationLeaveSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            finishModal: false,
            isPublic: false,
            customSubclass: store.getState().customSubClass
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
        this.navigationLeaveSubscription = this.props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
            Alert.alert("Cancel?", "All changes will be lost",
                [{
                    text: 'Yes', onPress: () => {
                        this.props.navigation.dispatch(e.data.action)
                    }
                }, { text: 'No' }])
        });
    }
    onFocus = () => {
        const preCheckSubClass = store.getState().customSubClass;
        if (preCheckSubClass.levelUpChart) {
            for (let level of customPathLevelList[this.state.customSubclass.baseClass as any]) {
                const featureObj: levelUpChartModal[] = Object.values(preCheckSubClass.levelUpChart[level]);
                let index: number = 0;
                for (let item of featureObj) {
                    if (!item.name || !item.description || item.name === "" || item.description === "") {
                        console.log(preCheckSubClass.levelUpChart[level])
                        delete preCheckSubClass.levelUpChart[level][index + 1]
                    }
                    index++
                }
            }
            this.setState({ customSubclass: preCheckSubClass }, () => {
                store.dispatch({ type: ActionType.UpdateSubclass, payload: preCheckSubClass })
            })
        }
    }

    approveChoices = () => {
        if (this.state.customSubclass.baseClass && this.state.customSubclass.levelUpChart) {
            for (let item of customPathLevelList[this.state.customSubclass.baseClass]) {
                if (Object.values(this.state.customSubclass.levelUpChart[item] as []).length === 0) {
                    alert("Each subclass level must have at least one feature");
                    return
                }
            }
        }
        this.setState({ finishModal: true })
    }

    uploadClass = async () => {
        try {
            this.setState({ loading: true })
            const subclass = { ...store.getState().customSubClass };
            subclass.user_id = this.context.user._id
            subclass.isPublic = this.state.isPublic
            const result = await subClassesApi.saveSubclass(subclass)
            if (result.data === true) {
                this.setState({ loading: false })
                this.navigationLeaveSubscription()
                this.props.navigation.navigate("CreationScreen")
            }
        } catch (err) {
            logger.log(err)
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Modal visible={this.state.finishModal}>
                    <View style={{ backgroundColor: Colors.pageBackground, flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Image uri={`${Config.serverUrl}/assets/specificDragons/sharingDragon.png`} style={{ height: 250, width: 250 }} />
                        <AppText textAlign={'center'} fontSize={25}>Congratulations!</AppText>
                        <AppText textAlign={'center'} fontSize={18}>You are a step away from publishing your very own custom subclass!</AppText>
                        <AppText textAlign={'center'} fontSize={18}>You have a choice sharing this subclass with the rest of the community or just keep it to yourself</AppText>
                        <View style={{ justifyContent: "center", alignItems: 'center' }}>
                            <AppText textAlign={'center'} fontSize={18}>Share With DnCreate</AppText>
                            <Switch value={this.state.isPublic} onValueChange={() => {
                                if (this.state.isPublic) {
                                    this.setState({ isPublic: false })
                                    return;
                                }
                                this.setState({ isPublic: true })
                            }} />
                        </View>
                        {this.state.loading ?
                            <AppActivityIndicator visible={this.state.loading} />
                            :
                            <AppButton
                                fontSize={20} backgroundColor={Colors.bitterSweetRed}
                                width={100} height={100}
                                borderRadius={100}
                                title={'Publish'}
                                onPress={() => this.uploadClass()} />
                        }
                    </View>
                </Modal>
                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <View>
                        <AppText textAlign={'center'} fontSize={25} padding={15}>Welcome to the subclass feature creator.</AppText>
                        <AppText textAlign={'center'} fontSize={18} padding={8}>Your chosen class subclass levels are shown below, you have the ability to add as many features to the subclass as you like.</AppText>
                        <AppText textAlign={'center'} fontSize={18} padding={8}>Remember that each level must have at least one feature attached to it.</AppText>
                        <AppText textAlign={'center'} fontSize={18} padding={8}>note: if you chose a non magical race and you wish to add magical abilities to it through the subclass you are only able to do that at the first subclass level in the first feature.</AppText>
                        <AppText textAlign={'center'} fontSize={18} padding={8}>Once you are finished adding features press on the "Approve" button below</AppText>
                    </View>
                    {this.state.customSubclass.baseClass && customPathLevelList[this.state.customSubclass.baseClass].map((item: string, index: number) => {
                        return <View key={index} style={{ borderWidth: 1, borderColor: Colors.whiteInDarkMode, borderRadius: 25, width: '100%', padding: 25, margin: 10 }}>
                            <AppText fontSize={30}>Level {item}</AppText>
                            {this.state.customSubclass.levelUpChart && Object.values(this.state.customSubclass.levelUpChart[item] as []).map((featureItem: levelUpChartModal, index: number) => {
                                return <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate("EditSubClassFeature", { featureLevel: item, featureNumber: index + 1, featureInfo: this.state.customSubclass.levelUpChart && this.state.customSubclass.levelUpChart[item][index + 1] })
                                }}
                                    key={index} style={{ borderWidth: 1, borderColor: Colors.burgundy, borderRadius: 25, width: '100%', padding: 10, margin: 5 }}>
                                    <AppText fontSize={22}>Feature name: {featureItem.name}</AppText>
                                    <AppText fontSize={18}>Feature description: {featureItem.description}</AppText>
                                </TouchableOpacity>
                            })}
                            <AppButton padding={10} fontSize={20} title={'Edit Features'} onPress={() => {
                                this.props.navigation.navigate("AddLevelFeature", { currentLevel: item })
                            }}
                                borderRadius={10}
                                backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                        </View>
                    })}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", paddingBottom: 15 }}>
                    <AppButton fontSize={20} title={'Approve'} onPress={() => this.approveChoices()}
                        borderRadius={10}
                        backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                    <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                        this.props.navigation.navigate("CreateSubClass")
                    }}
                        borderRadius={10}
                        backgroundColor={Colors.metallicBlue} width={120} height={45} />
                </View>

            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});