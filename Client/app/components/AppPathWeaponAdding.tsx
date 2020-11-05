import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';
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
                        <AppText fontSize={20} color={colors.totalWhite}>{weapon}</AppText>
                    </View>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.pinkishSilver,
        borderWidth: 1,
        borderColor: colors.berries,
        borderRadius: 15,
        padding: 15,
        margin: 5
    }
});