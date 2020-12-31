import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { store } from '../redux/store';
import { AppText } from './AppText';

interface AppPathMonkFourElementsPickerState {
    beforeChangeChar: CharacterModel,
    loading: boolean
    elementClicked: boolean[]
    pickedElements: any[]
    extraElementChange: boolean
    fullElementList: any[]
}


export class AppPathMonkFourElementsPicker extends Component<{
    character: CharacterModel, firstElement: any, totalElementsToPick: any,
    item: any, loadElements: any, pathChosen: any, elementsToPick: any
}, AppPathMonkFourElementsPickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            fullElementList: [],
            beforeChangeChar: new CharacterModel(),
            extraElementChange: false,
            pickedElements: [],
            elementClicked: [],
            loading: true
        }
    }


    getFromStorage = async () => {
        try {
            if (this.props.character.level) {
                const beforeChangeCharString = await AsyncStorage.getItem(`current${this.props.character._id}level${this.props.character.level - 1}`)
                if (beforeChangeCharString) {
                    this.setState({ beforeChangeChar: JSON.parse(beforeChangeCharString) })
                }
            }
        } catch (err) {
            logger.log(err)
        }
    }

    componentDidMount() {
        try {
            if (this.props.character.level) {
                const fullElementList = this.props.item.filter((val: any) => this.props.character.level && (val.prerequisite <= this.props.character.level));
                this.setState({ fullElementList })
                this.getFromStorage().then(() => {
                    let storeItem = store.getState().character.charSpecials?.monkElementsDisciplines
                    if (storeItem) {
                        this.setState({ pickedElements: storeItem }, () => {
                            if (this.props.character.level === 3) {
                                const pickedElements = this.state.pickedElements;
                                pickedElements.push(this.props.firstElement);
                                this.setState({ pickedElements })
                            }
                        })
                        this.state.fullElementList.forEach((item: any, index: number) => this.state.beforeChangeChar.charSpecials?.monkElementsDisciplines &&
                            this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.forEach(val => {
                                if (item.name === val.name) {
                                    this.state.elementClicked[index] = true
                                }
                            }))
                        this.props.elementsToPick(true)
                        this.setState({ loading: false })
                    }
                })
            }
        } catch (err) {
            logger.log(err)
        }
    }

    componentWillUnmount() {
        this.props.elementsToPick(false)
    }




    setElements = (item: any, index: number) => {
        try {
            if (this.state.beforeChangeChar.charSpecials?.monkElementsDisciplines && this.state.beforeChangeChar.level) {
                for (let unit of this.state.beforeChangeChar.charSpecials.monkElementsDisciplines) {
                    if (unit.name === item.name && this.state.beforeChangeChar.level > 3 && this.state.elementClicked[index]) {
                        if (this.state.extraElementChange) {
                            alert('You can only change one Element you previously picked');
                            return;
                        }
                        let pickedElements = this.state.pickedElements;
                        const elementClicked = this.state.elementClicked;
                        elementClicked[index] = false;
                        pickedElements = pickedElements.filter((val: any) => item.name !== val.name);
                        this.setState({ pickedElements, extraElementChange: true }, () => {
                            this.props.loadElements(this.state.pickedElements)
                        })
                        this.props.elementsToPick(true)
                        return;
                    }
                    if (unit.name === item.name && this.state.beforeChangeChar.level > 3 && !this.state.elementClicked[index]) {
                        if (this.state.pickedElements.length === this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.length + this.props.totalElementsToPick) {
                            alert(`You have ${(this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.length - 1) + this.props.totalElementsToPick} element disciplines to pick`)
                            return;
                        }
                        let pickedElements = this.state.pickedElements;
                        const elementClicked = this.state.elementClicked;
                        elementClicked[index] = true;
                        pickedElements.push(item);
                        this.setState({ pickedElements, extraElementChange: false }, () => {
                            this.props.loadElements(this.state.pickedElements)
                            if (this.state.beforeChangeChar.charSpecials?.monkElementsDisciplines &&
                                (this.state.pickedElements.length === this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.length + this.props.totalElementsToPick)) {
                                this.props.elementsToPick(false)
                            }
                        })
                        return;
                    }
                }
                if (!this.state.elementClicked[index]) {
                    if (this.state.pickedElements.length === this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.length + this.props.totalElementsToPick) {
                        alert(`You have ${(this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.length - 1) + this.props.totalElementsToPick} element disciplines to pick`);
                        return;
                    }
                    const pickedElements = this.state.pickedElements;
                    const elementClicked = this.state.elementClicked;
                    elementClicked[index] = true;
                    pickedElements.push(item);
                    this.setState({ pickedElements }, () => {
                        this.props.loadElements(this.state.pickedElements)
                        if (this.state.beforeChangeChar.charSpecials?.monkElementsDisciplines &&
                            (this.state.pickedElements.length === this.state.beforeChangeChar.charSpecials.monkElementsDisciplines.length + this.props.totalElementsToPick)) {
                            this.props.elementsToPick(false)
                        }
                    })
                }
                else if (this.state.elementClicked[index]) {
                    let pickedElements = this.state.pickedElements;
                    const elementClicked = this.state.elementClicked;
                    elementClicked[index] = false;
                    pickedElements = pickedElements.filter((val: any) => item.name !== val.name);
                    this.setState({ pickedElements }, () => {
                        this.props.loadElements(this.state.pickedElements)
                    })
                    this.props.elementsToPick(true)
                }
            }
        } catch (err) {
            logger.log(err)
        }
    }
    render() {
        let storeItem = store.getState().character.charSpecials?.monkElementsDisciplines;
        return (
            <View style={styles.container}>
                {this.props.character.level && this.props.character.level > 3 &&
                    <AppText>At Level {this.props.character.level} you can pick {(storeItem && storeItem.length - 1) + this.props.totalElementsToPick} Elements</AppText>
                }
                {this.state.fullElementList.map((item: any, index: number) =>
                    <View key={`${index}${item.name}`}>
                        <TouchableOpacity style={[styles.item, { backgroundColor: this.state.elementClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                            onPress={() => { this.setElements(item, index) }}>
                            <AppText color={Colors.whiteInDarkMode} fontSize={18} textAlign={'center'}>{item.name}</AppText>
                            <AppText color={Colors.whiteInDarkMode} fontSize={15} textAlign={'center'}>{item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                        </TouchableOpacity>
                    </View>
                )}
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