import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../config/colors';
import { AppText } from './AppText';

export class AppPathWeaponAdding extends Component<{ weaponList: any, loadWeapons: any }>{
    componentDidMount() {
        this.props.loadWeapons(this.props.weaponList)
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={'center'} fontSize={22}>Weapon proficiencies added:</AppText>
                {this.props.weaponList.map((weapon: any, index: number) =>
                    <View key={index}>
                        <AppText fontSize={20} color={Colors.berries}>{weapon}</AppText>
                    </View>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.pinkishSilver,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 15,
        padding: 15,
        margin: 5
    }
});