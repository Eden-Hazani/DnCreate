import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Switch, Modal, ScrollView } from 'react-native';
import { ListItem } from '../components/ListItem';
import spellsJSON from '../../jsonDump/spells.json'
import colors from '../config/colors';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { AppText } from '../components/AppText';
import { SpellListItem } from '../components/SpellListItem';
import { SearchBar } from 'react-native-elements';
import { CharacterModel } from '../models/characterModel';
import { AppButton } from '../components/AppButton';
import { filterMagicLevel } from './charOptions/helperFunctions/filterMagicLevel';
import { addSpell } from './charOptions/helperFunctions/addSpell';
import { checkSpellSlots } from './charOptions/helperFunctions/cheakSpellSlots';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import userCharApi from '../api/userCharApi';
import { spellLevelChanger } from './charOptions/helperFunctions/SpellLevelChanger';

interface SpellsState {
    shownSpells: any[]
    loadNumber: number
    search: string
    filterByClass: boolean
    filterByLevel: boolean
    character: CharacterModel
    filterModel: boolean
    flatListLoadPauseTimer: boolean
    pickSpellModal: boolean,
    pickedSpell: any

}

export class Spells extends Component<{ navigation: any, route: any }, SpellsState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pickSpellModal: false,
            pickedSpell: null,
            flatListLoadPauseTimer: false,
            filterByLevel: false,
            filterModel: false,
            loadNumber: 10,
            shownSpells: [],
            search: '',
            filterByClass: false,
            character: this.props.route.params.char

        }
    }
    componentDidMount() {
        this.loadSpells(this.state.shownSpells)
    }
    loadSpells = (shownSpells: any[]) => {
        if (this.state.search === '') {
            if (this.state.shownSpells.length > 0) {
                for (let item = this.state.shownSpells.length; item <= this.state.loadNumber; item++) {
                    shownSpells.push(spellsJSON[item])
                }
            } else {
                for (let item = 0; item < this.state.loadNumber; item++) {
                    shownSpells.push(spellsJSON[item])
                }
            }
        }
        if (this.state.filterByClass) {
            const searchedSpells = shownSpells;
            if (this.state.search !== '') {
                const fullList = searchedSpells.filter(spell => spell.classes.includes(this.state.character.characterClass.toLowerCase()))
                shownSpells = fullList;
            } else {
                shownSpells = [];
                const fullList = spellsJSON.filter(spell => spell.classes.includes(this.state.character.characterClass.toLowerCase()))
                for (let item = 0; item < this.state.loadNumber; item++) {
                    shownSpells.push(fullList[item])
                }
            }
        }
        if (this.state.filterByLevel) {
            shownSpells = filterMagicLevel(this.state.character, shownSpells);
        }

        this.setState({ shownSpells })
    }

    resetList = () => {
        this.setState({ search: '', shownSpells: [], flatListLoadPauseTimer: true }, () => {
            this.loadSpells(this.state.shownSpells)
            setTimeout(() => {
                this.setState({ flatListLoadPauseTimer: false })
            }, 500);
        })
    }


    updateSearch = (search: string) => {
        this.setState({ search })
        if (search.trim() === "") {
            this.resetList()
            return;
        }
        const shownSpells: any[] = [];
        for (let item of spellsJSON) {
            if (item.name.includes(search)) {
                shownSpells.push(item);
            }
        }
        this.loadSpells(shownSpells)
    }

    addSpellToChar = () => {
        const character = { ...this.state.character };
        const spellLevel = spellLevelChanger(this.state.pickedSpell.level)
        const checkIfTrue = checkSpellSlots(this.state.character, this.state.pickedSpell)
        if (checkIfTrue === 'maxKnownSpells') {
            alert('You have reached the maximum amount of spells for your level');
            return;
        }
        if (checkIfTrue === 'spellAlreadyPicked') {
            alert('You already possess this spell');
            return;
        }
        if (checkIfTrue === 'wrongClass') {
            alert('Your class cannot use this spell');
            return;
        }
        if (checkIfTrue === 'maxPreparedSpells') {
            alert(`You already prepared the maximum amount of spells for your level. \nAs a ${character.characterClass} you are able to replace your prepared spells with new spells from the spell book every long rest`);
            return;
        }
        if (checkIfTrue === 'maxCantrips') {
            alert(`You Have reached the maximum number of available cantrips, Level up to unlock more`);
            return;
        }
        character.spells[spellLevel].push(this.state.pickedSpell);
        this.setState({ character, pickSpellModal: false, pickedSpell: null }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            userCharApi.updateChar(this.state.character)
        })

    }

    render() {
        const character = this.props.route.params.char;
        return (
            <View style={styles.container}>
                <View>
                    <SearchBar
                        onClear={() => { this.resetList() }}
                        containerStyle={{ backgroundColor: colors.white }}
                        inputContainerStyle={{ backgroundColor: colors.white }}
                        lightTheme
                        placeholder="Search Spells"
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                    />
                    <View style={{ justifyContent: "flex-end", alignItems: "flex-end", paddingTop: 15, paddingRight: 15 }}>
                        <AppButton backgroundColor={colors.bitterSweetRed} width={55} height={55} borderRadius={25}
                            title={'Filter'} onPress={() => this.setState({ filterModel: true })} />
                    </View>
                    <Modal visible={this.state.filterModel}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <AppText>Only show spells for your class?</AppText>
                                <Switch value={this.state.filterByClass} onValueChange={() => {
                                    if (this.state.filterByClass) {
                                        this.setState({ filterByClass: false, loadNumber: 10 }, () => {
                                            this.resetList()
                                        })
                                        return;
                                    }
                                    this.setState({ filterByClass: true, loadNumber: 10 }, () => {
                                        this.resetList()
                                    })
                                }} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <AppText>Only show spells that you can learn?</AppText>
                                <Switch value={this.state.filterByLevel} onValueChange={() => {
                                    if (this.state.filterByLevel) {
                                        this.setState({ filterByLevel: false })
                                        this.resetList()
                                        return;
                                    }
                                    this.setState({ filterByLevel: true }, () => {
                                        this.resetList()
                                    })
                                }} />
                            </View>

                            <View>
                                <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'Close'} onPress={() => this.setState({ filterModel: false })} />
                            </View>
                        </View>
                    </Modal>
                </View>
                <FlatList
                    style={{ marginBottom: 120 }}
                    data={this.state.shownSpells}
                    keyExtractor={(spells, index) => index.toString()}
                    onEndReached={() => {
                        if (this.state.flatListLoadPauseTimer) {
                            return;
                        }
                        this.setState({ loadNumber: this.state.loadNumber + 3 }, () => { this.loadSpells(this.state.shownSpells) })
                    }}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => <SpellListItem
                        title={item.name}
                        subTitle={item.description}
                        classes={`Classes: ${item.classes}`}
                        duration={`Duration: ${item.duration}`}
                        range={`Range: ${item.range}`}
                        type={`Spell level: ${item.type}`}
                        direction={'row'}
                        headColor={colors.bitterSweetRed}
                        subColor={colors.black}
                        headerFontSize={20}
                        subFontSize={16}
                        padding={20} width={60} height={60}
                        headTextAlign={"left"}
                        subTextAlign={"left"}
                        justifyContent={"flex-start"} textDistanceFromImg={0}
                        onPress={() => { this.setState({ pickSpellModal: true, pickedSpell: item }) }}
                    />}
                    ItemSeparatorComponent={ListItemSeparator} />
                <Modal visible={this.state.pickSpellModal} >
                    {this.state.pickSpellModal &&
                        <ScrollView>
                            {this.state.character.magic ?
                                <View>
                                    <View>
                                        <AppText>{this.state.pickedSpell.name}</AppText>
                                        <AppText>{this.state.pickedSpell.description}</AppText>

                                        {addSpell(this.state.pickedSpell.type, this.state.character) ?
                                            <View>
                                                <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                                    title={'Add Spell'} onPress={() => { this.addSpellToChar() }} />
                                            </View>
                                            :
                                            <View>
                                                <AppText fontSize={18} color={colors.bitterSweetRed}>This Spell is out of your level, you will be able to pick this spell once you reach {this.state.pickedSpell.type}</AppText>
                                            </View>
                                        }
                                    </View>
                                    <View>
                                        <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                            title={'Close'} onPress={() => this.setState({ pickSpellModal: false })} />
                                    </View>
                                </View>

                                :
                                <View style={{ padding: 15 }}>
                                    <AppText>{this.state.pickedSpell.name}</AppText>
                                    <AppText>{this.state.pickedSpell.description}</AppText>
                                    <AppText textAlign={'center'} fontSize={18} color={colors.bitterSweetRed}>Right now you do not possess magical abilities</AppText>
                                    <View>
                                        <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                            title={'Close'} onPress={() => this.setState({ pickSpellModal: false })} />
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    }
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});