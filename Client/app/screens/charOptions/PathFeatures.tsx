import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

interface PathFeaturesState {
    loading: boolean
    character: CharacterModel
    pathFeatures: any[]
}

export class PathFeatures extends Component<{ route: any }, PathFeaturesState> {
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            character: this.props.route.params.char,
            pathFeatures: this.props.route.params.char.pathFeatures
        }
    }
    componentDidMount() {
        console.log(this.props.route.params.char.pathFeatures)
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
                            <AppText fontSize={20}>Level {this.state.character.level} {this.state.character.characterClass} Path Features</AppText>
                        </View>
                        {this.state.pathFeatures.map((feature: any) => {
                            return feature.name && <View key={feature.name} style={styles.item}>
                                <AppText fontSize={28} color={Colors.berries}>{feature.name}</AppText>
                                {feature.description && <AppText fontSize={20}>{feature.description.replace(/\. /g, '.\n\n')}</AppText>}
                                {feature.choice ?
                                    <View style={{ marginTop: 15 }}>
                                        {feature.choice.map((choice: any) =>
                                            <View key={choice.name}>
                                                <AppText textAlign={'center'} fontSize={28} color={Colors.berries}>{choice.name}</AppText>
                                                <AppText textAlign={'center'} fontSize={20}>{choice.description.replace(/\. /g, '.\n\n')}</AppText>
                                            </View>
                                        )}
                                    </View>
                                    : null}
                            </View>
                        })}
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
        backgroundColor: Colors.pinkishSilver
    }
});