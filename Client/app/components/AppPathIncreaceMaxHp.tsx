import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppPathIncreaseMaxHpState {
    character: CharacterModel
}

export class AppPathIncreaseMaxHp extends Component<{ character: CharacterModel, increaseNum: number, loadMaxHp: any }, AppPathIncreaseMaxHpState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }
    componentDidMount() {
        try {
            const character = { ...this.state.character };
            if (character.maxHp) {
                character.maxHp = character.maxHp + this.props.increaseNum;
                this.setState({ character }, () => {
                    this.props.loadMaxHp(this.state.character)
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <AppText fontSize={18} textAlign={'center'}>You Max hp has increased by an extra 1 point due to your path choice.</AppText>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});