import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { Colors } from '../../config/colors';
import { levelUpChartModal } from '../../models/levelUpChartModal';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { charCanSpellCast } from '../charOptions/helperFunctions/charCanSpellCast';
import { AddMagicalAbilities } from './SubclassCreationComponents/AddMagicalAbilities';
import { ChoiceCreator } from './SubclassCreationComponents/ChoiceCreator';
import { SkillOrToolPick } from './SubclassCreationComponents/SkillOrToolPick';
import { SubClassSkillPick } from './SubclassCreationComponents/SubClassSkillPick';
import { SubClassSpellPicker } from './SubclassCreationComponents/SubClassSpellPicker';
import { SubClassToolPick } from './SubclassCreationComponents/SubClassToolPick';
import * as customPathLevelList from '../../../jsonDump/customPathLevelList.json'

interface EditSubClassFeatureState {
    feature: levelUpChartModal
    choiceModal: boolean
    skillModal: boolean
    spellModal: boolean
    toolModel: boolean
    loading: boolean
    autoSkillModal: boolean
    autoToolModal: boolean
    magicalAbilitiesModal: boolean
    spellAvailabilityModal: boolean
}
export class EditSubClassFeature extends Component<{ navigation: any, route: any }, EditSubClassFeatureState>{
    private navigationSub
    constructor(props: any) {
        super(props)
        this.state = {
            spellAvailabilityModal: false,
            magicalAbilitiesModal: false,
            autoToolModal: false,
            autoSkillModal: false,
            loading: false,
            spellModal: false,
            feature: this.props.route.params.featureInfo,
            choiceModal: false,
            skillModal: false,
            toolModel: false
        }
        this.navigationSub = this.props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
        });
    }

    approveFeature = () => {
        if (!this.state.feature.name || this.state.feature.name === '') {
            alert('Must fill name of feature');
            return
        }
        if (!this.state.feature.description || this.state.feature.description === '') {
            alert('Must fill description of feature');
            return
        }
        this.setState({ loading: true })
        const storeItem = { ...store.getState().customSubClass };
        if (storeItem.levelUpChart) {
            storeItem.levelUpChart[this.props.route.params.featureLevel][this.props.route.params.featureNumber] = this.state.feature
            store.dispatch({ type: ActionType.UpdateSubclass, payload: storeItem })
            this.navigationSub()
            setTimeout(() => {
                this.props.navigation.goBack()
            }, 600);
            setTimeout(() => {
                this.setState({ loading: false })
            }, 800);
        }
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={18}>Here you can add what the feature gives the character.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Start with a name and a description.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>After that you can use DnCreate's systems to add choices,skills,magic and more to this feature.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>Once the player levels up he will receive this feature with its rewards.</AppText>
                    <AppText color={Colors.bitterSweetRed} textAlign={'center'} fontSize={20}>Remember to write a good description of what this feature actually gives the character</AppText>
                    <AppText color={Colors.bitterSweetRed} padding={10} textAlign={'center'} fontSize={25}>Level {this.props.route.params.featureLevel} {'\n'} Feature number {this.props.route.params.featureNumber}</AppText>
                </View>
                <AppTextInput
                    defaultValue={this.props.route.params.featureInfo.name}
                    placeholder={'Feature name'} onChangeText={(name: string) => {
                        const feature = { ...this.state.feature }
                        feature.name = name
                        this.setState({ feature })
                    }} />
                <AppTextInput
                    defaultValue={this.props.route.params.featureInfo.description}
                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                    placeholder={'Feature Description'} onChangeText={(description: string) => {
                        const feature = { ...this.state.feature }
                        feature.description = description
                        this.setState({ feature })
                    }} />

                {/* add magic to nonMagic */}
                {console.log(customPathLevelList[store.getState().customSubClass.baseClass || ""][0] === this.props.route.params.featureLevel)}
                {(!charCanSpellCast(store.getState().customSubClass.baseClass || "") && customPathLevelList[store.getState().customSubClass.baseClass || ""][0] === this.props.route.params.featureLevel &&
                    this.props.route.params.featureNumber === 1) &&
                    <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                        <AppText fontSize={20} padding={15} textAlign={'center'}>The class you choose has no magical abilities, if your subclass grants magic you can add it here</AppText>
                        <AppText fontSize={20} padding={12} textAlign={'center'}>Important! you can only choose base magic here (the first feature of the first subclass level)</AppText>
                        <AppButton
                            fontSize={17} title={'Edit Magical Abilities'} onPress={() => this.setState({ magicalAbilitiesModal: true })}
                            borderRadius={10}
                            backgroundColor={Colors.metallicBlue} width={150} height={45} />
                        {this.state.feature.spellCastingClass && this.state.feature.spellCastingClass !== '' ?
                            <View>
                                <AppText fontSize={18} textAlign={'center'}>Magical Abilities Class - {this.state.feature.spellCastingClass}</AppText>

                            </View>
                            :
                            null
                        }
                        <Modal visible={this.state.magicalAbilitiesModal} animationType="slide">
                            {this.state.magicalAbilitiesModal && <AddMagicalAbilities
                                startingLevel={this.props.route.params.featureLevel}
                                charMagic={this.state.feature.customUserMagicLists || []}
                                pickedMagicClass={this.state.feature.spellCastingClass || ''}
                                closeModal={(val: any) => {
                                    const feature = { ...this.state.feature };
                                    feature.customUserMagicLists = val.charMagic
                                    feature.addMagicalAbilities = "Custom"
                                    feature.spellCastingClass = val.spellCastingClass
                                    this.setState({ feature, magicalAbilitiesModal: false })
                                }} />}
                        </Modal>
                    </View>
                }

                {/* add spell availability */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText
                        fontSize={20} padding={15} textAlign={'center'}>Does this feature gives any spells to the character? {'\n'} these spells
                        can be from any class from the book and they will be available for the player to choose from the spell book (if he meets the requirements){'\n'}
                        This mechanic is similar to the patron spells warlocks get with their paths.</AppText>
                    <AppButton
                        fontSize={20} title={'Edit Spell Availability'} onPress={() => this.setState({ spellAvailabilityModal: true })}
                        borderRadius={10}
                        backgroundColor={Colors.burgundy} width={120} height={45} />
                    {this.state.feature.addSpellAvailability && this.state.feature.addSpellAvailability.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Feature tools</AppText>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.feature.addSpellAvailability.map((tool, index) => <View
                                    style={[styles.item, { width: 115, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                    <AppText textAlign={'center'} fontSize={15}>{tool}</AppText>
                                </View>)}
                            </View>
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.spellAvailabilityModal} animationType="slide">
                        {this.state.spellAvailabilityModal && <SubClassSpellPicker
                            pickedSpells={this.state.feature.spellsToBeAdded || []}
                            closeModal={(val: any) => {
                                const feature = { ...this.state.feature };
                                feature.addSpellAvailability = val.pickedSpells;
                                this.setState({ feature, spellAvailabilityModal: false })
                            }} />}
                    </Modal>
                </View>


                {/* tools autoPick */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText
                        fontSize={20} padding={15} textAlign={'center'}>Does this feature gives any tools to the character? {'\n'} these tools are
                    auto applied on reaching this feature</AppText>
                    <AppButton
                        disabled={this.state.feature.toolsToPick && this.state.feature.toolsToPick.length > 0}
                        fontSize={20} title={'Edit Auto Tools'} onPress={() => this.setState({ autoToolModal: true })}
                        borderRadius={10}
                        backgroundColor={Colors.burgundy} width={120} height={45} />
                    {(this.state.feature.toolsToPick && this.state.feature.toolsToPick.length > 0) &&
                        <AppText>You cannot add choice tools and auto tools in the same feature, if you wish to add both you need to do so in another feature</AppText>}
                    {this.state.feature.toolsToBeAdded && this.state.feature.toolsToBeAdded.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Feature tools</AppText>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.feature.toolsToBeAdded.map((tool, index) => <View
                                    style={[styles.item, { width: 115, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                    <AppText textAlign={'center'} fontSize={15}>{tool}</AppText>
                                </View>)}
                            </View>
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.autoToolModal} animationType="slide">
                        {this.state.autoToolModal && <SkillOrToolPick
                            isExpertise={false}
                            skillOrTool={'tool'}
                            itemsAdded={this.state.feature.toolsToBeAdded || []}
                            closeModal={(val: any) => {
                                const feature = { ...this.state.feature };
                                feature.toolsToBeAdded = val.items;
                                this.setState({ feature, autoToolModal: false })
                            }} />}
                    </Modal>
                </View>


                {/* skills autoPick */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText
                        fontSize={20} padding={15} textAlign={'center'}>Does this feature gives any skills to the character? {'\n'} these skills are
                    auto applied on reaching this feature</AppText>
                    <AppButton
                        disabled={this.state.feature.skillList && this.state.feature.skillList.length > 0}
                        fontSize={20} title={'Edit Auto Skills'} onPress={() => this.setState({ autoSkillModal: true })}
                        borderRadius={10}
                        backgroundColor={Colors.danger} width={120} height={45} />
                    {(this.state.feature.skillList && this.state.feature.skillList.length > 0) &&
                        <AppText>You cannot add choice skills and auto skills in the same feature, if you wish to add both you need to do so in another feature</AppText>}
                    {this.state.feature.addExactSkillProficiency && this.state.feature.addExactSkillProficiency.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Skills start as expertise - {`${this.state.feature.skillsStartAsExpertise}`}</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Feature skills</AppText>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.feature.addExactSkillProficiency.map((skill, index) => <View
                                    style={[styles.item, { width: 115, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                    <AppText textAlign={'center'} fontSize={15}>{skill}</AppText>
                                </View>)}
                            </View>
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.autoSkillModal} animationType="slide">
                        {this.state.autoSkillModal && <SkillOrToolPick
                            isExpertise={this.state.feature.skillsStartAsExpertise || false}
                            skillOrTool={'skill'}
                            itemsAdded={this.state.feature.addExactSkillProficiency || []}
                            closeModal={(val: any) => {
                                const feature = { ...this.state.feature };
                                feature.addExactSkillProficiency = val.items;
                                feature.skillsStartAsExpertise = val.expertise;
                                this.setState({ feature, autoSkillModal: false })
                            }} />}
                    </Modal>
                </View>



                {/* Spells to be added */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText fontSize={20} padding={15} textAlign={'center'}>Does this feature offer any spells for the player?</AppText>
                    <AppButton fontSize={20} title={'Edit Spells'} onPress={() => this.setState({ spellModal: true })}
                        borderRadius={10}
                        backgroundColor={Colors.paleGreen} width={120} height={45} />
                    {this.state.feature.spellsToBeAdded && this.state.feature.spellsToBeAdded.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Feature spells</AppText>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.feature.spellsToBeAdded.map((spell, index) => <View
                                    style={[styles.item, { width: 115, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                    <AppText textAlign={'center'} fontSize={15}>{spell}</AppText>
                                </View>)}
                            </View>
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.spellModal} animationType="slide">
                        {this.state.spellModal && <SubClassSpellPicker
                            pickedSpells={this.state.feature.spellsToBeAdded || []}
                            closeModal={(val: any) => {
                                const feature = { ...this.state.feature };
                                feature.spellsToBeAdded = val.pickedSpells;
                                this.setState({ feature, spellModal: false })
                            }} />}
                    </Modal>
                </View>


                {/* Tool list to pick from */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText fontSize={20} padding={15} textAlign={'center'}>Does this feature offer the player with a tool list to choose from?</AppText>
                    <AppButton fontSize={20} title={'Edit Tools'} onPress={() => this.setState({ toolModel: true })}
                        borderRadius={10}
                        backgroundColor={Colors.deepGold} width={120} height={45} />

                    {this.state.feature.toolsToPick && this.state.feature.toolsToPick.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Tools pick amount - {this.state.feature.amount}</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Feature available Tools</AppText>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.feature.toolsToPick.map((tool, index) => <View
                                    style={[styles.item, { width: 115, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                    <AppText textAlign={'center'} fontSize={15}>{tool}</AppText>
                                </View>)}
                            </View>
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.toolModel} animationType='slide'>
                        <SubClassToolPick
                            closeModal={(val: any) => {
                                const feature = { ...this.state.feature };
                                feature.toolsToPick = val.tools;
                                feature.amount = val.amount;
                                this.setState({ feature, toolModel: false })
                            }}
                            toolsAdded={this.state.feature.toolsToPick || []}
                            amountToPick={this.state.feature.skillPickNumber || 1} />
                    </Modal>
                </View>

                {/* Skill List to pick from */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText fontSize={20} padding={15} textAlign={'center'}>Does this feature offer the player with skills to pick from? {'\n'} this gives the player a list of skills to pick from</AppText>
                    <AppButton
                        disabled={this.state.feature.addExactSkillProficiency && this.state.feature.addExactSkillProficiency.length > 0}
                        fontSize={20} title={'Edit Skills'} onPress={() => this.setState({ skillModal: true })}
                        borderRadius={10}
                        backgroundColor={Colors.earthYellow} width={120} height={45} />
                    {(this.state.feature.addExactSkillProficiency && this.state.feature.addExactSkillProficiency.length > 0) &&
                        <AppText>You cannot add choice skills and auto skills in the same feature, if you wish to add both you need to do so in another feature</AppText>}
                    {this.state.feature.skillList && this.state.feature.skillList.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Skills pick amount - {this.state.feature.skillPickNumber}</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Skills start as expertise - {`${this.state.feature.skillsStartAsExpertise}`}</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Feature available skills</AppText>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.feature.skillList.map((skill, index) => <View
                                    style={[styles.item, { width: 115, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                    <AppText textAlign={'center'} fontSize={15}>{skill}</AppText>
                                </View>)}
                            </View>
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.skillModal} animationType='slide'>
                        <SubClassSkillPick
                            closeModal={(val: any) => {
                                const feature = { ...this.state.feature };
                                feature.skillList = val.skills;
                                feature.skillsStartAsExpertise = val.expertise;
                                feature.skillPickNumber = val.amount;
                                this.setState({ feature, skillModal: false })
                            }}
                            isExpertise={this.state.feature.skillsStartAsExpertise || false}
                            skillsAdded={this.state.feature.skillList || []}
                            amountToPick={this.state.feature.skillPickNumber || 1} />
                    </Modal>
                </View>


                {/* Choices */}
                <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, padding: 15, margin: 10 }}>
                    <AppText fontSize={20} padding={15} textAlign={'center'}>Does this feature offer the player with a choice for a unique ability?</AppText>
                    <AppButton fontSize={20} title={'Edit Choices'} onPress={() => this.setState({ choiceModal: true })}
                        borderRadius={10}
                        backgroundColor={Colors.pastelPink} width={120} height={45} />

                    {this.state.feature.choices && this.state.feature.choices.length > 0 ?
                        <View>
                            <AppText fontSize={18} textAlign={'center'}>Feature available choices</AppText>
                            {this.state.feature.choices.map((choice, index) => <View
                                style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.bitterSweetRed }]} key={index}>
                                <AppText textAlign={'center'} fontSize={20}>{choice.name}</AppText>
                                <AppText textAlign={'center'}>{choice.description.substring(0, 80)}...</AppText>
                            </View>)}
                        </View>
                        :
                        null
                    }
                    <Modal visible={this.state.choiceModal} animationType="slide">
                        {this.state.choiceModal &&
                            <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                                <ChoiceCreator
                                    amountToPick={this.state.feature.numberOfChoices || 1}
                                    existingChoices={this.state.feature.choices || []}
                                    loadChoices={(val: any) => {
                                        const feature = { ...this.state.feature };
                                        feature.choices = val.choices;
                                        feature.numberOfChoices = val.amount;
                                        this.setState({ feature, choiceModal: false })
                                    }}
                                    closeModal={(val: any) => {
                                        const feature = { ...this.state.feature };
                                        feature.choices = val.choices;
                                        feature.numberOfChoices = val.amount;
                                        this.setState({ feature, choiceModal: false })
                                    }} />
                            </View>
                        }
                    </Modal>
                </View>


                <View style={{ padding: 50 }}>
                    {this.state.loading ?
                        <View style={{ width: 120, height: 120, justifyContent: "center", alignSelf: "center" }}>
                            <AppActivityIndicator visible={this.state.loading} />
                        </View> :
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                            <AppButton fontSize={20} title={'Approve Feature'} onPress={() => this.approveFeature()}
                                borderRadius={10}
                                backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                            <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                                this.navigationSub()
                                this.props.navigation.goBack()
                            }}
                                borderRadius={10}
                                backgroundColor={Colors.metallicBlue} width={120} height={45} />
                        </View>
                    }
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        borderRadius: 25,
        padding: 15,
        margin: 10,
        justifyContent: 'center',
        alignItems: "center"
    }
});