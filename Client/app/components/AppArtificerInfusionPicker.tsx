import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { store } from '../redux/store';
import { AppText } from './AppText';
import * as infusionList from '../../jsonDump/artificerInfusions.json'
import { AppButton } from './AppButton';
import { AppTextInput } from './forms/AppTextInput';

interface AppArtificerInfusionPickerState {
    beforeChangeChar: CharacterModel,
    loading: boolean
    infusionsClicked: boolean[]
    pickedInfusions: any[]
    extraInfusionChange: boolean
    disabledInfusions: boolean[]
    replicatedItems: any[]
    magicalItemName: string,
    magicalItemDescription: string,
    itemReplicationModal: boolean
}


export class AppArtificerInfusionPicker extends Component<{
    character: CharacterModel, totalInfusions: any, loadInfusions: any, infusionsToPick: any
}, AppArtificerInfusionPickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            itemReplicationModal: false,
            magicalItemDescription: '',
            magicalItemName: "",
            replicatedItems: [],
            disabledInfusions: [],
            beforeChangeChar: new CharacterModel(),
            extraInfusionChange: false,
            pickedInfusions: [],
            infusionsClicked: [],
            loading: true
        }
    }

    getFromStorage = async () => {
        try {
            if (this.props.character.level) {
                const beforeChangeCharString = await AsyncStorage.getItem(`current${this.props.character._id}level${this.props.character.level - 1}`)
                if (!beforeChangeCharString) {
                    return
                }
                this.setState({ beforeChangeChar: JSON.parse(beforeChangeCharString) })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    componentDidMount() {
        try {
            this.getFromStorage().then(() => {
                const storeItem = store.getState().character;
                const replicatedItems = [...this.state.replicatedItems]
                if (storeItem.charSpecials?.artificerInfusions) {
                    let replicatedItemsIndex: number = 0;
                    for (let item of storeItem.charSpecials.artificerInfusions) {
                        if (item.replicatedItem) {
                            replicatedItems.push(item)
                            this.state.infusionsClicked[infusionList.infusions.length + replicatedItemsIndex] = true
                            replicatedItemsIndex++
                        }
                    }
                    this.setState({ pickedInfusions: storeItem.charSpecials.artificerInfusions, replicatedItems })
                    let index: number = 0;
                    for (let item of infusionList.infusions) {
                        if (this.props.character.level && (item.preReq > this.props.character.level)) {
                            this.state.disabledInfusions[index] = true
                        }
                        index++
                    }
                    infusionList.infusions.forEach((item: any, index: number) => (this.state.beforeChangeChar.charSpecials && this.state.beforeChangeChar.charSpecials.artificerInfusions) && this.state.beforeChangeChar.charSpecials.artificerInfusions.forEach(val => {
                        if (item.name === val.name) {
                            this.state.infusionsClicked[index] = true
                        }
                    }))
                    this.props.infusionsToPick(true)
                    if (this.props.totalInfusions === this.state.pickedInfusions.length) {
                        this.props.infusionsToPick(false)
                    }
                }
                this.setState({ loading: false })
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    componentWillUnmount() {
        this.props.infusionsToPick(false)
    }




    setInfusions = (item: any, index: number) => {
        try {
            if (this.state.beforeChangeChar.charSpecials?.artificerInfusions && this.state.beforeChangeChar.level) {
                for (let unit of this.state.beforeChangeChar.charSpecials.artificerInfusions) {
                    if (unit.name === item.name && this.state.beforeChangeChar.level >= 2 && this.state.infusionsClicked[index]) {
                        if (this.state.extraInfusionChange) {
                            alert('You can only change one Infusion you previously picked');
                            return;
                        }
                        let pickedInfusions = this.state.pickedInfusions;
                        const infusionsClicked = this.state.infusionsClicked;
                        infusionsClicked[index] = false;
                        pickedInfusions = pickedInfusions.filter((val: any) => item.name !== val.name);
                        this.setState({ pickedInfusions, extraInfusionChange: true }, () => {
                            this.props.loadInfusions(this.state.pickedInfusions)
                        })
                        this.props.infusionsToPick(true)
                        return;
                    }
                    if (unit.name === item.name && this.state.beforeChangeChar.level >= 2 && !this.state.infusionsClicked[index]) {
                        if (this.state.pickedInfusions.length === this.props.totalInfusions) {
                            alert(`You have ${this.props.totalInfusions} infusions to pick`)
                            return;
                        }
                        let pickedInfusions = this.state.pickedInfusions;
                        const infusionsClicked = this.state.infusionsClicked;
                        infusionsClicked[index] = true;
                        pickedInfusions.push(item);
                        this.setState({ pickedInfusions, extraInfusionChange: false }, () => {
                            this.props.loadInfusions(this.state.pickedInfusions)
                            if (this.state.pickedInfusions.length === this.props.totalInfusions) {
                                this.props.infusionsToPick(false)
                            }
                        })
                        return;
                    }
                }
                if (!this.state.infusionsClicked[index]) {
                    if (this.state.pickedInfusions.length === this.props.totalInfusions) {
                        alert(`You have ${this.props.totalInfusions} infusions to pick`)
                        return;
                    }
                    const pickedInfusions = this.state.pickedInfusions;
                    const infusionsClicked = this.state.infusionsClicked;
                    infusionsClicked[index] = true;
                    pickedInfusions.push(item);
                    this.setState({ pickedInfusions }, () => {
                        this.props.loadInfusions(this.state.pickedInfusions)
                        if (this.state.pickedInfusions.length === this.props.totalInfusions) {
                            this.props.infusionsToPick(false)
                        }
                    })
                }
                else if (this.state.infusionsClicked[index]) {
                    let pickedInfusions = this.state.pickedInfusions;
                    const infusionsClicked = this.state.infusionsClicked;
                    infusionsClicked[index] = false;
                    pickedInfusions = pickedInfusions.filter((val: any) => item.name !== val.name);
                    this.setState({ pickedInfusions }, () => {
                        this.props.loadInfusions(this.state.pickedInfusions)
                    })
                    this.props.infusionsToPick(true)
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <AppText>As an Artificer you are now able to choose your infusions. more infusions will be unlocked at later levels.</AppText>
                    <AppText>Every level up you are eligible to switch one infusion you already picked with another.</AppText>
                </View>
                {infusionList.infusions.concat(this.state.replicatedItems).map((item: any, index: number) =>
                    <View key={item.name}>
                        {this.state.disabledInfusions[index] && <AppText padding={5} color={Colors.danger} textAlign={'center'}>This Infusion has a level requirement of {item.perReq}</AppText>}
                        <TouchableOpacity style={[styles.item, {
                            backgroundColor: this.state.disabledInfusions[index] ? Colors.earthYellow : this.state.infusionsClicked[index] ?
                                Colors.bitterSweetRed : Colors.lightGray
                        }]} disabled={this.state.disabledInfusions[index]}
                            onPress={() => { this.setInfusions(item, index) }}>
                            <AppText color={Colors.whiteInDarkMode} fontSize={18} textAlign={'center'}>{item.name}</AppText>
                            <AppText color={Colors.whiteInDarkMode} fontSize={15} textAlign={'center'}>{item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                        </TouchableOpacity>
                    </View>
                )}
                <View>
                    <AppText>Replicate Magic Item</AppText>
                    <AppText>One of the infusions you can pick is the ability to replicate a specific magical item</AppText>
                    <AppText>You can pick this infusion for each item you wish to know how to replicate.</AppText>
                    <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => this.setState({ itemReplicationModal: true })}
                        fontSize={18} borderRadius={25} width={120} height={65} title={"Add item replication"} />
                    <Modal visible={this.state.itemReplicationModal}>
                        <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                            <AppTextInput onChangeText={(magicalItemName: string) => this.setState({ magicalItemName })} placeholder={'Item name...'} />
                            <AppTextInput onChangeText={(magicalItemDescription: string) => this.setState({ magicalItemDescription })} placeholder={'Item description...'} />
                            <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => {
                                const replicatedItems = [...this.state.replicatedItems];
                                replicatedItems.push({ name: this.state.magicalItemName, description: this.state.magicalItemDescription, replicatedItem: true })
                                this.setState({ replicatedItems, itemReplicationModal: false, magicalItemName: '', magicalItemDescription: '' })
                            }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Add Magical Infusion"} />
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, item: {
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    },
});