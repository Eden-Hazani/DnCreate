import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppForm } from '../../components/forms/AppForm';
import * as Yup from 'yup';
import { AppText } from '../../components/AppText';
import { AppFormField } from '../../components/forms/AppFormField';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { AppPicker } from '../../components/AppPicker';
import { CharacterModel } from '../../models/characterModel';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import colors from '../../config/colors';
import adventureApi from '../../api/adventureApi';
import { AdventureModel } from '../../models/AdventureModel';
import errorHandler from '../../../utility/errorHander';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';

const ValidationSchema = Yup.object().shape({
    adventureIdentifier: Yup.string().required().label("Adventure Identifier"),
})

interface JoinAdventureState {
    loading: boolean
    characters: CharacterModel[]
    pickedCharacter: CharacterModel
    confirmedAdventure: AdventureModel
}

export class JoinAdventure extends Component<{ props: any, navigation: any }, JoinAdventureState>{
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            confirmedAdventure: null,
            pickedCharacter: new CharacterModel(),
            characters: []
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    onFocus = () => {
        const characters = store.getState().characters;
        this.setState({ characters: characters })
    }
    async componentDidMount() {
        const characters = await userCharApi.getChars(this.context.user._id);
        this.setState({ characters: characters.data })
    }

    findAdventure = async (values: any) => {
        this.setState({ loading: true })
        await adventureApi.findAdventure(values.adventureIdentifier).then(confirmedAdventure => {
            if (!confirmedAdventure.ok) {
                this.setState({ loading: false })
                alert(confirmedAdventure.data);
                return;
            }
            this.setState({ confirmedAdventure: confirmedAdventure.data[0], loading: false })
        })
    }

    joinAdventure = () => {
        this.setState({ loading: true })
        if (!this.state.pickedCharacter._id) {
            this.setState({ loading: false })
            alert("Must Pick A Character");
            return
        }
        const confirmedAdventure = { ...this.state.confirmedAdventure };
        const pickedChar: any = this.state.pickedCharacter._id;
        confirmedAdventure.participants_id.push(pickedChar);
        this.setState({ confirmedAdventure }, async () => {
            adventureApi.updateAdventure(this.state.confirmedAdventure).then(adventure => {
                if (!adventure.ok) {
                    this.setState({ loading: false })
                    alert(adventure.data);
                    return;
                }
                store.dispatch({ type: ActionType.UpdateParticipatingAdv, payload: adventure.data })
                this.setState({ loading: false })
                this.props.navigation.navigate("Adventures")
            });
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    !this.state.confirmedAdventure ?
                        <AppForm
                            initialValues={{ adventureIdentifier: '' }}
                            onSubmit={(values: any) => this.findAdventure(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ flex: 1 }}>
                                <View style={{ height: Dimensions.get('screen').height / 5, paddingTop: 35 }}>
                                    <AppText fontSize={18} textAlign={'center'}>Adventure Identifier</AppText>
                                    <AppFormField
                                        keyboardType={'numeric'}
                                        fieldName={"adventureIdentifier"}
                                        name="adventureIdentifier"
                                        iconName={"text-short"}
                                        placeholder={"Adventure Identifier..."} />
                                </View>
                                <View style={{ height: Dimensions.get('screen').height / 5 }}>
                                    <SubmitButton width={250} title={"Find Adventure"} />
                                </View>
                                <View style={{ height: Dimensions.get('screen').height / 5 }}>
                                    <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed}
                                        borderRadius={100} width={250} height={100} title={"Cancel"} onPress={() => { this.props.navigation.navigate('Adventures') }} />
                                </View>
                            </View>
                        </AppForm>
                        :
                        <View>
                            <View style={styles.adventure}>
                                <AppText fontSize={25} color={colors.bitterSweetRed}>Adventure name - {this.state.confirmedAdventure.adventureName}</AppText>
                                <AppText fontSize={16}>Setting:</AppText>
                                <AppText fontSize={16}>{this.state.confirmedAdventure.adventureSetting}</AppText>
                            </View>
                            <AppText fontSize={18} textAlign={'center'}>Pick Character</AppText>
                            <AppPicker itemList={this.state.characters} selectedItemIcon={null} itemColor={colors.bitterSweetRed}
                                selectedItem={this.state.pickedCharacter.name} selectItem={(pickedCharacter: any) => { this.setState({ pickedCharacter: pickedCharacter }) }}
                                numColumns={3} placeholder={"Pick Character"} iconName={"apps"} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                                <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed}
                                    borderRadius={100} width={120} height={70} title={"Join Adventure!"} onPress={() => { this.joinAdventure() }} />
                                <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed}
                                    borderRadius={100} width={120} height={70} title={"Cancel"} onPress={() => { this.props.navigation.navigate('Adventures') }} />

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
    },
    adventure: {
        paddingTop: 50,
        paddingBottom: 20,
        justifyContent: "center",
        alignItems: "center"
    },
});