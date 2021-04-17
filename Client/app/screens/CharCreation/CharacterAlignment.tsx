import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharacterAlignmentState {
    characterInfo: CharacterModel
    alignment: {
        alignment: string,
        alignmentDescription: string
    }
    confirmed: boolean
    updateAlignment: boolean,
    clickedAlignment: number
}

const alignmentList: string[] = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"]

export class CharacterAlignment extends Component<{ props: any, route: any, navigation: any, updateAlignment: boolean }, CharacterAlignmentState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            clickedAlignment: -1,
            confirmed: false,
            alignment: {
                alignment: '',
                alignmentDescription: ''
            },
            characterInfo: store.getState().character,
            updateAlignment: this.props.route.params.updateAlignment
        }
    }
    componentDidMount() {
        if (this.state.updateAlignment) {
            this.setState({ characterInfo: this.props.route.params.character }, () => {
                if (!this.state.characterInfo.characterAlignment) {
                    const characterInfo = { ...this.state.characterInfo };
                    characterInfo.characterAlignment = { alignment: '', alignmentDescription: '' }
                    this.setState({ characterInfo })
                }
            })
        }
    }

    insertInfoAndContinue = () => {
        if (this.state.alignment.alignment.length === 0 || this.state.alignment.alignmentDescription.length === 0) {
            Alert.alert("No Alignment or Description", "Are you sure you want to continue without character Alignment?", [{
                text: 'Yes', onPress: () => {
                    const characterInfo = { ...this.state.characterInfo };
                    characterInfo.characterAlignment = this.state.alignment;
                    this.setState({ characterInfo }, () => {
                        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                        this.props.navigation.navigate("CharPersonalityTraits", { updateTraits: false })
                    })
                }
            }, { text: 'No' }])
        } else {
            const characterInfo = { ...this.state.characterInfo };
            characterInfo.characterAlignment = this.state.alignment;
            console.log(characterInfo)
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharPersonalityTraits", { updateTraits: false })
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    updateInfo = async () => {
        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
        this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.characterInfo)
        this.props.navigation.navigate("SelectCharacter", { character: this.state.characterInfo, isDm: false })
    }

    updateOfflineCharacter = async () => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        if (stringifiedChars) {
            const characters = JSON.parse(stringifiedChars);
            for (let index in characters) {
                if (characters[index]._id === this.state.characterInfo._id) {
                    characters[index] = this.state.characterInfo;
                    break;
                }
            }
            await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
        }
    }

    pickAlignment = (alignmentItem: string, index: number, isUpdate: boolean) => {
        if (!isUpdate) {
            const alignment = { ...this.state.alignment }
            alignment.alignment = alignmentItem;
            this.setState({ alignment, clickedAlignment: index })
            return
        } else {
            const characterInfo = { ...this.state.characterInfo }
            if (characterInfo.characterAlignment) {
                characterInfo.characterAlignment.alignment = alignmentItem
                this.setState({ characterInfo, clickedAlignment: index })
                return
            }
        }
    }


    render() {
        const character = this.state.characterInfo;
        return (
            <ScrollView keyboardShouldPersistTaps="always">
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    this.state.updateAlignment ?
                        <View>
                            <View>
                                <Image uri={`${Config.serverUrl}/assets/specificDragons/alignmentDragon.png`} style={{ height: 200, width: 200, alignSelf: "center" }} />
                                <AppText fontSize={25} textAlign={"center"} color={Colors.bitterSweetRed}>Alignment</AppText>
                                <View style={{ flexDirection: 'row', flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                    {alignmentList.map((alignment, index) => <TouchableOpacity key={index} onPress={() => this.pickAlignment(alignment, index, this.state.updateAlignment)}
                                        style={[styles.item, { backgroundColor: this.state.clickedAlignment === index ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                        <AppText>{alignment}</AppText>
                                    </TouchableOpacity>)}
                                </View>
                            </View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>Alignment description...</AppText>
                                <AppTextInput value={this.state.characterInfo.characterAlignment?.alignmentDescription} onChangeText={(description: string) => {
                                    const characterInfo = { ...this.state.characterInfo };
                                    if (characterInfo.characterAlignment) {
                                        characterInfo.characterAlignment.alignmentDescription = description;
                                        this.setState({ characterInfo })
                                    }
                                }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s Alignment Description...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.updateInfo() }} />
                            </View>
                        </View>
                        :
                        <View style={styles.container}>
                            <Image uri={`${Config.serverUrl}/assets/specificDragons/alignmentDragon.png`} style={{ height: 200, width: 200, alignSelf: "center" }} />
                            <AppText fontSize={25} textAlign={"center"} color={Colors.bitterSweetRed}>Alignment</AppText>
                            <View style={{ flexDirection: 'row', flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                {alignmentList.map((alignment, index) => <TouchableOpacity key={index} onPress={() => this.pickAlignment(alignment, index, this.state.updateAlignment)}
                                    style={[styles.item, { backgroundColor: this.state.clickedAlignment === index ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                    <AppText>{alignment}</AppText>
                                </TouchableOpacity>)}
                            </View>
                            <View style={{ padding: 20 }}>
                                <AppText textAlign={"center"} fontSize={18}>A short description of why your character tends towards this alignment, this information can vastly improve your role play experience</AppText>
                            </View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>{character.name}s Alignment.</AppText>
                                <AppTextInput onChangeText={(description: string) => {
                                    const alignment = { ...this.state.alignment }
                                    alignment.alignmentDescription = description
                                    this.setState({ alignment })
                                }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}s Alignment Description...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                            </View>
                        </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});