import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';

export class AttackRollTutorial extends Component<{ closeWindow: any }> {
    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ margin: 20 }}>
                    <AppText textAlign={'center'} fontSize={25}>Attack Roll Tutorial</AppText>
                </View>
                <View style={styles.item}>
                    <AppText textAlign={'center'} fontSize={18}>Your race, class, and feats can grant you proficiency with certain Weapons or categories of Weapons. The two categories are simple and martial.</AppText>
                    <AppText textAlign={'center'} fontSize={18} >Proficiency with a weapon allows you to add your Proficiency Bonus to the Attack roll for any Attack you make with that weapon. {'\n'} If you make an Attack roll using a weapon with which you lack proficiency, you do not add your Proficiency Bonus to the Attack roll.</AppText>
                </View>
                <View style={styles.item}>
                    <AppText textAlign={'center'} fontSize={25} color={Colors.totalWhite}>Example:</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Say you have a +3 to strength, and a proficiency bonus of +2</AppText>
                    <AppText textAlign={'center'} fontSize={18}>In this example the character is not proficient with martial weapons but is proficient with simple weapons.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>If the character attacks with a long sword (categorized as a martial weapon) the attack roll will NOT include the proficiency bonus and will just be +3 (from the strength modifier).</AppText>
                    <AppText textAlign={'center'} fontSize={18}>If the character attacks with a simple club (categorized as a simple weapon) the attack roll WILL include the proficiency bonus and will be +3 (from the strength modifier) AND +2 (from the proficiency bonus).</AppText>
                    <AppText textAlign={'center'} fontSize={18}>The damage roll will be the character's hit die (in this case D10) plus the ability modifier associated with the weapon </AppText>
                </View>
                <View style={styles.item}>
                    <AppText textAlign={'center'} fontSize={18}>PHB Page 149 lists all weapons and is split into four categories. Simple Melee, Simple Ranged, Martial Melee, Martial Ranged. {'\n'}
                        If you are proficient in simple weapons you are proficient in all Simple Melee and Simple Ranged weapons listed on that page.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>For More information regarding exactly what modifier fits what type of weapon consult the PHB</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Generally the following is the norm:</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Attacks with ranged weapons usually use your DEX modifier.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Attacks with melee weapons usually use your STR modifier.</AppText>
                </View>
                <View style={{ margin: 10 }}>
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Close'} onPress={() => { this.props.closeWindow(false) }} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, item: {
        padding: 5,
        margin: 10,
        backgroundColor: Colors.pinkishSilver,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 15
    }
});