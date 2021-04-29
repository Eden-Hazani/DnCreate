import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Modal, Alert, TouchableOpacity, Dimensions } from 'react-native';
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


interface CustomSpellListState {
    customSpellList: CustomSpellModal[]
    pickSpellModal: boolean
    pickedSpell: CustomSpellModal
}

export class CustomSpellList extends Component<{ route: any, navigation: any }, CustomSpellListState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity style={{ borderRadius: 125, borderWidth: 1, borderColor: Colors.lightGray }}
                        onPress={() => { this.props.navigation.navigate("CustomSpellCreator", { character: this.props.route.params.character, edit: { true: false } }) }}>
                        <Image style={{ width: 250, height: 250 }} uri={`${Config.serverUrl}/assets/specificDragons/custom-Spell-Dragon.png`} />
                        <View style={{ position: "absolute", top: 150, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <AppText fontSize={20}>Create New Spell</AppText>
                        </View>
                    </TouchableOpacity>

                </View>
                <View>
                    <AppText fontSize={20} textAlign={'center'}>Your Custom Spells</AppText>
                    <FlatList
                        style={{ marginBottom: 120 }}
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
                        <View style={{ backgroundColor: Colors.pageBackground, flex: 1 }}>
                            <AppText fontSize={25} color={Colors.whiteInDarkMode} textAlign={'center'}>{this.state.pickedSpell.name}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{this.state.pickedSpell.description}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`School: ${this.state.pickedSpell.school}`}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Range: ${this.state.pickedSpell.range}`}</AppText>
                            <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Casting Time: ${this.state.pickedSpell.casting_time}`}</AppText>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'Close'} onPress={() => { this.setState({ pickSpellModal: false, pickedSpell: new CustomSpellModal() }) }} />

                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'Edit'} onPress={() => {
                                        this.props.navigation.navigate("CustomSpellCreator", { character: this.props.route.params.character, edit: { true: true, spell: this.state.pickedSpell } })
                                        this.setState({ pickSpellModal: false })
                                    }} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});