import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AppText } from '../../../components/AppText';

interface Props {

}

export function LevelUpMetaMagic() {
    return (
        <View style={styles.container}>
            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}> level {this.props.character.level} {this.props.character.characterClass}</AppText>
            <AppText textAlign={'center'}>You now gain the ability to twist your spells to suit your needs.</AppText>
            <AppText textAlign={'center'}>You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.</AppText>
            {filterAlreadyPicked(this.props.options.metamagic.value, this.state.character.charSpecials && this.state.character.charSpecials.sorcererMetamagic ? this.state.character.charSpecials.sorcererMetamagic : []).map((magic: any, index: number) =>
                <TouchableOpacity key={index} onPress={() => { this.pickMetaMagic(magic, index) }} style={[styles.longTextItem, { backgroundColor: this.state.metamagicClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                    <AppText fontSize={20} color={this.state.metamagicClicked[index] ? Colors.black : Colors.bitterSweetRed}>{magic.name}</AppText>
                    <AppText>{magic.description}</AppText>
                </TouchableOpacity>)}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});