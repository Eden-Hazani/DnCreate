import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../../../components/AppText';
import { AppForm } from '../../../components/forms/AppForm';
import * as Yup from 'yup';
import { AppFormField } from '../../../components/forms/AppFormField';
import { SubmitButton } from '../../../components/forms/SubmitButton';
import { AdventureModel } from '../../../models/AdventureModel';
import { QuestModal } from '../../../models/questModel';
import adventureApi from '../../../api/adventureApi';
import { AppConfirmation } from '../../../components/AppConfirmation';
import { Colors } from '../../../config/colors';
import AuthContext from '../../../auth/context';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';
import { AppButton } from '../../../components/AppButton';
import errorHandler from '../../../../utility/errorHander';
import logger from '../../../../utility/logger';


const ValidationSchema = Yup.object().shape({
    questName: Yup.string().required().label("Quest Name"),
    questDescription: Yup.string().required().label("Quest Description"),
    questGiver: Yup.string().label("Quest Giver"),
    questLocation: Yup.string().label("Quest Location"),
    reward: Yup.string().label("Reward"),

})
const difficultyLevel = ["Very Easy", "Easy", "Medium", "Hard", "Challenging", "Very Hard", "Die Trying"]

interface CreateQuestState {
    adventure: AdventureModel
    completed: boolean
    difficultyPicked: string,
    difficultyClicked: boolean[],
    oldQuestValues: QuestModal

}

