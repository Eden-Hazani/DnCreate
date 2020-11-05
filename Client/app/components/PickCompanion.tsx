import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import userCharApi from '../api/userCharApi';
import colors from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { CompanionModel } from '../models/companionModel';
import { store } from '../redux/store';
import { AppButton } from './AppButton';
import { AppCompanion } from './AppCompanion';
import { AppText } from './AppText';
import { ListItem } from './ListItem';
import ListItemDelete from './ListItemDelete';
import { ListItemSeparator } from './ListItemSeparator';

interface PickCompanionState {
    character: CharacterModel
    companionModal: boolean
    chosenCompanion: number
}

export class PickCompanion extends Component<{ character: CharacterModel, proficiency: number, closeModal: any }, PickCompanionState>{
    constructor(props: any) {
        super(props)
        this.state = {
            companionModal: false,
            chosenCompanion: null,
            character: this.props.character
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: .8 }}>
                    <View style={{ marginTop: 25, marginBottom: 15 }}>
                        <AppButton fontSize={20} backgroundColor={colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'New Companion'} onPress={() => {
                                this.setState({ chosenCompanion: this.state.character.charSpecials.companion.length, companionModal: true })
                            }} />
                    </View>
                    <View>
                        <AppText textAlign={'center'} fontSize={17}>Here you can create and access your companions.</AppText>
                        <AppText textAlign={'center'} fontSize={17}>The usual way to unlock the ability to use companions is through a path feature, such as Beast Master of the Ranger class</AppText>
                        <AppText textAlign={'center'} fontSize={17}>Also, your DM can give you an ability (or magical item) that enables you to use a companion</AppText>
                        <AppText textAlign={'center'} fontSize={17}>You cannot add a companion without a companion related ability, either from your chosen path or from your DM</AppText>
                    </View>
                    <AppText textAlign={'center'} fontSize={22} color={colors.berries}>Pick companion</AppText>
                    {store.getState().character.charSpecials.companion.length > 0 &&
                        <FlatList
                            data={store.getState().character.charSpecials.companion}
                            keyExtractor={(companion, index) => index.toString()}
                            renderItem={({ item, index }) => <ListItem
                                title={item.name}
                                subTitle={`${item.animalType}`}
                                direction={'row'}
                                padding={20} width={60} height={60} headerFontSize={20} subFontSize={18}
                                headTextAlign={"left"}
                                subTextAlign={"left"}
                                justifyContent={"flex-start"} textDistanceFromImg={10}
                                onPress={() => {
                                    this.setState({ companionModal: true, chosenCompanion: index })
                                }} />}
                            ItemSeparatorComponent={ListItemSeparator} />
                    }
                </View>
                <View style={{ marginBottom: 15, flex: .2 }}>
                    <AppButton fontSize={20} backgroundColor={colors.bitterSweetRed} width={180} height={50}
                        borderRadius={25} title={'Close'} onPress={() => { this.props.closeModal(false) }} />
                </View>
                <Modal visible={this.state.companionModal}>
                    <AppCompanion pickedIndex={this.state.chosenCompanion} proficiency={this.props.proficiency} character={this.props.character} closeModal={(val: boolean) => { this.setState({ companionModal: val }) }} />
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});