import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Config } from '../../../config';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';

export class SelectedParticipationAdv extends Component<{ navigation: any, route: any }> {

    render() {
        const adventure = this.props.route.params.adventure;
        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <AppText color={Colors.bitterSweetRed} fontSize={25}>{adventure.adventureName}</AppText>
                    <AppText> - World Setting - </AppText>
                    <AppText>{adventure.adventureSetting}</AppText>
                    <View style={{ paddingTop: 25 }}>
                        <AppText fontSize={20}>Party Members:</AppText>
                    </View>
                </View>
                <View style={styles.party}>
                    <FlatList
                        data={adventure.participants_id}
                        keyExtractor={(currentParticipants, index) => index.toString()}
                        renderItem={({ item }) => <ListItem
                            title={item.name}
                            subTitle={item.characterClass}
                            imageUrl={`${Config.serverUrl}/assets/${item.image}`}
                            direction={'row'}
                            headerFontSize={18}
                            headColor={Colors.bitterSweetRed}
                            subFontSize={15}
                            padding={20} width={60} height={60}
                            headTextAlign={"left"}
                            subTextAlign={"left"}
                            justifyContent={"flex-start"} textDistanceFromImg={10} />}
                        ItemSeparatorComponent={ListItemSeparator} />
                </View>
                <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => { this.props.navigation.navigate('Adventures') }}
                    fontSize={18} borderRadius={25} width={120} height={65} title={"Back"} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    party: {

    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
});