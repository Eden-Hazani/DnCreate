import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Config } from '../../../config';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import TextInputDropDown from '../../components/TextInputDropDown';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface ReplaceLanguagesState {
    character: CharacterModel
    newLanguage: string
    openAutoComplete: boolean
    languageOptions: string[]
}
const autoArray = ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Draconic', 'Abyssal', 'Infernal', 'Deep Speech']
export class ReplaceLanguages extends Component<{ navigation: any, route: any }, ReplaceLanguagesState>{
    constructor(props: any) {
        super(props)
        this.state = {
            openAutoComplete: false,
            newLanguage: '',
            character: this.props.route.params.char,
            languageOptions: autoArray
        }
    }
    addLanguage = () => {
        const character = { ...this.state.character };
        if (this.state.newLanguage.length === 0) {
            alert('cannot leave language field empty!');
            return;
        }
        character.languages?.push(this.state.newLanguage);
        this.setState({ character, newLanguage: '' }, async () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            await userCharApi.updateChar(this.state.character)
        })
    }
    removeLanguage = (index: number) => {
        const character = { ...this.state.character };
        character.languages?.splice(index, 1);
        this.setState({ character }, async () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            await userCharApi.updateChar(this.state.character)
        })
    }
    filterLanguages = (text: string) => {
        const languageOptions: string[] = [];
        for (let item of autoArray) {
            if (item.includes(text)) {
                languageOptions.push(item)
            }
        }
        this.setState({ languageOptions })
    }
    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                <View style={{ paddingTop: 25, justifyContent: "center", alignItems: "center" }}>
                    <Image uri={`${Config.serverUrl}/assets/specificDragons/languageDragon.png`} style={{ width: 150, height: 150 }} />
                    <AppText textAlign={'center'} fontSize={25}>Add and remove Languages</AppText>
                    <AppText textAlign={'center'} fontSize={18}>To remove a language press and hold on it's name.</AppText>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <AppTextInput
                        width={250}
                        padding={10}
                        onBlur={() => this.setState({ openAutoComplete: false })}
                        onFocus={() => this.setState({ openAutoComplete: true })}
                        value={this.state.newLanguage ? this.state.newLanguage : ''}
                        onChangeText={(newLanguage: string) => {
                            this.setState({ newLanguage })
                            this.filterLanguages(newLanguage)
                        }}
                        placeholder={'Language Name...'} />
                    <AppButton fontSize={25} backgroundColor={Colors.bitterSweetRed}
                        borderRadius={70} width={70} height={70} title={"Add Language"} onPress={() => { this.addLanguage() }} />
                </View>
                <TextInputDropDown information={this.state.languageOptions} isOpen={this.state.openAutoComplete}
                    expendedWidth={Dimensions.get('window').width / 1.2} expendedHeight={'100%'}
                    sendText={(newLanguage: string) => {
                        this.setState({ newLanguage, openAutoComplete: false })
                    }}
                />

                {this.state.character.languages ?
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                        {this.state.character.languages.map((language, index) => {
                            return <TouchableOpacity key={index} style={[styles.item, { backgroundColor: Colors.bitterSweetRed }]} onLongPress={() => this.removeLanguage(index)}>
                                <AppText>{language}</AppText>
                            </TouchableOpacity>
                        })}
                    </View>
                    : null}
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
        borderRadius: 25,
    }
});