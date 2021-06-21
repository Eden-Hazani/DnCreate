import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AppText } from '../../components/AppText';
import LottieView from 'lottie-react-native';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { Unsubscribe } from 'redux';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { ActionType } from '../../redux/action-type';
import AuthContext from '../../auth/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { RootState } from '../../redux/reducer';
import { connect } from 'react-redux';

interface SaveCharacterState {
    characterInfo: CharacterModel
}

interface Props {
    character: CharacterModel;
    setStoreCharacterInfo: Function;
    ChangeCreationProgressBar: Function;
    route: any;
    navigation: any;
    replaceExistingChar: Function;
    characters: CharacterModel[];
    cleanCreator: Function;
}


class SaveCharacter extends Component<Props, SaveCharacterState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            characterInfo: this.props.character
        }
    }


    async componentDidMount() {
        this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.characterInfo);
        this.props.replaceExistingChar(this.props.characters.length - 1, this.state.characterInfo)
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

    home = async () => {
        this.props.cleanCreator()
        this.props.ChangeCreationProgressBar(-1)
        this.props.navigation.navigate("HomeScreen")
        setTimeout(async () => {
            if (await StoreReview.hasAction()) {
                const didRate = await AsyncStorage.getItem('didUserRate');
                if (didRate === null) {
                    Alert.alert("Like what you see?", "Please take a minute to rate DnCreate, it really helps :)", [{
                        text: 'Rate!', onPress: async () => {
                            await AsyncStorage.setItem('didUserRate', JSON.stringify(true));
                            StoreReview.requestReview()
                        }
                    }, { text: 'Later' }])
                }
                await AsyncStorage.setItem('didUserRate', JSON.stringify(true));
            }
        }, 1000);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <AppText fontSize={35} color={Colors.bitterSweetRed}>Congratulations!</AppText>
                    <AppText textAlign={'center'} fontSize={20} >Your Character has been saved!</AppText>
                    <AppText textAlign={'center'} fontSize={20} >You can access it through the Character Hall</AppText>
                    <View style={{ paddingTop: 30 }}>
                        <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.home() }} />
                    </View>
                </View>
                <View style={styles.lottie}>
                    <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay source={require('../../../assets/lottieAnimations/confeetiAnimation.json')} />
                </View>

            </View>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        character: state.character,
        user: state.user,
        race: state.race,
        characters: state.characters
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        setStoreCharacterInfo: (character: CharacterModel) => { dispatch({ type: ActionType.SetInfoToChar, payload: character }) },
        ChangeCreationProgressBar: (amount: number) => { dispatch({ type: ActionType.ChangeCreationProgressBar, payload: amount }) },
        replaceExistingChar: (charIndex: number, character: CharacterModel) => { dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex, character } }) },
        cleanCreator: () => { dispatch({ type: ActionType.CleanCreator }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveCharacter)


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: .5,
        justifyContent: "center",
        alignItems: "center"
    },
    lottie: {
        flex: .7
    }
});