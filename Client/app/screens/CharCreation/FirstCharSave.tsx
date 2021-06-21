import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { RootState } from '../../redux/reducer';
import { AppText } from '../../components/AppText'
import { AppButton } from '../../components/AppButton';
import { Image } from "react-native-expo-image-cache"
import { Config } from '../../../config';
import { Alert } from 'react-native';

const { height, width } = Dimensions.get('window')

interface Props {
    character: CharacterModel
}

function FirstCharSave({ character }: Props) {
    const navigation = useNavigation()

    const gender = () => {
        if (character.gender === 'Male') return 'him';
        else if (character.gender === 'Female') return 'her';
        else return 'it';
    }
    const exit = () => {
        Alert.alert("Exit creator?", "If this is your first character we recommend that you finish the creator.", [{ text: 'Yes', onPress: () => navigation.navigate("HomeScreen") }, { text: 'No' }])
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 25, padding: 15, alignItems: 'center', justifyContent: 'center' }}>
                <Image uri={`${Config.serverUrl}/assets/specificDragons/saveDragon.png`} style={{ width: width / 2.2, height: width / 2.2 }} />
                <AppText fontSize={25} textAlign={"center"} color={Colors.earthYellow}>You Character has been saved!</AppText>
                <AppText textAlign={"center"} fontSize={18}>{character.name} has been saved and you can now access {gender()} through the character hall.</AppText>
                <AppText textAlign={"center"} fontSize={18}>The next part of the creator is for BackStory, Personality Traits, Appearance, and Alignment.</AppText>
                <AppText textAlign={"center"} fontSize={18}>All of these can be edited later from your character sheet.</AppText>
                <AppText textAlign={"center"} fontSize={18}>If you wish you can exit the creator now and edit the rest of you character later.</AppText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Finish Creator"} onPress={() => navigation.navigate("CharBackstory", { updateStory: false })} />
                <AppButton fontSize={18} backgroundColor={Colors.danger} borderRadius={100} width={100} height={100} title={"Exit"} onPress={() => exit()} />
            </View>
        </ScrollView>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        character: state.character,
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        setStoreCharacterInfo: (character: CharacterModel) => { dispatch({ type: ActionType.SetInfoToChar, payload: character }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstCharSave)


const styles = StyleSheet.create({
    container: {

    }
});