import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { AppText } from './AppText';

export class AppPathArmorAdding extends Component<{ armorList: any, loadArmors: any }>{

    componentDidMount() {
        try {
            this.props.loadArmors(this.props.armorList)
        } catch (err) {
            logger.log(err)
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={'center'} fontSize={22}>Armor proficiencies added:</AppText>
                {this.props.armorList.map((armor: any, index: number) =>
                    <View key={index}>
                        <AppText fontSize={20} color={Colors.totalWhite}>{armor}</AppText>
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