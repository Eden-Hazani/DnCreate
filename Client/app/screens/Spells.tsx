import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Switch, Modal, ScrollView } from 'react-native';
import { ListItem } from '../components/ListItem';
import spellsJsonImport from '../../jsonDump/spells.json'
import { Colors } from '../config/colors';
import { ListItemSeparator } from '../components/ListItemSeparator';
import { AppText } from '../components/AppText';
import { SpellListItem } from '../components/SpellListItem';
import { SearchBar } from 'react-native-elements';
import { CharacterModel } from '../models/characterModel';
import { AppButton } from '../components/AppButton';
import { filterMagicLevel } from './charOptions/helperFunctions/filterMagicLevel';
import { addSpell } from './charOptions/helperFunctions/addSpell';
import { checkSpellSlots, checkOnlyIfPicked } from './charOptions/helperFunctions/cheakSpellSlots';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import userCharApi from '../api/userCharApi';
import { spellLevelChanger } from './charOptions/helperFunctions/SpellLevelChanger';
import { checkHigherWarlockSpells } from './charOptions/helperFunctions/checkHigherWarlockSpells';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import Slider from '@react-native-community/slider';
import { AppConfirmation } from '../components/AppConfirmation';
import { spellLevelReadingChanger } from './charOptions/helperFunctions/spellLevelReadingChanger';
import AuthContext from '../auth/context';
import AsyncStorage from '@react-native-community/async-storage';
import { charCanSpellCast } from './charOptions/helperFunctions/charCanSpellCast';


interface SpellsState {
    confirmed: boolean
    shownSpells: any[]
    loadNumber: number
    search: string
    filterByClass: boolean
    filterByLevel: boolean
    character: CharacterModel
    filterModel: boolean
    flatListLoadPauseTimer: boolean
    pickSpellModal: boolean
    pickedSpell: any
    loading: boolean
    sliderLevelVal: number
    sliderLevelFilter: boolean
    spellsJSON: any
    contentLoading: boolean
}

