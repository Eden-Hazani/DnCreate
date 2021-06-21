import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Unsubscribe } from 'redux';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import InformationDrawer from '../../components/InformationDrawer';
import TextInputDropDown from '../../components/TextInputDropDown';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { RootState } from '../../redux/reducer';

interface CharPersonalityTraitsState {
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateTraits: boolean
    openAutoComplete: boolean[]
}

interface Props {
    character: CharacterModel;
    setStoreCharacterInfo: Function;
    ChangeCreationProgressBar: Function;
    route: any;
    navigation: any;
    updateTraits: boolean;
}

const fillingList: string[] = ['Nothing can shake my optimistic attitude', "I idolize a particular hero of my faith and constantly refer to that person's deeds and example",
    "Flattery is my preferred trick for getting what I want", "I pocket anything I see that might have some value", "I blow up at the slightest insult", "My favor, once lost, is lost forever"]

class CharPersonalityTraits extends Component<Props, CharPersonalityTraitsState>{
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            openAutoComplete: [],
            baseState: '',
            updateTraits: this.props.route.params.updateTraits,
            confirmed: false,
            characterInfo: this.props.character
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = () => {
        if (!this.props.updateTraits) {
            this.props.ChangeCreationProgressBar(.83)
        }
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }

    addTrait = (trait: string, index: number) => {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.personalityTraits) {
            characterInfo.personalityTraits = [];
        }
        characterInfo.personalityTraits[index] = trait;
        if (trait.trim() === "") {
            characterInfo.personalityTraits.splice(index, 1)
        }
        this.setState({ characterInfo }, () => {
        });
    }

    insertInfoAndContinue = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.personalityTraits || this.state.characterInfo.personalityTraits.length === 0) {
            Alert.alert("No Traits", "Are you sure you want to continue without any Traits?", [{
                text: 'Yes', onPress: () => {
                    this.setState({ confirmed: true })
                    this.props.setStoreCharacterInfo(characterInfo)
                    this.props.ChangeCreationProgressBar(.86)
                    setTimeout(() => {
                        this.props.navigation.navigate("CharIdeals", { updateIdeals: false })
                    }, 800);
                    setTimeout(() => {
                        this.setState({ confirmed: false })
                    }, 1100);
                }
            }, { text: 'No' }])
        } else {
            characterInfo.personalityTraits = characterInfo.personalityTraits && characterInfo.personalityTraits.filter(trait => { return trait !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                this.props.setStoreCharacterInfo(characterInfo)
                this.props.ChangeCreationProgressBar(.86)
                setTimeout(() => {
                    this.props.navigation.navigate("CharIdeals", { updateIdeals: false })
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }
    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
        })
        if (this.props.route.params.updateTraits) {
            this.setState({ characterInfo: this.props.route.params.character }, () => {
                this.setState({ baseState: JSON.stringify(this.state.characterInfo) })
            })
        }
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.personalityTraits) {
            characterInfo.personalityTraits = [];
        }
        this.setState({ characterInfo })
    }

    updateTraits = () => {
        const characterInfo = { ...this.state.characterInfo };
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        if (!this.state.characterInfo.personalityTraits || this.state.characterInfo.personalityTraits.length === 0) {
            Alert.alert("No Traits", "Are you sure you want to continue without any Traits?", [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
                }
            }, { text: 'No' }])
        } else {
            characterInfo.personalityTraits = characterInfo.personalityTraits && characterInfo.personalityTraits.filter(trait => { return trait !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                this.props.setStoreCharacterInfo(characterInfo)
                this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.characterInfo)
                setTimeout(() => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
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

    cancelUpdate = () => {
        this.setState({ characterInfo: JSON.parse(this.state.baseState) }, () => {
            this.props.navigation.addListener('beforeRemove', (e: any) => {
                this.props.navigation.dispatch(e.data.action)
            })
            this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
        });
    }

    changeAutoCompleteState = (index: number, action: boolean) => {
        const openAutoComplete = this.state.openAutoComplete;
        openAutoComplete[index] = action;
        this.setState({ openAutoComplete })
    }

    generateJSX = (traits: any) => {
        let jsxList: any[] = [];
        for (let i: number = 0; i < 6; i++) {
            jsxList.push(<View key={i}>
                <AppTextInput
                    onBlur={() => this.changeAutoCompleteState(i, false)}
                    onFocus={() => this.changeAutoCompleteState(i, true)} value={traits ? traits[i] : ''}
                    onChangeText={(trait: string) => { this.addTrait(trait, i) }} padding={10}
                    placeholder={fillingList[i]} width={"80%"} />
                <TextInputDropDown sendText={(val: string) => {
                    this.changeAutoCompleteState(i, false)
                    this.addTrait(val, i)
                }} expendedWidth={Dimensions.get('window').width / 1.2} expendedHeight={450}
                    information={fillingList} isOpen={this.state.openAutoComplete[i]} />
            </View>)
        }
        return jsxList
    }

    render() {
        const traits = this.state.characterInfo.personalityTraits;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Personality Traits</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters personality traits, (the recommended number is two) </AppText>
                        </View>
                        {this.generateJSX(traits)}
                        <View style={{ paddingBottom: 25 }}>
                            {this.state.updateTraits ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateTraits() }} />
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Cancel"} onPress={() => { this.cancelUpdate() }} />
                                </View>
                                :
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(CharPersonalityTraits)


const styles = StyleSheet.create({
    container: {

    },
    textContainer: {
        paddingTop: 15
    }
});