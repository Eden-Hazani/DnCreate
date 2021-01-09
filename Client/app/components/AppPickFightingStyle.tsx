import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppPickFightingState {
    fightingStyleClicked: boolean[],
    fightingStyle: any[]
    character: CharacterModel
}

export class AppPickFightingStyle extends Component<{ itemList: [], character: CharacterModel, loadFightingStyles: any, fightingStylesToPick: any }, AppPickFightingState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character,
            fightingStyleClicked: [],
            fightingStyle: []
        }
    }
    componentDidMount() {
        this.props.fightingStylesToPick(true)
    }
    componentWillUnmount() {
        this.props.fightingStylesToPick(false)
    }

    pickFightingStyle = (style: any, index: number) => {
        try {
            const character = { ...this.state.character }
            let fightingStyle = this.state.fightingStyle;
            if (this.state.character.charSpecials?.fightingStyle && !this.state.fightingStyleClicked[index] && character.charSpecials?.fightingStyle) {
                for (let item of this.state.character.charSpecials.fightingStyle) {
                    if (item.name === style.name) {
                        alert('You already have this fighting style.')
                        return;
                    }
                }
                if (this.state.fightingStyle.length >= 1) {
                    alert('You can only pick one fighting style.')
                    return;
                }
                const fightingStyleClicked = this.state.fightingStyleClicked;
                fightingStyleClicked[index] = true;
                character.charSpecials.fightingStyle.push(style);
                fightingStyle.push(style)
                this.setState({ fightingStyle, character, fightingStyleClicked }, () => {
                    this.props.loadFightingStyles(this.state.character)
                })
            }
            else if (this.state.fightingStyleClicked[index] && character.charSpecials?.fightingStyle) {
                const fightingStyleClicked = this.state.fightingStyleClicked;
                fightingStyleClicked[index] = false;
                character.charSpecials.fightingStyle = character.charSpecials.fightingStyle.filter((n: any) => n.name !== style.name)
                fightingStyle = fightingStyle.filter((n: any) => n.name !== style.name)
                this.setState({ fightingStyle, character, fightingStyleClicked }, () => {
                    this.props.loadFightingStyles(this.state.character)
                })
            }
            if (this.state.fightingStyle.length === 1) {
                this.props.fightingStylesToPick(false)
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {this.props.itemList.map((style: any, index: number) =>
                    <TouchableOpacity key={index} onPress={() => { this.pickFightingStyle(style, index) }} style={[styles.longTextItem,
                    { backgroundColor: this.state.fightingStyleClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                        <AppText fontSize={20} color={this.state.fightingStyleClicked[index] ? Colors.black : Colors.bitterSweetRed}>{style.name}</AppText>
                        <AppText>{style.description}</AppText>
                    </TouchableOpacity>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    longTextItem: {
        marginTop: 15,
        width: Dimensions.get('screen').width / 1.2,
        marginLeft: 15,
        padding: 20,
        borderRadius: 15

    }
});