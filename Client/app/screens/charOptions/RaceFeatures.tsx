import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

interface RaceFeaturesState {
    loading: boolean
    character: CharacterModel
}

export class RaceFeatures extends Component<{ route: any }, RaceFeaturesState> {
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            character: this.props.route.params.char,
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 800);
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.loading ?
                    <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText fontSize={20}>{this.state.character.race} Race Features</AppText>
                        </View>
                        <View style={[styles.featureItem, { backgroundColor: Colors.pinkishSilver }]}>
                            <AppText fontSize={20} padding={10} color={Colors.black} textAlign={'left'}>Age:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.age}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.black} textAlign={'left'}>Alignment:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.alignment}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.black} textAlign={'left'}>Languages:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.languages}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.black} textAlign={'left'}>Size:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.size}</AppText>
                            <AppText fontSize={18} padding={10} color={Colors.berries} textAlign={'center'}>Speed: {this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.speed}ft</AppText>
                        </View>
                        {this.state.character.charSpecials && this.state.character.charSpecials.dragonBornAncestry &&
                            <View style={styles.featureItem}>
                                <AppText fontSize={22} padding={10} color={Colors.black} textAlign={'center'}>Your Dragon ancestry feature</AppText>
                                <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.charSpecials && this.state.character.charSpecials.dragonBornAncestry.color} dragon ancestry</AppText>
                                <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.charSpecials && this.state.character.charSpecials.dragonBornAncestry.damageType} damage type</AppText>
                                <AppText fontSize={20} padding={5} color={Colors.black} textAlign={'center'}>Attack style</AppText>
                                <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.character.charSpecials && this.state.character.charSpecials.dragonBornAncestry.breath}</AppText>
                            </View>
                        }
                        {this.state.character.raceId && this.state.character.raceId.raceAbilities?.uniqueAbilities &&
                            Object.values(this.state.character.raceId.raceAbilities.uniqueAbilities)
                                .map((item, index) => <View key={index} style={styles.featureItem}>
                                    <AppText fontSize={22}>{item.name}</AppText>
                                    <AppText fontSize={17}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                                </View>)
                        }
                        {this.state.character.addedRaceFeatures?.map((item, index) => <View key={index} style={styles.featureItem}>
                            <AppText fontSize={22}>{item.name}</AppText>
                            <AppText fontSize={17}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                        </View>)}
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.berries,
    },
    featureItem: {
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.berries,
        backgroundColor: Colors.pinkishSilver
    }
});