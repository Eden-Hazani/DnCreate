import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';
import { AppText } from './AppText';

export class AppPathArmorAdding extends Component<{ armorList: any, loadArmors: any }>{

    componentDidMount() {
        this.props.loadArmors(this.props.armorList)
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={'center'} fontSize={22}>Armor proficiencies added:</AppText>
                {this.props.armorList.map((armor: any, index: number) =>
                    <View key={index}>
                        <AppText fontSize={20} color={colors.totalWhite}>{armor}</AppText>
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