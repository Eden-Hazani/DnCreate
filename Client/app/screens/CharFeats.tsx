import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { AppText } from '../components/AppText';
import { ListItem } from '../components/ListItem';
import { ListItemSeparator } from '../components/ListItemSeparator';
import colors from '../config/colors';
import { CharacterModel } from '../models/characterModel';

export class CharFeats extends Component<{ navigation: any, route: any }> {
    render() {
        const character: CharacterModel = this.props.route.params.char;
        return (
            <View>
                <View style={{ alignItems: "center", paddingTop: 15 }}>
                    <AppText fontSize={25} color={colors.bitterSweetRed}>{character.name}'s Feats</AppText>
                </View>
                <View style={styles.container}>
                    <FlatList
                        style={{ marginBottom: 50 }}
                        data={character.feats}
                        keyExtractor={(feats, index) => index.toString()}
                        renderItem={({ item }) => <ListItem
                            title={`Feat: ${item.name}`}
                            subTitle={item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}
                            direction={'row'}
                            headColor={colors.bitterSweetRed}
                            subColor={colors.black}
                            headerFontSize={20}
                            subFontSize={16}
                            padding={20} width={60} height={60}
                            headTextAlign={"left"}
                            subTextAlign={"left"}
                            justifyContent={"flex-start"} textDistanceFromImg={0}
                            onPress={() => { }}
                        />}
                        ItemSeparatorComponent={ListItemSeparator} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "flex-start"
    }
});