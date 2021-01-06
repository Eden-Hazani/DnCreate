import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import { Easing } from 'react-native-reanimated';
import { Config } from '../../config';
import { AppText } from '../components/AppText';
import { IconGen } from '../components/IconGen';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';

interface PersonalNotesState {
    dropAnimationI: Animated.ValueXY,
    dropAnimationII: Animated.ValueXY,
    dropAnimationIII: Animated.ValueXY,
    character: CharacterModel
}

export class PersonalNotes extends Component<{ navigation: any, route: any }, PersonalNotesState>{
    constructor(props: any) {
        super(props)
        this.state = {
            dropAnimationI: new Animated.ValueXY({ x: 0, y: -700 }),
            dropAnimationII: new Animated.ValueXY({ x: 0, y: -700 }),
            dropAnimationIII: new Animated.ValueXY({ x: 0, y: -700 }),
            character: this.props.route.params.char
        }
    }

    dropAnimationIStart = () => {
        Animated.timing(this.state.dropAnimationI, {
            toValue: { x: 0, y: 0 },
            duration: 300,
            useNativeDriver: false,
            easing: Easing.linear as any
        }).start()
    }
    dropAnimationIIStart = () => {
        Animated.timing(this.state.dropAnimationII, {
            toValue: { x: 0, y: 0 },
            duration: 400,
            useNativeDriver: false,
            easing: Easing.linear as any
        }).start()
    }
    dropAnimationIIIStart = () => {
        Animated.timing(this.state.dropAnimationIII, {
            toValue: { x: 0, y: 0 },
            duration: 600,
            useNativeDriver: false,
        }).start()
    }
    componentDidMount() {
        this.dropAnimationIStart()
        this.dropAnimationIIStart()
        this.dropAnimationIIIStart()
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={this.state.dropAnimationI.getLayout()}>
                    <TouchableOpacity style={{ alignItems: "center" }}
                        onPress={() => { this.props.navigation.navigate("LocationNotes", { char: this.state.character }) }}>
                        <Image style={{ height: 110, width: 110 }} uri={`${Config.serverUrl}/assets/logos/locationsNotesIcon.png`} />
                        <View style={{ width: 90, marginTop: 10 }}>
                            <AppText textAlign="center" fontSize={20} color={Colors.whiteInDarkMode}>Locations</AppText>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
                <View style={styles.secRowIconContainer}>
                    <Animated.View style={this.state.dropAnimationII.getLayout()}>
                        <TouchableOpacity style={{ alignItems: "center" }}
                            onPress={() => { this.props.navigation.navigate("CitiesNotes", { char: this.state.character }) }}>
                            <Image style={{ height: 110, width: 110 }} uri={`${Config.serverUrl}/assets/logos/citiesNotesIcon.png`} />
                            <View style={{ width: 90, marginTop: 10 }}>
                                <AppText textAlign="center" fontSize={20} color={Colors.whiteInDarkMode}>Cities</AppText>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={this.state.dropAnimationII.getLayout()}>
                        <TouchableOpacity style={{ alignItems: "center" }}
                            onPress={() => { this.props.navigation.navigate("PeopleNotes", { char: this.state.character }) }}>
                            <Image style={{ height: 110, width: 110 }} uri={`${Config.serverUrl}/assets/logos/peopleNotesIcon.png`} />
                            <View style={{ width: 90, marginTop: 10 }}>
                                <AppText textAlign="center" fontSize={20} color={Colors.whiteInDarkMode}>People</AppText>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Animated.View style={this.state.dropAnimationIII.getLayout()}>
                    <TouchableOpacity style={{ alignItems: "center" }}
                        onPress={() => { this.props.navigation.navigate("OtherNotes", { char: this.state.character }) }}>
                        <Image style={{ height: 110, width: 110 }} uri={`${Config.serverUrl}/assets/logos/otherNotesIcon.png`} />
                        <View style={{ width: 90, marginTop: 10 }}>
                            <AppText textAlign="center" fontSize={20} color={Colors.whiteInDarkMode}>Other</AppText>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        height: '100%'
    },
    secRowIconContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
});