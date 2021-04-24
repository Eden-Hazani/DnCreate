import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import colorMatcherRequest from '../api/getColorNames';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppActivityIndicator } from './AppActivityIndicator';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

interface PersonalInfoState {
    eyeColor: string
    hairColor: string
    skinColor: string
    loading: boolean
}

export class PersonalInfo extends Component<{ character: CharacterModel, close: any }, PersonalInfoState>{
    constructor(props: any) {
        super(props)
        this.state = {
            eyeColor: '',
            skinColor: '',
            hairColor: '',
            loading: true
        }
    }
    async componentDidMount() {
        this.getHairColor()
        this.getSkinColor()
        this.getEyeColor()
        this.setState({ loading: false })
    }

    getEyeColor = async () => {
        const cachedColor = await AsyncStorage.getItem(`${this.props.character._id}EyeColor`);
        if (cachedColor) {
            this.setState({ eyeColor: cachedColor })
            return
        }
        const result: any = await colorMatcherRequest(this.props.character.eyes);
        if (!result.ok) {
            this.setState({ eyeColor: this.props.character.eyes || '' })
            return
        }
        this.setState({ eyeColor: result.data.colors[0].name })
        AsyncStorage.setItem(`${this.props.character._id}EyeColor`, result.data.colors[0].name)
    }
    getHairColor = async () => {
        const cachedColor = await AsyncStorage.getItem(`${this.props.character._id}HairColor`);
        if (cachedColor) {
            this.setState({ hairColor: cachedColor })
            return
        }
        const result: any = await colorMatcherRequest(this.props.character.hair);
        if (!result.ok) {
            this.setState({ hairColor: this.props.character.hair || '' })
            return
        }
        this.setState({ hairColor: result.data.colors[0].name })
        AsyncStorage.setItem(`${this.props.character._id}HairColor`, result.data.colors[0].name)
    }
    getSkinColor = async () => {
        const cachedColor = await AsyncStorage.getItem(`${this.props.character._id}SkinColor`);
        if (cachedColor) {
            this.setState({ skinColor: cachedColor })
            return
        }
        const result: any = await colorMatcherRequest(this.props.character.skin);
        if (!result.ok) {
            this.setState({ skinColor: this.props.character.skin || '' })
            return
        }
        this.setState({ skinColor: result.data.colors[0].name })
        AsyncStorage.setItem(`${this.props.character._id}SkinColor`, result.data.colors[0].name)
    }

    checkIfLegalColor = (color: string) => {
        const regex = new RegExp("^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$");
        const answer = regex.test(color);
        return regex.test(color);
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: .8, justifyContent: "center", alignItems: "center" }}>
                            <AppText textAlign={'center'} fontSize={18}>Eye Color</AppText>
                            <View style={{
                                justifyContent: "center", backgroundColor: this.checkIfLegalColor(this.props.character.eyes || '')
                                    ? this.props.character.eyes : Colors.bitterSweetRed, borderWidth: 1,
                                height: 110, width: 110, padding: 15, borderRadius: 100, borderColor: Colors.whiteInDarkMode
                            }}>
                                <AppText textAlign={'center'} fontSize={18}>{this.state.eyeColor}</AppText>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ margin: 10 }}>
                                    <AppText textAlign={'center'} fontSize={18}>Skin color</AppText>
                                    <View style={{
                                        justifyContent: "center", backgroundColor: this.checkIfLegalColor(this.props.character.skin || '')
                                            ? this.props.character.skin : Colors.bitterSweetRed, borderWidth: 1,
                                        height: 110, width: 110, padding: 15, borderRadius: 100, borderColor: Colors.whiteInDarkMode
                                    }}>
                                        <AppText textAlign={'center'} fontSize={18}>{this.state.skinColor}</AppText>
                                    </View>
                                </View>
                                <View style={{ margin: 10 }}>
                                    <AppText textAlign={'center'} fontSize={18}>Hair Color</AppText>
                                    <View style={{
                                        justifyContent: "center", backgroundColor: this.checkIfLegalColor(this.props.character.hair || '')
                                            ? this.props.character.hair : Colors.bitterSweetRed, borderWidth: 1,
                                        height: 110, width: 110, padding: 15, borderRadius: 100, borderColor: Colors.whiteInDarkMode
                                    }}>
                                        <AppText textAlign={'center'} fontSize={18}>{this.state.hairColor}</AppText>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ margin: 10 }}>
                                    <AppText textAlign={'center'} fontSize={18}>Height</AppText>
                                    <View style={{
                                        justifyContent: "center", backgroundColor: Colors.bitterSweetRed, borderWidth: 1,
                                        height: 110, width: 110, padding: 15, borderRadius: 100, borderColor: Colors.whiteInDarkMode
                                    }}>
                                        <AppText textAlign={'center'} fontSize={18}>{this.props.character.height}</AppText>
                                    </View>
                                </View>
                                <View style={{ margin: 10 }}>
                                    <AppText textAlign={'center'} fontSize={18}>Weight</AppText>
                                    <View style={{
                                        justifyContent: "center", backgroundColor: Colors.bitterSweetRed, borderWidth: 1,
                                        height: 110, width: 110, padding: 15, borderRadius: 100, borderColor: Colors.whiteInDarkMode
                                    }}>
                                        <AppText textAlign={'center'} fontSize={18}>{this.props.character.weight}</AppText>
                                    </View>
                                </View>
                            </View>

                            {this.props.character.gender &&
                                <View>
                                    <AppText textAlign={'center'} fontSize={18}>Gender</AppText>
                                    <View style={{
                                        justifyContent: "center", backgroundColor: Colors.bitterSweetRed, borderWidth: 1,
                                        height: 110, width: 110, padding: 15, borderRadius: 100, borderColor: Colors.whiteInDarkMode
                                    }}>
                                        <AppText textAlign={'center'} fontSize={18}>{this.props.character.gender}</AppText>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{ flex: .2 }}>
                            <AppButton backgroundColor={Colors.bitterSweetRed} width={100} height={50} borderRadius={25}
                                title={'Close'} onPress={() => { this.props.close(false) }} />
                        </View>
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