export class CreateQuest extends Component<{ adventure: AdventureModel, close: any, edit: any }, CreateQuestState> {
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            difficultyPicked: "",
            difficultyClicked: [],
            completed: false,
            adventure: this.props.adventure,
            oldQuestValues: new QuestModal()
        }
    }

    componentDidMount() {
        if (this.props.edit?.true && this.props.adventure.quests) {
            const quest = this.props.adventure.quests.filter((item: QuestModal) => item._id === this.props.edit.quest._id);
            this.setState({ oldQuestValues: quest[0] })
        }
    }
    createQuest = async (values: any) => {
        try {
            const quest: QuestModal = {
                _id: `${Math.floor((Math.random() * 1000000) + 1)}`,
                active: true,
                questName: values.questName,
                questGiver: values.questGiver,
                questDescription: values.questDescription,
                questLocation: values.questLocation,
                reward: values.reward,
                ImageUri: this.state.difficultyPicked
            }
            if (this.state.adventure.adventureIdentifier) {
                const adventureObj = await adventureApi.getSingleLeadingAdventure(this.context.user._id, this.state.adventure.adventureIdentifier);
                if (!adventureObj.ok) {
                    alert(adventureObj.ok);
                    return;
                }
                const adventure = adventureObj.data ? adventureObj.data[0] : new AdventureModel();
                adventure.quests.push(quest);
                this.setState({ adventure, completed: true }, () => {
                    store.dispatch({ type: ActionType.UpdateSingleAdventure, payload: this.state.adventure });
                    adventureApi.editAdventure(this.state.adventure).then(() => {
                        setTimeout(() => {
                            this.props.close(false)
                        }, 1200);
                    })
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    editQuest = async (values: any, _id: string) => {
        try {
            const oldQuest = this.props.edit?.quest;
            const newQuest: QuestModal = {
                active: true,
                questName: values.questName,
                questGiver: values.questGiver,
                questDescription: values.questDescription,
                questLocation: values.questLocation,
                reward: values.reward,
                ImageUri: (oldQuest && this.state.difficultyPicked.length === 0) ? oldQuest.ImageUri : this.state.difficultyPicked,
            }
            if (this.state.adventure.adventureIdentifier) {
                const adventureObj = await adventureApi.getSingleLeadingAdventure(this.context.user._id, this.state.adventure.adventureIdentifier);
                if (!adventureObj.ok) {
                    alert(adventureObj.ok);
                    return;
                }
                console.log(adventureObj.data)
                const adventure = adventureObj.data ? adventureObj.data[0] : new AdventureModel();
                const newQuestList = adventure.quests.map((quest: QuestModal) => {
                    if (quest._id === _id) {
                        quest = newQuest
                    }
                    return quest
                });
                adventure.quests = newQuestList
                this.setState({ adventure, completed: true }, () => {
                    store.dispatch({ type: ActionType.UpdateSingleAdventure, payload: this.state.adventure });
                    adventureApi.editAdventure(this.state.adventure).then(() => {
                        setTimeout(() => {
                            this.props.close({ isDone: false, info: this.state.adventure })
                        }, 1200);
                    })
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickDifficulty = (difficulty: string, index: number) => {
        let difficultyClicked = this.state.difficultyClicked;
        difficultyClicked = [];
        difficultyClicked[index] = true;
        this.setState({ difficultyPicked: difficulty, difficultyClicked })
    }

    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                {this.state.completed ? <AppConfirmation visible={this.state.completed} /> :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                            <AppText textAlign={'center'} fontSize={20}>Create a new quest for your adventure group!</AppText>
                            <AppText textAlign={'center'} fontSize={17}>Once you create the quest it will be available for the party to see and track.</AppText>
                        </View>
                        <AppForm
                            initialValues={{
                                questName: this.props.edit.true ? this.props.edit.quest.questName : ''
                                , questDescription: this.props.edit.true ? this.props.edit.quest.questDescription : ''
                                , questGiver: this.props.edit.true ? this.props.edit.quest.questGiver : ''
                                , questLocation: this.props.edit.true ? this.props.edit.quest.questLocation : ''
                                , reward: this.props.edit.true ? this.props.edit.quest.reward : ''
                            }}
                            onSubmit={(values: any) => this.props.edit.true ? this.editQuest(values, this.props.edit.quest._id) : this.createQuest(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    value={this.props.edit.true ? this.state.oldQuestValues.questName : null}
                                    onChange={(e: any = {}) => {
                                        const oldQuestValues = { ...this.state.oldQuestValues };
                                        oldQuestValues.questName = e.nativeEvent.text
                                        this.setState({ oldQuestValues })
                                    }}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    fieldName={"questName"}
                                    iconName={"text-short"}
                                    placeholder={"Quest Name..."} />
                                <AppFormField
                                    value={this.props.edit.true ? this.state.oldQuestValues.questGiver : null}
                                    onChange={(e: any = {}) => {
                                        const oldQuestValues = { ...this.state.oldQuestValues };
                                        oldQuestValues.questGiver = e.nativeEvent.text
                                        this.setState({ oldQuestValues })
                                    }}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    fieldName={"questGiver"}
                                    iconName={"text-short"}
                                    placeholder={"Quest Giver..."} />
                                <AppFormField
                                    value={this.props.edit.true ? this.state.oldQuestValues.questLocation : null}
                                    onChange={(e: any = {}) => {
                                        const oldQuestValues = { ...this.state.oldQuestValues };
                                        oldQuestValues.questLocation = e.nativeEvent.text
                                        this.setState({ oldQuestValues })
                                    }}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    fieldName={"questLocation"}
                                    iconName={"text-short"}
                                    placeholder={"Quest Location..."} />
                                <AppFormField
                                    value={this.props.edit.true ? this.state.oldQuestValues.reward : null}
                                    onChange={(e: any = {}) => {
                                        const oldQuestValues = { ...this.state.oldQuestValues };
                                        oldQuestValues.reward = e.nativeEvent.text
                                        this.setState({ oldQuestValues })
                                    }}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    fieldName={"reward"}
                                    iconName={"text-short"}
                                    placeholder={"Reward..."} />
                                <AppFormField
                                    value={this.props.edit.true ? this.state.oldQuestValues.questDescription : null}
                                    onChange={(e: any = {}) => {
                                        const oldQuestValues = { ...this.state.oldQuestValues };
                                        oldQuestValues.questDescription = e.nativeEvent.text
                                        this.setState({ oldQuestValues })
                                    }}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"questDescription"}
                                    iconName={"text-short"}
                                    placeholder={"Quest Description..."} />
                            </View>
                            <View>
                                <AppText textAlign={'center'} fontSize={20}>Difficulty Level:</AppText>
                                <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                                    {difficultyLevel.map((item: any, index: any) => <TouchableOpacity key={index} onPress={() => this.pickDifficulty(item, index)}
                                        style={[styles.item, { backgroundColor: this.state.difficultyClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                        <AppText textAlign={'center'}>{item}</AppText>
                                    </TouchableOpacity>)}
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <SubmitButton textAlign={'center'} title={this.props.edit.true ? "Ok" : "Create Quest"} marginBottom={1} />
                                <AppButton padding={20} backgroundColor={Colors.pinkishSilver} onPress={() => { this.props.close({ isDone: false, info: this.state.adventure }) }}
                                    fontSize={18} borderRadius={25} width={120} height={65} title={"Exit and Cancel"} />
                            </View>
                        </AppForm>
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});