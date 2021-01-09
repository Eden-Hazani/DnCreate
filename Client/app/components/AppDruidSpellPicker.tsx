import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';
import spellsJSON from '../../jsonDump/spells.json'
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { Colors } from '../config/colors';
import { AppActivityIndicator } from './AppActivityIndicator';
import { store } from '../redux/store';
import logger from '../../utility/logger';


interface AppDruidSpellPickerState {
    character: CharacterModel
    circlePicked: any
    updateSpellGroup: boolean
    circleClicked: boolean[]
    beforeChangeChar: CharacterModel
    loading: boolean
}

export class AppDruidSpellPicker extends Component<{ pickDruidCircle: any, character: CharacterModel, path: any, loadSpells: any, items: any }, AppDruidSpellPickerState> {
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            beforeChangeChar: JSON.parse(JSON.stringify(this.props.character)),
            circleClicked: [],
            updateSpellGroup: false,
            circlePicked: null,
            character: this.props.character
        }
    }
    componentDidMount() {
        this.props.pickDruidCircle(true)
    }
    componentWillUnmount() {
        this.props.pickDruidCircle(false)
    }

    updateChar = () => {
        try {
            const character = { ...this.state.character };
            character.path = this.props.path;
            if (this.state.circlePicked && character.charSpecials) {
                this.setState({ loading: true })
                character.charSpecials.druidCircle = this.state.circlePicked.name;
                this.setState({ character }, () => {
                    this.props.loadSpells(this.state.character)
                    this.setState({ loading: false })
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickCircle = (item: any, index: number) => {
        try {
            let circlePicked = this.state.circlePicked;
            if (!this.state.circleClicked[index]) {
                if (this.state.circlePicked !== null) {
                    alert('You can only pick one Circle.')
                    return;
                }
                const circleClicked = this.state.circleClicked;
                circleClicked[index] = true;
                circlePicked = item;
                this.setState({ circleClicked, circlePicked }, () => {
                    this.updateChar();
                    this.props.pickDruidCircle(false)
                })
            }
            else if (this.state.circleClicked[index]) {
                const circleClicked = this.state.circleClicked;
                circleClicked[index] = false;
                circlePicked = null
                this.setState({ character: this.state.beforeChangeChar, circleClicked, circlePicked }, () => {
                    this.updateChar();
                    this.props.pickDruidCircle(true)
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <AppText color={Colors.bitterSweetRed} fontSize={22} textAlign={'center'}>As a level {this.state.character.level} {this.props.path.name} You have the choice to pick your Circle background.</AppText>
                {this.props.items.map((group: any, index: number) =>
                    <TouchableOpacity style={[styles.pickable, { backgroundColor: this.state.circleClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                        key={group.name} onPress={() => { this.pickCircle(group, index) }}>
                        <AppText fontSize={20}>{group.name}</AppText>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, pickable: {
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderColor: Colors.berries,
        borderWidth: 1,
        borderRadius: 15
    }
});