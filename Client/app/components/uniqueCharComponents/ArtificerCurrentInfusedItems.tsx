import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Vibration, Modal, ScrollView } from 'react-native';
import logger from '../../../utility/logger';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { currentTotalInfusedItems, updateInfusionToServer } from '../../screens/charOptions/UniqueCharFunctions/artificerFunctions';
import { AppButton } from '../AppButton';
import { AppText } from '../AppText';
import { AppTextInput } from '../forms/AppTextInput';
import { IconGen } from '../IconGen';

interface ArtificerCurrentInfusedItemsState {
    totalInfusions: number
    infusionsRemaining: number
    character: CharacterModel
    infusionModel: boolean,
    newInfusion: {
        name: string,
        description: string
    }
}

export class ArtificerCurrentInfusedItems extends Component<{ character: CharacterModel }, ArtificerCurrentInfusedItemsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            infusionModel: false,
            newInfusion: { name: '', description: '' },
            totalInfusions: currentTotalInfusedItems(this.props.character.level || 1),
            infusionsRemaining: 0,
            character: this.props.character
        }
    }
    async componentDidMount() {
        try {
            this.setRemainingInfusions()
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    setRemainingInfusions = () => {
        if (this.state.character.charSpecials?.currentInfusedItems) {
            const infusionsRemaining = this.state.totalInfusions - this.state.character.charSpecials.currentInfusedItems.length
            this.setState({ infusionsRemaining })
        }
    }

    addInfusion = () => {
        try {
            if (this.state.newInfusion.name.length === 0 || this.state.newInfusion.description.length === 0) {
                alert('cannot leave empty fields');
                return
            }
            if (this.state.infusionsRemaining === 0) {
                alert('You have no more infusions remaining');
                return
            }
            const character = { ...this.state.character };
            if (character.charSpecials && character.charSpecials.currentInfusedItems) {
                character.charSpecials.currentInfusedItems.push(this.state.newInfusion);
                this.setState({ character }, () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
                    updateInfusionToServer(character);
                    this.setRemainingInfusions()
                    this.setState({ newInfusion: { name: '', description: '' } })
                })
            }

        } catch (err) {
            logger.log(new Error(err))
        }
    }
    removeInfusion = (index: number) => {
        try {
            const character = { ...this.state.character };
            if (character.charSpecials && character.charSpecials.currentInfusedItems) {
                character.charSpecials.currentInfusedItems.splice(index, 1);
                this.setState({ character }, () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
                    updateInfusionToServer(character);
                    this.setRemainingInfusions()
                })
            }

        } catch (err) {
            logger.log(new Error(err))
        }
    }

    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.infusionModel) {
                            this.setState({ infusionModel: false })
                            return;
                        }
                        this.setState({ infusionModel: true })
                    }} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                    <View style={{ paddingBottom: 15 }}>
                        <AppText textAlign={'center'} fontSize={20}>Infusions</AppText>
                        <AppText textAlign={'center'} fontSize={20}>Press to manage infusions</AppText>
                    </View>
                    <AppText textAlign={'center'} fontSize={18}>Total Infused Items:</AppText>
                    <AppText textAlign={'center'} fontSize={18} color={Colors.bitterSweetRed}>{this.state.totalInfusions - this.state.infusionsRemaining}</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Remaining</AppText>
                    <AppText textAlign={'center'} fontSize={18} color={Colors.bitterSweetRed}>{this.state.infusionsRemaining}</AppText>
                </TouchableOpacity>
                <Modal visible={this.state.infusionModel}>
                    <ScrollView style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                        <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => this.setState({ infusionModel: false })}>
                            <IconGen name={'chevron-down'} size={70} iconColor={Colors.bitterSweetRed} />
                        </TouchableOpacity>
                        <AppTextInput
                            value={this.state.newInfusion.name}
                            onChangeText={(name: string) => {
                                const newInfusion = { ...this.state.newInfusion };
                                newInfusion.name = name;
                                this.setState({ newInfusion })
                            }} placeholder={'Item name...'} />
                        <AppTextInput
                            value={this.state.newInfusion.description}
                            onChangeText={(description: string) => {
                                const newInfusion = { ...this.state.newInfusion };
                                newInfusion.description = description;
                                this.setState({ newInfusion })
                            }} placeholder={'Item description...'} />
                        <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => {
                            this.addInfusion()
                        }}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"Add Magical Infusion"} />
                        {this.state.character.charSpecials && this.state.character.charSpecials.currentInfusedItems && this.state.character.charSpecials.currentInfusedItems.length > 0 &&
                            this.state.character.charSpecials.currentInfusedItems.map((item, index) => {
                                return <View key={index} style={{ margin: 5, justifyContent: "space-between", flexDirection: 'row', padding: 25, backgroundColor: Colors.bitterSweetRed, borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 25 }}>
                                    <View>
                                        <AppText fontSize={20}>Infused Item: {item.name}</AppText>
                                        <AppText>Description: {item.description}</AppText>
                                    </View>
                                    <TouchableOpacity onPress={() => this.removeInfusion(index)}>
                                        <IconGen name={'trash-can-outline'} size={50} />
                                    </TouchableOpacity>
                                </View>
                            })}
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    statContainer: {
        width: Dimensions.get('screen').width / 2,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    }
});