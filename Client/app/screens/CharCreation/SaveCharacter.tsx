import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { ActionType } from '../../redux/action-type';

interface SaveCharacterState {
    characterInfo: CharacterModel
}


export class SaveCharacter extends Component<{ navigation: any }, SaveCharacterState>{
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }


    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    componentDidMount() {
        userCharApi.updateChar(this.state.characterInfo);
    }

    home = () => {
        store.dispatch({ type: ActionType.CleanCreator });
        this.props.navigation.navigate("HomeScreen")

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <AppText fontSize={35} color={colors.bitterSweetRed}>Congratulations!</AppText>
                    <AppText textAlign={'center'} fontSize={20} >Your Character has been saved!</AppText>
                    <AppText textAlign={'center'} fontSize={20} >You can access it through the Character Hall</AppText>
                    <View style={{ paddingTop: 30 }}>
                        <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.home() }} />
                    </View>
                </View>
                <View style={styles.lottie}>
                    <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay source={require('../../../assets/lottieAnimations/confeetiAnimation.json')} />
                </View>

            </View>
        )
    }
}


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