export class Spells extends Component<{ navigation: any, route: any }, SpellsState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            contentLoading: true,
            spellsJSON: null,
            confirmed: false,
            sliderLevelVal: 0,
            sliderLevelFilter: false,
            loading: false,
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
    async componentDidMount() {
        const stringedCustomSpellsJson = await AsyncStorage.getItem('customSpellList');
        if (!stringedCustomSpellsJson) {
            this.setState({ spellsJSON: spellsJsonImport, contentLoading: false }, () => {
                this.loadSpells(this.state.shownSpells)
            })
            return
        }
        const CustomSpellsJson = JSON.parse(stringedCustomSpellsJson);
        const spellsJSON = spellsJsonImport.concat(CustomSpellsJson)
        this.setState({ spellsJSON, contentLoading: false }, () => {
            this.loadSpells(this.state.shownSpells)
        })
    }

    filterByClass = (shownSpells: any, newSpells: any) => {
        const searchedSpells = shownSpells;
        if (this.state.search !== '') {
            const fullList = searchedSpells.filter((spell: any) => spell.classes.includes(this.state.character.spellCastingClass ? this.state.character.spellCastingClass.toLowerCase() : ""))
            newSpells = fullList;
        } else {
            newSpells = [];
            const fullList = this.state.spellsJSON.filter((spell: any) => spell.classes.includes(this.state.character.spellCastingClass ? this.state.character.spellCastingClass.toLowerCase() : ""))
            for (let item = 0; item < this.state.loadNumber; item++) {
                newSpells.push(fullList[item])
            }
        }
        return newSpells
    }
    loadSpells = (shownSpells: any[]) => {
        this.setState({ loading: true })
        let newSpells: any[] = this.state.shownSpells;
        if (this.state.search === '') {
            if (this.state.shownSpells.length > 0) {
                for (let item = this.state.shownSpells.length; item < this.state.loadNumber; item++) {
                    newSpells.push(this.state.spellsJSON[item])
                }
            } else {
                for (let item = 0; item < this.state.loadNumber; item++) {
                    newSpells.push(this.state.spellsJSON[item])
                }
            }
        }
        if (this.state.filterByClass) {
            newSpells = this.filterByClass(shownSpells, newSpells)
        }
        if (this.state.filterByLevel) {
            const result: any = filterMagicLevel(this.state.character, newSpells);
            newSpells = result;
        }
        if (this.state.sliderLevelFilter && this.state.sliderLevelVal !== 0) {
            let fullList = this.state.spellsJSON.filter((spell: any) => spell.level === this.state.sliderLevelVal.toString())
            if (this.state.filterByClass) {
                const searchedSpells = shownSpells;
                if (this.state.search !== '') {
                    fullList = searchedSpells.filter((spell: any) => spell.level === this.state.sliderLevelVal.toString() && spell.classes.includes(this.state.character.spellCastingClass ? this.state.character.spellCastingClass.toLowerCase() : ""))
                    newSpells = fullList;
                } else {
                    fullList = fullList.filter((spell: any) => spell.classes.includes(this.state.character.spellCastingClass ? this.state.character.spellCastingClass.toLowerCase() : ""))
                }
            }
            newSpells = fullList
        }
        this.setState({ shownSpells: newSpells }, () => {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 1000);
        })
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
        for (let item of this.state.spellsJSON) {
            if (item.name.includes(search)) {
                shownSpells.push(item);
            }
        }
        this.setState({ shownSpells }, () => {
            this.loadSpells(this.state.shownSpells)
        })
    }

    updateOfflineCharacter = async () => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        if (stringifiedChars) {
            const characters = JSON.parse(stringifiedChars);
            for (let index in characters) {
                if (characters[index]._id === this.state.character._id) {
                    characters[index] = this.state.character;
                    break;
                }
            }
            await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
        }
    }

    addSpellToChar = () => {
        const character = { ...this.state.character };
        if (character.unrestrictedKnownSpells && character.unrestrictedKnownSpells > 0 && !this.state.pickedSpell.classes.includes(character.spellCastingClass ? character.spellCastingClass.toLowerCase() : "")) {
            const spellLevel = spellLevelChanger(this.state.pickedSpell.level)
            if (!checkOnlyIfPicked(this.state.character, this.state.pickedSpell)) {
                alert('You already possess this spell');
                return;
            }
            if (character.spells) {
                character.spells[spellLevel].push({ spell: this.state.pickedSpell, removable: true });
                character.unrestrictedKnownSpells = character.unrestrictedKnownSpells - 1;
                character.spellsKnown = (parseInt(character.spellsKnown) + 1).toString();
                this.setState({ character, pickSpellModal: false, pickedSpell: null }, () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                    alert(`You now have ${this.state.character.unrestrictedKnownSpells} more picks of any spells you want of your level`)
                    this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
                })
                return;
            }
        }
        if (character.differentClassSpellsToPick && character.differentClassSpellsToPick.length > 0 && !this.state.pickedSpell.classes.includes(character.characterClass.toLowerCase())) {
            let index = 0;
            for (let item of character.differentClassSpellsToPick) {
                if (this.state.pickedSpell.classes.includes(item.className.toLowerCase()) && this.state.pickedSpell.level === item.spellLevel) {
                    const spellLevel = spellLevelChanger(this.state.pickedSpell.level)
                    if (!checkOnlyIfPicked(this.state.character, this.state.pickedSpell)) {
                        alert('You already possess this spell');
                        return;
                    }
                    if (character.spells) {
                        character.spells[spellLevel].push({ spell: this.state.pickedSpell, removable: true });
                        item.numberOfSpells = item.numberOfSpells - 1;
                        if (item.numberOfSpells === 0) {

                            character.differentClassSpellsToPick.splice(index, 1);
                        }
                        this.setState({ character, confirmed: true }, () => {
                            setTimeout(() => {
                                this.setState({ pickSpellModal: false, pickedSpell: null, confirmed: false })
                            }, 1200);
                            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
                        })
                        return;
                    }
                }
                if (this.state.pickedSpell.school.includes(item.className.toLowerCase()) && this.state.pickedSpell.level === item.spellLevel) {
                    const spellLevel = spellLevelChanger(this.state.pickedSpell.level)
                    if (!checkOnlyIfPicked(this.state.character, this.state.pickedSpell)) {
                        alert('You already possess this spell');
                        return;
                    }
                    if (character.spells) {
                        character.spells[spellLevel].push({ spell: this.state.pickedSpell, removable: true });
                        item.numberOfSpells = item.numberOfSpells - 1;
                        if (item.numberOfSpells === 0) {

                            character.differentClassSpellsToPick.splice(index, 1);
                        }
                        this.setState({ character, confirmed: true }, () => {
                            setTimeout(() => {
                                this.setState({ pickSpellModal: false, pickedSpell: null, confirmed: false })
                            }, 1200);
                            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
                        })
                        return;
                    }
                }
                index++
            }
        }
        const spellLevel = spellLevelChanger(this.state.pickedSpell.level)
        if (!checkOnlyIfPicked(this.state.character, this.state.pickedSpell)) {
            alert('You already possess this spell');
            return;
        }
        const checkIfTrue = checkSpellSlots(this.state.character, this.state.pickedSpell)
        if (!checkHigherWarlockSpells(this.state.character, this.state.pickedSpell)) {
            alert(`As a Warlock your Mystic Arcanum ability only allows one ${this.state.pickedSpell.level}th level spell`);
            return;
        }
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
        if (checkIfTrue === 'maxPreparedSpells' && spellLevel !== 'cantrips') {
            alert(`You already prepared the maximum amount of spells for your level. \nAs a ${character.characterClass} you are able to replace your prepared spells with new spells from the spell book every long rest`);
            return;
        }
        if (checkIfTrue === 'maxCantrips' && spellLevel === 'cantrips') {
            alert(`You Have reached the maximum number of available cantrips, Level up to unlock more`);
            return;
        }
        if (character.spells) {
            character.spells[spellLevel].push({ spell: this.state.pickedSpell, removable: true });
            this.setState({ character, confirmed: true }, () => {
                setTimeout(() => {
                    this.setState({ pickSpellModal: false, pickedSpell: null, confirmed: false })
                }, 1200);
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
            })
        }

    }

    render() {
        const character = this.props.route.params.char;
        return (
            <View style={styles.container}>
                {this.state.contentLoading ? <AppActivityIndicator visible={this.state.contentLoading} />
                    :
                    <View>
                        <View>
                            <SearchBar
                                onClear={() => { this.resetList() }}
                                containerStyle={{ backgroundColor: Colors.pageBackground }}
                                inputContainerStyle={{ backgroundColor: Colors.pageBackground }}
                                lightTheme={Colors.pageBackground === "#121212" ? false : true}
                                placeholder="Search Spells"
                                onChangeText={this.updateSearch}
                                value={this.state.search}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: "flex-end", alignItems: "flex-end" }}>
                                {this.state.character.magic &&
                                    <View style={{ paddingTop: 15, paddingRight: 15 }}>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={70} height={55} borderRadius={25}
                                            title={'Filter'} onPress={() => this.setState({ filterModel: true })} />
                                    </View>
                                }
                                {this.state.character.magic &&
                                    <View style={{ paddingTop: 15, paddingRight: 15 }}>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={70} height={55} borderRadius={25}
                                            title={'Custom Spells'} onPress={() => { this.props.navigation.navigate('CustomSpellList', { character: this.state.character }) }} />
                                    </View>
                                }
                            </View>
                            <Modal visible={this.state.filterModel}>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 25, backgroundColor: Colors.pageBackground }}>
                                    {charCanSpellCast(this.state.character.spellCastingClass ? this.state.character.spellCastingClass : "")
                                        &&
                                        <View>
                                            <View style={{ flexDirection: 'row', backgroundColor: Colors.pageBackground }}>
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
                                        </View>
                                    }
                                    <View style={{ marginTop: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.pageBackground }}>
                                        <AppText>Enable Level filter?</AppText>
                                        <Switch value={this.state.sliderLevelFilter} onValueChange={() => {
                                            if (this.state.sliderLevelFilter) {
                                                this.setState({ sliderLevelFilter: false })
                                                this.resetList()
                                                return;
                                            }
                                            this.setState({ sliderLevelFilter: true, filterByLevel: false }, () => {
                                                this.resetList()
                                            })
                                        }} />
                                        <AppText>Use the slider to filter the highest spell level you want.</AppText>
                                        {this.state.sliderLevelVal > 0 && <AppText>Spell Level {this.state.sliderLevelVal}</AppText>}
                                        <Slider
                                            disabled={!this.state.sliderLevelFilter}
                                            style={{ width: 200, height: 40 }}
                                            minimumValue={1}
                                            step={1}
                                            maximumValue={9}
                                            thumbTintColor={Colors.bitterSweetRed}
                                            minimumTrackTintColor={Colors.bitterSweetRed}
                                            maximumTrackTintColor={Colors.berries}
                                            onValueChange={(val) => {
                                                this.setState({ sliderLevelVal: val })
                                            }}
                                            onSlidingComplete={() => {
                                                this.resetList()
                                            }}
                                        />
                                    </View>
                                    <View style={{ backgroundColor: Colors.pageBackground }}>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
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
                                this.setState({ loadNumber: this.state.loadNumber + 40 }, () => { this.loadSpells(this.state.shownSpells) })
                            }}
                            onEndReachedThreshold={1}
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
                                justifyContent={"flex-start"} textDistanceFromImg={0}
                                onPress={() => { this.setState({ pickSpellModal: true, pickedSpell: item }) }}
                            />}
                            ItemSeparatorComponent={ListItemSeparator} />
                        <View style={{ position: 'absolute', width: 150, right: 135, top: 50 }}>
                            <AppActivityIndicator visible={this.state.loading} />
                        </View>
                        <Modal visible={this.state.pickSpellModal} >
                            {this.state.pickSpellModal &&
                                <View>
                                    {this.state.confirmed ?
                                        <AppConfirmation visible={this.state.confirmed} />
                                        :
                                        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                            {this.state.character.magic ?
                                                <View style={{ backgroundColor: Colors.pageBackground }}>
                                                    <View style={{ padding: 10, backgroundColor: Colors.pageBackground }}>
                                                        <AppText fontSize={25} padding={15} color={Colors.berries} textAlign={'center'}>{this.state.pickedSpell.name}</AppText>
                                                        <AppText fontSize={17} color={Colors.whiteInDarkMode} textAlign={'center'}>{this.state.pickedSpell.description.replace(/\. /g, '.\n\n')}</AppText>
                                                        {this.state.pickedSpell?.higher_levels &&
                                                            <View>
                                                                <AppText fontSize={22} color={Colors.berries} textAlign={'center'}>Higher Levels</AppText>
                                                                <AppText fontSize={17} color={Colors.whiteInDarkMode} textAlign={'center'}>{this.state.pickedSpell.higher_levels.replace(/\. /g, '.\n\n')}</AppText>
                                                            </View>}
                                                        <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`School: ${this.state.pickedSpell.school}`}</AppText>
                                                        <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Range: ${this.state.pickedSpell.range}`}</AppText>
                                                        <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Casting Time: ${this.state.pickedSpell.casting_time}`}</AppText>
                                                        {(this.state.character.magic.cantrips && this.state.pickedSpell.level === 'cantrip') ?
                                                            addSpell(this.state.pickedSpell.type, this.state.character) ?
                                                                <View style={{ margin: 15 }}>
                                                                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                                                        title={'Add Spell'} onPress={() => { this.addSpellToChar() }} />
                                                                </View>
                                                                :
                                                                <View>
                                                                    <AppText fontSize={18} color={Colors.bitterSweetRed}>This Spell is out of your level, you will be able to pick this spell once you reach {spellLevelReadingChanger(this.state.pickedSpell.level)}</AppText>
                                                                </View>
                                                            : null}

                                                        {(!this.state.character.magic.cantrips && this.state.pickedSpell.level === 'cantrip') ?
                                                            <View>
                                                                <AppText textAlign={'center'} fontSize={18} color={Colors.bitterSweetRed}>Your Character does not possess the ability to use cantrips.</AppText>
                                                            </View>
                                                            : null}

                                                        {this.state.pickedSpell.level !== 'cantrip' ?
                                                            addSpell(this.state.pickedSpell.type, this.state.character) ?
                                                                <View style={{ margin: 15 }}>
                                                                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                                                        title={'Add Spell'} onPress={() => { this.addSpellToChar() }} />
                                                                </View>
                                                                :
                                                                <View>
                                                                    <AppText textAlign={'center'} fontSize={18} color={Colors.bitterSweetRed}>This Spell is out of your level, you will be able to pick this spell once you reach {spellLevelReadingChanger(this.state.pickedSpell.level)}</AppText>
                                                                </View>
                                                            : null}
                                                    </View>
                                                    <View style={{ margin: 15, backgroundColor: Colors.pageBackground }}>
                                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                                            title={'Close'} onPress={() => this.setState({ pickSpellModal: false })} />
                                                    </View>
                                                </View>
                                                :
                                                <View style={{ padding: 15, backgroundColor: Colors.pageBackground }}>
                                                    <AppText>{this.state.pickedSpell.name}</AppText>
                                                    <AppText>{this.state.pickedSpell.description}</AppText>
                                                    <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`School: ${this.state.pickedSpell.school}`}</AppText>
                                                    <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Range: ${this.state.pickedSpell.range}`}</AppText>
                                                    <AppText fontSize={20} color={Colors.whiteInDarkMode} textAlign={'center'}>{`Casting Time: ${this.state.pickedSpell.casting_time}`}</AppText>
                                                    <AppText textAlign={'center'} fontSize={18} color={Colors.bitterSweetRed}>Right now you do not possess magical abilities</AppText>
                                                    <View>
                                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                                            title={'Close'} onPress={() => this.setState({ pickSpellModal: false })} />
                                                    </View>
                                                </View>
                                            }
                                        </ScrollView>}
                                </View>
                            }
                        </Modal>
                    </View>
                }
            </View >
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});