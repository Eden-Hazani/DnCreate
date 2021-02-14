import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import spellList from '../../../../jsonDump/spells.json'
import logger from '../../../../utility/logger';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import InformationDrawer from '../../../components/InformationDrawer';
import { ListItemSeparator } from '../../../components/ListItemSeparator';
import { Colors } from '../../../config/colors';

interface SubClassSpellPickerState {
    shownSpells: any[],
    search: string,
    pickedSpells: any[]
    pickedSpellsBeforeChanges: any[]
}
export class SubClassSpellPicker extends Component<{ closeModal: any, pickedSpells: any }, SubClassSpellPickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            shownSpells: [],
            search: '',
            pickedSpells: this.props.pickedSpells,
            pickedSpellsBeforeChanges: JSON.parse(JSON.stringify(this.props.pickedSpells))
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
        let pickedSpells = this.state.pickedSpells
        if (pickedSpells.includes(item.name)) {
            const newSpells = pickedSpells.filter((currentSpell, index) => currentSpell !== item.name);
            pickedSpells = newSpells
            this.setState({ pickedSpells })
            return
        } else {
            pickedSpells.push(item.name);
            this.setState({ pickedSpells })
        }
    }

    approveChoices = () => {
        this.props.closeModal({ pickedSpells: this.state.pickedSpells })
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: Colors.pageBackground, flex: 1 }]}>
                <View>
                    <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                        <AppText color={Colors.berries} textAlign={'center'} fontSize={25}>Starting Spells</AppText>
                        <AppText textAlign={'center'} fontSize={18}>Does this feature gives the character spells?</AppText>
                        <AppText textAlign={'center'} fontSize={18}>Here you can choose any spell from the spell book, these spells will be added to the character upon reaching this feature.</AppText>
                    </View>
                    {this.state.pickedSpells && this.state.pickedSpells.length > 0 &&
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <InformationDrawer expendedHeight={400}
                                headLine={'Picked Spells'}
                                expendedWidth={Dimensions.get('screen').width}
                                information={
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <AppText color={Colors.totalWhite} fontSize={18}>Picked Spells</AppText>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {this.state.pickedSpells.map((item, index) => {
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
                                    style={{ backgroundColor: this.state.pickedSpells.includes(item.name) ? Colors.bitterSweetRed : Colors.lightGray }}
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
                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", paddingBottom: 15 }}>
                        <AppButton fontSize={20} title={'Approve'} onPress={() => this.approveChoices()}
                            borderRadius={10}
                            backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                        <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                            Alert.alert("Cancel?", "All changes will be lost",
                                [{
                                    text: 'Yes', onPress: () => {
                                        this.setState({ pickedSpells: this.state.pickedSpellsBeforeChanges }, () => {
                                            this.props.closeModal({ pickedSpells: this.state.pickedSpellsBeforeChanges })
                                        })
                                    }
                                }, { text: 'No' }])
                        }}
                            borderRadius={10}
                            backgroundColor={Colors.metallicBlue} width={120} height={45} />
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});