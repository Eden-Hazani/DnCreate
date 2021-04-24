import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import userCharApi from '../api/userCharApi';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppActivityIndicator } from './AppActivityIndicator';
import { AppButton } from './AppButton';
import { AppTextInput } from './forms/AppTextInput';

interface ChangeMaxHpState {
    maxHp: number
    character: CharacterModel
    loading: boolean
}
export class ChangeMaxHp extends Component<{ currentMax: any, sendNewMax: any, character: CharacterModel }, ChangeMaxHpState>{
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            maxHp: this.props.currentMax,
            character: this.props.character
        }
    }

    confirm = () => {
        this.setState({ loading: true })
        const character = { ...this.state.character };
        character.maxHp = this.state.maxHp;
        this.setState({ character }, () => {
            userCharApi.updateChar(this.state.character).then(() => this.props.sendNewMax())
        })
    }
    render() {
        return (
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <AppTextInput onChangeText={(maxHp: string) => this.setState({ maxHp: parseInt(maxHp) })}
                    placeholder={'Enter Max Hp'} keyboardType={'numeric'} />
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View>
                        <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => this.confirm()}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"Continue"} />

                        <AppButton padding={20} backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.sendNewMax(this.state.maxHp)}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"Cancel"} />
                    </View>

                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});