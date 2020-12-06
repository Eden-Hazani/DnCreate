import React, { Component } from 'react';
import { View, StyleSheet, Linking, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Unsubscribe } from 'redux';
import errorHandler from '../../../utility/errorHander';
import charClassApi from '../../api/charClassApi';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppError } from '../../components/AppError';
import { AppPicker } from '../../components/AppPicker';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ClassModel } from '../../models/classModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import AsyncStorage from '@react-native-community/async-storage';
interface ClassPickState {
    loading: boolean
    classes: ClassModel[] | undefined
    pickedClass: ClassModel
    characterInfo: CharacterModel
    error: boolean
    isUserOffline: boolean
    confirmed: boolean
}

export class ClassPick extends Component<{ route: any, placeholder: string, navigation: any }, ClassPickState>{
    private UnsubscribeStore: Unsubscribe;
    private dragonClasses: any
    constructor(props: any) {
        super(props)
        this.state = {
            isUserOffline: false,
            confirmed: false,
            loading: false,
            error: false,
            classes: [],
            pickedClass: new ClassModel(),
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => {
            store.getState().character
        })
        this.dragonClasses = {
            Barbarian: { icon: require('../../../assets/barbarianDragon.png') },
            Bard: { icon: require('../../../assets/bardDragon.png') },
            Fighter: { icon: require('../../../assets/fighterDragon.png') },
            Druid: { icon: require('../../../assets/druidDragon.png') },
            Cleric: { icon: require('../../../assets/clericDragon.png') },
            Monk: { icon: require('../../../assets/monkDragon.png') },
            Paladin: { icon: require('../../../assets/paladinDragon.png') },
            Ranger: { icon: require('../../../assets/rangerDragon.png') },
            Rogue: { icon: require('../../../assets/rogueDragon.png') },
            Sorcerer: { icon: require('../../../assets/sorcererDragon.png') },
            Warlock: { icon: require('../../../assets/warlockDragon.png') },
            Wizard: { icon: require('../../../assets/wizardDragon.png') },
        }
    }
    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        characterInfo.characterClass = this.state.pickedClass.name;
        this.state.isUserOffline ? characterInfo.characterClassId = this.state.pickedClass : characterInfo.characterClassId = this.state.pickedClass._id as any;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
        })
        setTimeout(() => {
            this.props.navigation.navigate("AttributePicking", { race: this.props.route.params.race })
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    async componentDidMount() {
        const isOffline = await AsyncStorage.getItem('isOffline');
        this.setState({ isUserOffline: JSON.parse(isOffline) })
        this.getClasses()
    }

    getClasses = async () => {
        AsyncStorage.removeItem('classList')
        this.setState({ loading: true })
        const cachedClasses = await AsyncStorage.getItem('classList');
        this.setState({ loading: true })
        if (cachedClasses) {
            const classes = JSON.parse(cachedClasses);
            this.setState({ classes }, () => {
                this.setState({ loading: false })
            })
            return;
        }
        const result = await charClassApi.getClassesList();
        await AsyncStorage.setItem('classList', JSON.stringify(result.data));
        this.setState({ loading: false })
        const classes = result.data;
        this.setState({ classes, error: errorHandler(result) })

    }

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View style={styles.container}>
                        {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                            this.state.error ? <AppError /> :
                                <View style={{ flex: 1 }}>
                                    <View style={{ paddingTop: 50, padding: 10, paddingBottom: 0 }}>
                                        <AppText textAlign={"center"} fontSize={20}>In this section you will need to pick your characters class.</AppText>
                                        <AppText textAlign={"center"} fontSize={18}>Each class has it's own benefits and weaknesses, work with your team to create a versatile party!</AppText>
                                    </View>
                                    <View style={{ flex: .15 }}>
                                        <AppPicker itemList={this.state.classes} selectedItemIcon={this.state.pickedClass.icon} selectedItem={this.state.pickedClass.name} selectItem={(pickedClass: any) => { this.setState({ pickedClass: pickedClass }) }} numColumns={3} placeholder={"Pick Class"} iconName={"apps"} />
                                    </View>
                                    {this.state.pickedClass.name &&
                                        <View style={styles.infoContainer}>
                                            <View >
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <Image style={{ width: 150, height: 150 }} source={this.dragonClasses[this.state.pickedClass.name].icon} />
                                                </View>
                                                <AppText fontSize={30} textAlign={"center"} color={Colors.bitterSweetRed}>Class {this.state.pickedClass.name}</AppText>
                                                <AppText fontSize={20} textAlign={"center"}>{this.state.pickedClass.description.replace(/\. /g, '.\n\n')}</AppText>
                                                <AppText textAlign={"center"} fontSize={15}>{this.state.pickedClass.brifInfo.replace(/\. /g, '.\n\n')}</AppText>
                                                <View style={{ flexWrap: "wrap", alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
                                                    <View style={{ width: "50%", marginTop: 10 }}>
                                                        <AppText textAlign={"center"} fontSize={18} color={Colors.bitterSweetRed}>Recommended Attributes</AppText>
                                                        <AppText textAlign={"center"} fontSize={15}>{this.state.pickedClass.recommendation}</AppText>
                                                    </View>
                                                    <View style={{ width: "50%" }}>
                                                        <AppText textAlign={"center"} fontSize={18} color={Colors.bitterSweetRed}>Saving Throws</AppText>
                                                        {this.state.pickedClass.savingThrows.map((item) => <AppText key={item} textAlign={"center"} fontSize={15}>{item}</AppText>)}
                                                    </View>
                                                    <View style={{ padding: 10 }}>
                                                        <AppButton borderRadius={15} width={150} height={50} backgroundColor={Colors.bitterSweetRed} title={"More Information"} textAlign={"center"} fontSize={15} onPress={() => { Linking.openURL(this.state.pickedClass.information) }} />
                                                    </View>
                                                </View>
                                            </View>
                                            <View>
                                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                                            </View>
                                        </View>
                                    }
                                </View>
                        }
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }, infoContainer: {
        flex: .8,
        padding: 20
    }
});