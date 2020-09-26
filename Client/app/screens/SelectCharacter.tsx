import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, Alert } from 'react-native';
import { IconGen } from '../components/IconGen';
import colors from '../config/colors';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { CharacterModel } from '../models/characterModel';
import { Config } from '../../config';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { AppTextInput } from '../components/forms/AppTextInput';
import userCharApi from '../api/userCharApi';
import switchProficiency from '../../utility/ProficiencyBonusSwitch';
import skillModifier from '../../utility/skillModifier';
import hitDiceSwitch from '../../utility/hitDiceSwitch';


/**
 * 
 * @param  image: image url-string || URI
 *   
 */
interface SelectCharacterState {
    backGroundStoryVisible: boolean
    statsVisible: boolean
    character: CharacterModel
    loading: boolean
    currentLevel: number
    currentProficiency: number,
    resetHpModal: boolean
}

export class SelectCharacter extends Component<{ route: any, navigation: any }, SelectCharacterState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            currentProficiency: null,
            currentLevel: null,
            loading: true,
            backGroundStoryVisible: false,
            statsVisible: false,
            character: new CharacterModel(),
            resetHpModal: false
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    onFocus = async () => {
        this.setState({ loading: true })
        setTimeout(() => {
            this.setState({ loading: false })
        }, 1000);
        this.setState({ character: this.props.route.params }, () => {
            this.maxHpCheck();
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 1000);
        this.setState({ character: this.props.route.params }, () => {
            this.maxHpCheck();
            this.setState({ currentLevel: this.state.character.level })
            this.setState({ currentProficiency: switchProficiency(this.state.character.level) })
        })
    }


    listStats = () => {
        const char = this.state.character;
        const modifiers: any[] = Object.entries(this.state.character.modifiers);
        modifiers[0].push(char.strength);
        modifiers[1].push(char.constitution);
        modifiers[2].push(char.dexterity);
        modifiers[3].push(char.intelligence);
        modifiers[4].push(char.wisdom);
        modifiers[5].push(char.charisma);
        return modifiers;
    }

    setLevel = (level: number) => {
        let validLevel: number = level;
        if (level < this.state.character.level) {
            Alert.alert("Lowering Level", "Are you sure you want to lower your level? (this action requires a manual input for max HP)", [{
                text: 'Yes', onPress: () => {
                    if (level < 0 || level.toString() === '') {
                        validLevel = 1;
                    }
                    this.setState({ resetHpModal: true })
                    const character = { ...this.state.character };
                    character.level = validLevel;
                    this.setState({ character, currentLevel: validLevel }, () => {
                        this.setState({ currentProficiency: switchProficiency(this.state.currentLevel) })
                        userCharApi.updateChar(this.state.character)
                    })
                }
            }, {
                text: 'No'
            }])
        } else {
            Alert.alert("Level Up", "Are you sure you wish to level up?", [{
                text: 'Yes', onPress: () => {
                    if (level > 20) {
                        validLevel = 20;
                    }
                    if (level < 0) {
                        validLevel = 1;
                    }
                    const character = { ...this.state.character };
                    character.level = validLevel;
                    this.setState({ character, currentLevel: validLevel }, () => {
                        this.levelUp();
                        this.setState({ currentProficiency: switchProficiency(this.state.currentLevel) })
                    })
                }
            }, { text: 'No' }])
        }
    }

    skillCheck = (skill: string) => {
        const modifiers = Object.entries(this.state.character.modifiers)
        const skillGroup = skillModifier(skill);
        for (let item of modifiers) {
            if (item[0] === skillGroup) {
                return item[1]
            }
        }
    }

    levelUp = () => {
        const character = { ...this.state.character };
        const hitDice = hitDiceSwitch(this.state.character.characterClass);
        let maxHp: number = this.state.character.maxHp;
        maxHp = maxHp + Math.floor(Math.random() * hitDice) + 1;
        character.maxHp = maxHp;
        this.setState({ character }, () => {
            userCharApi.updateChar(this.state.character)
        })

    }

    maxHpCheck = () => {
        if (!this.state.character.maxHp) {
            const character = { ...this.state.character };
            let maxHp = hitDiceSwitch(this.state.character.characterClass) + this.state.character.modifiers.constitution;
            character.maxHp = maxHp;
            this.setState({ character }, () => {
                userCharApi.updateChar(this.state.character)
            })
        }
        return this.state.character.maxHp;
    }

    setNewMaxHp = (maxHp: number) => {
        const character = { ...this.state.character };
        character.maxHp = maxHp;
        this.setState({ character }, () => {
            userCharApi.updateChar(this.state.character);
        })
    }


    render() {
        return (
            <ScrollView>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={styles.container}>
                        <View>
                            <View style={styles.imageContainer}>
                                <View style={styles.upperContainer}>
                                    <View style={{ flexDirection: "column", paddingLeft: 2 }}>
                                        <Image style={styles.image} source={{ uri: `${Config.serverUrl}/assets/${this.state.character.image}` }} />
                                        <AppText textAlign="center" fontSize={25} color={colors.text}>{this.state.character.name}</AppText>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Initiative</AppText>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25} >{this.state.character.modifiers.dexterity}</AppText>
                                                </View>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Level</AppText>
                                                <TouchableOpacity style={styles.triContainer}
                                                    onPress={() => { this.setLevel(this.state.character.level + 1) }}
                                                    onLongPress={() => { this.setLevel(this.state.character.level - 1) }}>
                                                    <AppText fontSize={25}>{this.state.character.level}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Max HP</AppText>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25}>{`${this.state.character.maxHp}`}</AppText>
                                                </View>
                                            </View>
                                            <Modal visible={this.state.resetHpModal}>
                                                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 25 }}>
                                                    <AppText fontSize={18}>Please Input your new max HP score</AppText>
                                                    <AppTextInput placeholder={'Max HP'} keyboardType={"numeric"} onChangeText={(hp: number) => { this.setNewMaxHp(hp) }} />
                                                    <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Ok"} onPress={() => { this.setState({ resetHpModal: false }) }} />
                                                </View>
                                            </Modal>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ alignItems: "center", flex: .9 }}>
                                                <AppText>Proficiency Bonus</AppText>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25}>{`+${this.state.currentProficiency}`}</AppText>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ backGroundStoryVisible: true })}>
                                <IconGen size={80} backgroundColor={colors.primary} name={"book-open-page-variant"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Background Story</AppText>
                                </View>
                            </TouchableOpacity>
                            <Modal visible={this.state.backGroundStoryVisible} animationType="slide">
                                <View style={{ flex: .9, padding: 25 }}>
                                    <AppText textAlign={"left"} fontSize={35} color={colors.bitterSweetRed}>{`${this.state.character.name}'s Story`}</AppText>
                                    <AppText textAlign={"left"} fontSize={20}>{this.state.character.backStory}</AppText>
                                </View>
                                <View style={{ flex: .1, flexDirection: "row", justifyContent: "space-evenly", alignContent: "center" }}>
                                    <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Close'} onPress={() => this.setState({ backGroundStoryVisible: false })} />
                                    <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Update Story'} onPress={() => {
                                        this.setState({ backGroundStoryVisible: false }, () => {
                                            this.props.navigation.navigate("CharBackstory", { updateStory: true, character: this.state.character })
                                        })
                                    }} />
                                </View>
                            </Modal>

                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ statsVisible: true })}>
                                <IconGen size={80} backgroundColor={colors.bitterSweetRed} name={"sword"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Ability Score &amp; Modifiers</AppText>
                                </View>
                            </TouchableOpacity>
                            <Modal visible={this.state.statsVisible} animationType="slide">
                                <View style={{ flex: .9, alignItems: "center" }}>
                                    <AppText color={colors.bitterSweetRed} fontSize={35}>Stats</AppText>
                                    <AppText fontSize={30} >{`${this.state.character.race} ${this.state.character.characterClass}`}</AppText>
                                    <FlatList
                                        data={this.listStats()}
                                        keyExtractor={(stats: [string, number, number]) => stats[0].toString()}
                                        numColumns={2}
                                        renderItem={({ item }) =>
                                            <View style={styles.modifier}>
                                                <View style={styles.innerModifier}>
                                                    <AppText fontSize={18} color={colors.totalWhite} textAlign={"center"}>{item[0]}</AppText>
                                                    <View style={{ paddingTop: 10 }}>
                                                        <AppText textAlign={"center"}>{`Attribute score ${item[2]}`}</AppText>
                                                    </View>
                                                    <View style={{ paddingTop: 5 }}>
                                                        <AppText textAlign={"center"}>Modifier</AppText>
                                                        <AppText textAlign={"center"}>{item[1]}</AppText>
                                                    </View>
                                                </View>
                                            </View>
                                        } />
                                </View>
                                <View style={{ flex: .1 }}>
                                    <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'close'} onPress={() => this.setState({ statsVisible: false })} />
                                </View>
                            </Modal>

                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharItems") }}>
                                <IconGen size={80} backgroundColor={colors.danger} name={"sack"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Items And Currency</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.list, { width: '50%' }]}>
                                    <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Skills:</AppText>
                                    {this.state.character.skills.map(skill =>
                                        <View key={skill} style={styles.skill}>
                                            <AppText>{`${skill} +${this.skillCheck(skill) + this.state.currentProficiency}`}</AppText>
                                        </View>
                                    )}
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", width: "50%" }}>
                                    <AppText fontSize={25}>Hit Dice</AppText>
                                    <AppText fontSize={25} color={colors.bitterSweetRed}>{`D${hitDiceSwitch(this.state.character.characterClass)}`}</AppText>
                                </View>
                            </View>
                            <View style={styles.personality}>
                                <View style={styles.list}>
                                    <TouchableOpacity onLongPress={() => { this.props.navigation.navigate("CharPersonalityTraits", { updateTraits: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Traits:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.personalityTraits.map((trait, index) => <AppText key={index}>{`${index + 1}. ${trait}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity onLongPress={() => { this.props.navigation.navigate("CharIdeals", { updateIdeals: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Ideals:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.ideals.map((ideal, index) => <AppText key={index}>{`${index + 1}. ${ideal}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity onLongPress={() => { this.props.navigation.navigate("CharFlaws", { updateFlaws: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Flaws:</AppText>
                                        {this.state.character.flaws.map((flaw, index) => <AppText key={index}>{`${index + 1}. ${flaw}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity onLongPress={() => { this.props.navigation.navigate("CharBonds", { updateBonds: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Bonds:</AppText>
                                        {this.state.character.bonds.map((bond, index) => <AppText key={index}>{`${index + 1}. ${bond}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    itemModal: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        width: '100%'
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 100,
        resizeMode: "cover",
    },
    iconContainer: {
        flex: .2,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    imageContainer: {
        paddingBottom: 15
    },
    container: {
        paddingTop: 10,
        flex: 1
    },
    infoContainer: {
        flex: .6
    },
    modifier: {
        width: "50%",
        flexWrap: "wrap",
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: "space-around",
    },
    innerModifier: {
        width: 150,
        height: 150,
        backgroundColor: colors.bitterSweetRed,
        borderRadius: 110,
        justifyContent: "center"
    },
    personality: {
        justifyContent: "flex-start",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    list: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: "100%"
    }, upperContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    triContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.bitterSweetRed,
        borderRadius: 70,
        height: 70,
        width: 70
    },
    skill: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bitterSweetRed,
        width: 150,
        padding: 5,
        marginVertical: 2
    }

})