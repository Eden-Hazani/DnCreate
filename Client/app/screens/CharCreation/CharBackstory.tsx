import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Unsubscribe } from 'redux';
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

interface CharBackstoryState {
    characterInfo: CharacterModel
    backstory: string
    confirmed: boolean
}

interface Props {
    character: CharacterModel;
    setStoreCharacterInfo: Function;
    ChangeCreationProgressBar: Function;
    route: any;
    navigation: any;
    updateStory: boolean;
}


class CharBackstory extends Component<Props, CharBackstoryState> {
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            backstory: '',
            characterInfo: this.props.character,
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = () => {
        if (!this.props.updateStory) {
            this.props.ChangeCreationProgressBar(.7)
        }
    }

    componentDidMount() {
        if (this.props.route.params.updateStory) {
            this.setState({ characterInfo: this.props.route.params.character })
        }
    }


    insertInfoAndContinue = () => {
        if (this.state.backstory.length === 0) {
            Alert.alert("No Story", "Are you sure you want to continue without a backstory?", [{
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
        characterInfo.backStory = this.state.backstory;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            this.props.setStoreCharacterInfo(this.state.characterInfo)
            this.props.ChangeCreationProgressBar(.75)
            setTimeout(() => {
                this.props.navigation.navigate("CharacterAppearance", { updateAppearance: false })
            }, 800);
            setTimeout(() => {
                this.setState({ confirmed: false })
            }, 1100);
        })
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }

    updateInfo = async () => {
        this.setState({ confirmed: true })
        this.props.setStoreCharacterInfo(this.state.characterInfo)
        this.context.user._id === "Offline" ? this.updateOfflineCharacter().then(() => this.props.navigation.goBack()) :
            userCharApi.updateChar(this.state.characterInfo).then(() => { this.props.navigation.goBack() })
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
                    this.props.route.params.updateStory ?
                        <View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>The short backstory of {character.name}'s origins.</AppText>
                                <AppTextInput value={this.state.characterInfo.backStory} onChangeText={(backstory: string) => {
                                    const characterInfo = { ...this.state.characterInfo };
                                    characterInfo.backStory = backstory;
                                    this.setState({ characterInfo })
                                }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s backstory...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.updateInfo() }} />
                            </View>
                        </View>
                        :
                        <View style={styles.container}>
                            <View style={{ padding: 20 }}>
                                <AppText fontSize={25} textAlign={"center"} color={Colors.bitterSweetRed}>BackStory</AppText>
                                <AppText textAlign={"center"} fontSize={18}>Remember that the background story is yours to make and you can consult your DM in order to create unique buffs/debuffs that will fit the world.</AppText>
                                <AppText textAlign={"center"} fontSize={18}>Your background might give you special items or the knowledge of multiple languages depending on your DM.</AppText>
                            </View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>The short backstory of {character.name}'s origins.</AppText>
                                <AppTextInput onChangeText={(backstory: string) => { this.setState({ backstory }) }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s backstory...`} width={"95%"} multiline={true} numberOfLines={10} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CharBackstory)

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});