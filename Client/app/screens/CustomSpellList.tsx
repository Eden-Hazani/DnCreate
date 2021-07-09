import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Modal, Alert, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import ListItemDelete from '../components/ListItemDelete';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { SpellListItem } from '../components/SpellListItem';
import { Colors } from '../config/colors';
import { CustomSpellModal } from '../models/CustomSpellModal';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import logger from '../../utility/logger';
import { checkMarketSpellValidity } from './MarketPlace/functions/marketInteractions';
import { AddSpellToMarket } from '../components/spellMarketComponents/AddSpellToMarket';
import { RemoveSpellFromMarket } from '../components/spellMarketComponents/RemoveSpellFromMarket';
import AuthContext from '../auth/context';
import customSpellsTutorial from '../../jsonDump/customSpell.json'
import InformationScroller from '../components/InformationScroller'


interface CustomSpellListState {
    customSpellList: CustomSpellModal[];
    pickSpellModal: boolean;
    pickedSpell: CustomSpellModal;
    tutorialMode: boolean;
}

export class CustomSpellList extends Component<{ route: any, navigation: any }, CustomSpellListState>{
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            tutorialMode: false,
            pickedSpell: new CustomSpellModal(),
            customSpellList: [],
            pickSpellModal: false
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }

    onFocus = async () => {
        const stringCustomSpellList = await AsyncStorage.getItem('customSpellList');
        if (!stringCustomSpellList) {
            return
        }
        const customSpellList = JSON.parse(stringCustomSpellList);
        this.setState({ customSpellList })
    }

    async componentDidMount() {
        const stringCustomSpellList = await AsyncStorage.getItem('customSpellList');
        if (!stringCustomSpellList) {
            return
        }
        const customSpellList = JSON.parse(stringCustomSpellList);
        this.setState({ customSpellList })
    }

    handleDelete = async (item: CustomSpellModal) => {
        try {
            const stringCustomSpellList = await AsyncStorage.getItem('customSpellList');
            if (stringCustomSpellList) {
                const customSpellList = JSON.parse(stringCustomSpellList);
                const newCustomSpellList = customSpellList.filter((spell: CustomSpellModal) => spell._id !== item._id);
                await AsyncStorage.setItem('customSpellList', JSON.stringify(newCustomSpellList)).then(() => {
                    this.setState({ customSpellList: newCustomSpellList })
                });
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    refreshSpells = async (updatedSpell: CustomSpellModal) => {
        try {
            const stringCustomSpellList = await AsyncStorage.getItem('customSpellList');
            if (!stringCustomSpellList) {
                return
            }
            const customSpellList = JSON.parse(stringCustomSpellList);
            this.setState({ customSpellList, pickedSpell: updatedSpell })
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    marketPlaceNode = () => {
        const validity = checkMarketSpellValidity(this.state.pickedSpell.marketStatus, this.context.user._id);
        if (validity === 'NOT_OWNED') return <View>
            <AppText textAlign={'center'} color={Colors.metallicBlue} fontSize={22}>You are not the creator of this spell, as such you cannot add it to the market</AppText>
        </View>
        if (validity === 'OWNED_NOT_PUBLISHED') return <AddSpellToMarket refreshSpells={(updatedSpell: CustomSpellModal) => this.refreshSpells(updatedSpell)} spell={this.state.pickedSpell} />
        if (validity === 'OWNED_PUBLISHED') return <RemoveSpellFromMarket refreshSpells={(updatedSpell: CustomSpellModal) => this.refreshSpells(updatedSpell)} spell={this.state.pickedSpell} />
        return <View></View>
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: "space-around", flexDirection: 'row', width: Dimensions.get('window').width, paddingBottom: '5%' }}>
                    <TouchableOpacity style={{ padding: 10, borderRadius: 15, borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.paleGreen }}
                        onPress={() => { this.props.navigation.navigate("CustomSpellCreator", { edit: { true: false } }) }}>
                        <AppText color={Colors.totalWhite} textAlign={'center'} fontSize={22}>Create {'\n'}New Spell</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ padding: 10, borderRadius: 15, borderWidth: 1, borderColor: Colors.lightGray, backgroundColor: Colors.deepGold }}
                        onPress={() => this.setState({ tutorialMode: true })}>
                        <AppText color={Colors.totalWhite} textAlign={'center'} fontSize={22}>Custom Spell {`\n`} Tutorial</AppText>
                    </TouchableOpacity>
                </View>
                <Modal animationType="slide" visible={this.state.tutorialMode}>
                    <InformationScroller list={customSpellsTutorial.list} PressClose={async (val: boolean) => { this.setState({ tutorialMode: val }) }} />
                </Modal>
                <View style={{ flex: 1 }}>
                    <AppText fontSize={22} textAlign={'center'} color={Colors.bitterSweetRed}>Your Custom Spells</AppText>
                    <FlatList
                        style={{}}
                        data={this.state.customSpellList}
                        keyExtractor={(spells, index) => index.toString()}
                        renderItem={({ item }) => <SpellListItem
                            title={item.name}
                            subTitle={item.description}
                            type={`Spell level: ${item.type}`}
                            classes={`Classes: ${item.classes}`}
                            duration={`Duration: ${item.duration}`}
                            range={`Range: ${item.range}`}
                            higher_levels={`Higher Levels: ${item.higher_levels}`}
                            direction={'row'}
                            headColor={Colors.bitterSweetRed}
                            subColor={Colors.whiteInDarkMode}
                            headerFontSize={20}
                            subFontSize={16}
                            padding={20} width={60} height={60}
                            headTextAlign={"left"}
                            subTextAlign={"left"}
                            renderRightActions={() =>
                                <ListItemDelete onPress={() =>
                                    Alert.alert("Delete", "Are you sure you want to delete this spell? (this action is irreversible)", [{ text: 'Yes', onPress: () => this.handleDelete(item) }, { text: 'No' }])} />}
                            justifyContent={"flex-start"} textDistanceFromImg={0}
                            onPress={() => { this.setState({ pickSpellModal: true, pickedSpell: item }) }}
                        />}
                        ItemSeparatorComponent={ListItemSeparator} />
                    <Modal visible={this.state.pickSpellModal}>
                        <ScrollView style={{ backgroundColor: Colors.pageBackground, flex: 1 }}>
                            <AppText fontSize={25} color={Colors.whiteInDarkMode} textAlign={'center'}>{this.state.pickedSpell.name}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{this.state.pickedSpell.description}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`School: ${this.state.pickedSpell.school}`}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Range: ${this.state.pickedSpell.range}`}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Casting Time: ${this.state.pickedSpell.casting_time}`}</AppText>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 25 }}>
                                <AppButton backgroundColor={Colors.earthYellow} width={140} height={50} borderRadius={25}
                                    title={'Exit'} onPress={() => { this.setState({ pickSpellModal: false, pickedSpell: new CustomSpellModal() }) }} />

                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'Edit'} onPress={() => {
                                        this.props.navigation.navigate("CustomSpellCreator", { edit: { true: true, spell: this.state.pickedSpell } })
                                        this.setState({ pickSpellModal: false })
                                    }} />
                            </View>
                            <View style={{ paddingTop: 25, paddingBottom: 25 }}>
                                {this.marketPlaceNode()}
                            </View>
                        </ScrollView>
                    </Modal>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '12%'
    }
});