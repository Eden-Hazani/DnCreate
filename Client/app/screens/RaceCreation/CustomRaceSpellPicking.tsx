import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Switch } from 'react-native-gesture-handler';
import spellList from '../../../jsonDump/spells.json'
import logger from '../../../utility/logger';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import InformationDrawer from '../../components/InformationDrawer';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Colors } from '../../config/colors';
import { CustomSpellModal } from '../../models/CustomSpellModal';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CustomRaceSpellPickingState {
    search: string,
    shownSpells: any[]
    customRace: RaceModel
    confirmed: boolean
    activatedInterface: boolean
}
export class CustomRaceSpellPicking extends Component<{ navigation: any }, CustomRaceSpellPickingState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            activatedInterface: false,
            confirmed: false,
            search: '',
            shownSpells: [],
            customRace: store.getState().customRace
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);

    }
    componentWillUnmount() {
        this.navigationSubscription()
    }
    onFocus = () => {
        const customRace = { ...this.state.customRace };
        const pickedSpells = store.getState().customRace.addedSpells;
        if (this.state.confirmed) {
            this.setState({ confirmed: false })
        }
        if (pickedSpells && pickedSpells?.length > 0) {
            customRace.addedSpells = pickedSpells
            this.setState({ customRace, activatedInterface: true })
        }
    }

    updateSearch = (search: string) => {
        try {
            this.setState({ search })
            if (search.trim() === "") {
                this.resetList()
                return;
            }
            const shownSpells: any[] = [];
            for (let item of spellList) {
                if (item.name.includes(search)) {
                    shownSpells.push(item);
                }
            }
            this.setState({ shownSpells })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    resetList = () => {
        try {
            this.setState({ search: '', shownSpells: [] })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    addSpell = (item: any) => {
        const customRace = { ...this.state.customRace }
        if (!customRace.addedSpells) {
            customRace.addedSpells = []
        }
        if (customRace.addedSpells?.includes(item.name)) {
            const newSpells = customRace.addedSpells.filter((currentSpell, index) => currentSpell !== item.name);
            customRace.addedSpells = newSpells
            this.setState({ customRace })
            return
        } else {
            customRace.addedSpells.push(item.name);
            this.setState({ customRace })
        }
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.addedSpells && this.state.customRace.addedSpells) {
                storeItem.addedSpells = this.state.customRace.addedSpells
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceExtraLanguages");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }

    removeFeatureSwitch = () => {
        const customRace = { ...this.state.customRace };
        customRace.addedSpells = [];
        this.setState({ customRace, shownSpells: [] })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                            <AppText color={Colors.berries} textAlign={'center'} fontSize={25}>Starting Spells</AppText>
                            <AppText textAlign={'center'} fontSize={18}>Does this race have any base spells that come with it?</AppText>
                            <AppText textAlign={'center'} fontSize={18}>Here you can choose any spell from the spell book, the spells you choose will be available to this race at level 1</AppText>
                            <Switch value={this.state.activatedInterface} onValueChange={() => {
                                if (this.state.activatedInterface) {
                                    if (store.getState().customRaceEditing) {
                                        Alert.alert("Remove", "This will remove all selected items", [{
                                            text: 'Yes', onPress: () => {
                                                this.setState({ activatedInterface: false }, () => {
                                                    this.removeFeatureSwitch()
                                                })
                                            }
                                        }, { text: 'No' }])
                                        return
                                    }
                                    this.setState({ activatedInterface: false });
                                    return
                                }
                                this.setState({ activatedInterface: true })
                            }} />
                        </View>
                        {this.state.activatedInterface &&
                            <>
                                {this.state.customRace.addedSpells && this.state.customRace.addedSpells?.length > 0 &&
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <InformationDrawer expendedHeight={400}
                                            headLine={'Picked Spells'}
                                            expendedWidth={Dimensions.get('screen').width}
                                            information={
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <AppText color={Colors.totalWhite} fontSize={18}>Picked Spells</AppText>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        {this.state.customRace.addedSpells.map((item, index) => {
                                                            return <View key={index} style={{
                                                                margin: 3,
                                                                backgroundColor: Colors.bitterSweetRed,
                                                                padding: 15, borderRadius: 15
                                                            }}>
                                                                <AppText textAlign={'center'}>{item}</AppText>
                                                            </View>
                                                        })}
                                                    </View>
                                                </View>
                                            } />
                                    </View>

                                }
                                <SearchBar
                                    containerStyle={{ backgroundColor: Colors.pageBackground }}
                                    inputContainerStyle={{ backgroundColor: Colors.pageBackground }}
                                    lightTheme={Colors.pageBackground === "#121212" ? false : true}
                                    placeholder="Search For Spell"
                                    onChangeText={this.updateSearch}
                                    value={this.state.search}
                                />
                                {this.state.shownSpells.length > 0 &&
                                    <View style={{ height: 250 }}>
                                        <FlatList
                                            data={this.state.shownSpells}
                                            keyExtractor={(spells: any, index: any) => index.toString()}
                                            onEndReachedThreshold={1}
                                            renderItem={({ item }: any) => <TouchableOpacity
                                                style={{ backgroundColor: this.state.customRace.addedSpells?.includes(item.name) ? Colors.bitterSweetRed : Colors.lightGray }}
                                                onPress={() => {
                                                    this.addSpell(item)
                                                }}>
                                                <AppText>{item.name}</AppText>
                                                <AppText>{`Spell level: ${item.type}`}</AppText>
                                                <AppText>{`Classes: ${item.classes}`}</AppText>
                                            </TouchableOpacity>}
                                            ItemSeparatorComponent={ListItemSeparator} />
                                    </View>

                                }
                            </>
                        }
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Continue'} onPress={() => { this.confirmAndContinue() }} />
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});