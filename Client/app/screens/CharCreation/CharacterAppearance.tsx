import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { connect } from 'react-redux';
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
import { RootState } from '../../redux/reducer';

interface CharacterAppearanceState {
    characterInfo: CharacterModel
    appearance: string
    confirmed: boolean
    updateAppearance: boolean
}

interface Props {
    character: CharacterModel;
    setStoreCharacterInfo: Function;
    ChangeCreationProgressBar: Function;
    route: any;
    navigation: any;
    updateAppearance: boolean;
}

class CharacterAppearance extends Component<Props, CharacterAppearanceState>{
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            appearance: '',
            characterInfo: this.props.character,
            updateAppearance: this.props.route.params.updateAppearance
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentDidMount() {
        if (this.props.updateAppearance) {
            this.setState({ characterInfo: this.props.route.params.character })
        }
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }

    onFocus = () => {
        if (!this.props.updateAppearance) {
            this.props.ChangeCreationProgressBar(.75)
        }
    }

    insertInfoAndContinue = () => {
        if (this.state.appearance.length === 0) {
            Alert.alert("No Appearance", "Are you sure you want to continue without a character appearance?", [{
                text: 'Yes', onPress: () => {
                    this.sendData()
                }
            }, { text: 'No' }])
        } else {
            this.sendData()
        }
    }

    sendData = () => {
        const characterInfo = { ...this.state.characterInfo };
        characterInfo.characterAppearance = this.state.appearance;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            this.props.setStoreCharacterInfo(this.state.characterInfo)
            this.props.ChangeCreationProgressBar(.78)
            setTimeout(() => {
                this.props.navigation.navigate("CharacterAlignment", { updateAlignment: false })
            }, 800);
            setTimeout(() => {
                this.setState({ confirmed: false })
            }, 1100);
        })
    }

    updateInfo = async () => {
        this.props.setStoreCharacterInfo(this.state.characterInfo)
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



    render() {
        const character = this.state.characterInfo;
        return (
            <ScrollView keyboardShouldPersistTaps="always">
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    this.state.updateAppearance ?
                        <View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>The appearance of {character.name}.</AppText>
                                <AppTextInput value={this.state.characterInfo.characterAppearance} onChangeText={(appearance: string) => {
                                    const characterInfo = { ...this.state.characterInfo };
                                    characterInfo.characterAppearance = appearance;
                                    this.setState({ characterInfo })
                                }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s appearance...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.updateInfo() }} />
                            </View>
                        </View>
                        :
                        <View style={styles.container}>
                            <Image uri={`${Config.serverUrl}/assets/specificDragons/appearanceDragon.png`} style={{ height: 200, width: 200, alignSelf: "center" }} />
                            <View style={{ padding: 20 }}>
                                <AppText fontSize={25} textAlign={"center"} color={Colors.bitterSweetRed}>Appearance</AppText>
                                <AppText textAlign={"center"} fontSize={18}>Describing your appearance can have large benefits as you delve into the world of your adventure.</AppText>
                                <AppText textAlign={"center"} fontSize={18}>It is recommended to at least give a short description of your base appearance at the start of your adventure</AppText>
                                <AppText textAlign={"center"} fontSize={18}>You can always change your appearance description from the character sheet.</AppText>
                            </View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>The appearance of {character.name}.</AppText>
                                <AppTextInput onChangeText={(appearance: string) => { this.setState({ appearance }) }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}s appearance...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                            </View>
                        </View>}
            </ScrollView>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        character: state.character,
        user: state.user,
        race: state.race
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        setStoreCharacterInfo: (character: CharacterModel) => { dispatch({ type: ActionType.SetInfoToChar, payload: character }) },
        ChangeCreationProgressBar: (amount: number) => { dispatch({ type: ActionType.ChangeCreationProgressBar, payload: amount }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterAppearance)


const styles = StyleSheet.create({
    container: {

    }
});