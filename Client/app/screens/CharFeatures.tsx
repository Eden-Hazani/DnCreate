import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import * as features from '../classFeatures/features';
import { cos } from 'react-native-reanimated';
import { ListItem } from '../components/ListItem';
import { Colors } from '../config/colors';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { AppText } from '../components/AppText';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { Image } from 'react-native-expo-image-cache';
import { classesDragonsBackgrounds } from '../../utility/charClassesBackgrounds';

interface CharFeaturesState {
    charFeatures: any
    character: CharacterModel
    loading: boolean
}



export class CharFeatures extends Component<{ route: any }, CharFeaturesState> {
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            character: this.props.route.params.char,
            charFeatures: features.featurePicker(this.props.route.params.char.level, this.props.route.params.char.characterClass)
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 800);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ?
                    <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText fontSize={20}>Level {this.state.character.level} {this.state.character.characterClass} Features</AppText>
                        </View>
                        <Image uri={classesDragonsBackgrounds[this.state.character.characterClass || '']} style={{ width: 120, height: 120, alignSelf: "center" }} />
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={this.state.charFeatures.features}
                            keyExtractor={(features, index) => index.toString()}
                            renderItem={({ item }) => <ListItem
                                title={item.name}
                                subTitle={item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}
                                direction={'row'}
                                headColor={Colors.bitterSweetRed}
                                subColor={Colors.whiteInDarkMode}
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
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});