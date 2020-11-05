import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppAddingPathCantripState {
    character: CharacterModel
}

export class AppAddingPathCantrip extends Component<{ character: CharacterModel, path: any, updateCantrips: any, item: any }, AppAddingPathCantripState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }
    componentDidMount() {
        const character = { ...this.state.character };
        character.magic.cantrips = character.magic.cantrips + this.props.item.additionCantrip;
        this.setState({ character }, () => {
            this.props.updateCantrips(this.state.character)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={"center"} fontSize={18}>You now have {this.state.character.magic.cantrips} cantrips</AppText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});