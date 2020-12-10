import {
    Animated,
    Dimensions,
    Text,
    View,
    StyleSheet,
    Image,
    StatusBar,
    SafeAreaView,
    Modal,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../config/colors';
import { Config } from '../../config';
import { AppButton } from './AppButton';
import { QuestModal } from '../models/questModel';
import adventureApi from '../api/adventureApi';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import { AppText } from './AppText';
import { CreateQuest } from '../screens/Adventures/leaderComponents/CreateQuest';

const { width, height } = Dimensions.get('window');


const Item = ({ ImageUri, questName, questDescription, questGiver, questLocation, reward, index, scrollX, isDmLevel, _id, completeQuest, isActive, editQuest }: any) => {
    const [descriptionModal, setDescriptionModal] = useState(false)
    const [description, setDescription] = useState('')
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0]
    })

    const translateXName = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.2, 0, -width * 0.2]
    })

    const translateXDescription = scrollX.interpolate({
        inputRange,
        outputRange: [width * 0.6, 0, -width * 0.2]
    })
    const translateXReward = scrollX.interpolate({
        inputRange,
        outputRange: [width * 2, 0, -width * 0.2]
    })
    const translateXQuestGiver = scrollX.interpolate({
        inputRange,
        outputRange: [width * 1.4, 0, -width * 0.2]
    })
    const translateXQuestLocation = scrollX.interpolate({
        inputRange,
        outputRange: [width * 1.8, 0, -width * 0.2]
    })
    const translateXCompleted = scrollX.interpolate({
        inputRange,
        outputRange: [width * 3, 0, -width * 0.2]
    })

    return (
        <View style={styles.itemStyle}>
            <Animated.Image
                source={{ uri: `${Config.serverUrl}/assets/DifficultyDragons/${ImageUri}.png` }}
                style={[
                    styles.imageStyle,
                    {
                        transform: [{ scale: scale }],
                    },
                ]}
            />
            <View style={styles.textContainer}>
                <Animated.Text style={[styles.heading,
                { transform: [{ translateX: translateXName }], color: Colors.berries }
                ]}>{questName}</Animated.Text>

                <TouchableOpacity onPress={() => {
                    setDescription(questDescription);
                    setDescriptionModal(true);
                }}>
                    <Animated.Text style={[styles.description,
                    { transform: [{ translateX: translateXDescription }], color: Colors.whiteInDarkMode }
                    ]}>{questDescription.substring(0, 120).replace('\n', ' ')}...</Animated.Text>
                </TouchableOpacity>

                <Animated.Text style={[styles.reward,
                { transform: [{ translateX: translateXQuestGiver }], color: Colors.burgundy }
                ]}>Quest giver: {questGiver}</Animated.Text>

                <Animated.Text style={[styles.reward,
                { transform: [{ translateX: translateXQuestLocation }], color: Colors.burgundy }
                ]}>Location: {questLocation}</Animated.Text>

                <Animated.Text style={[styles.reward,
                { transform: [{ translateX: translateXReward }], color: Colors.burgundy }
                ]}>Reward: {reward}</Animated.Text>

            </View>
            <View style={styles.removeButton}>
                {isDmLevel &&
                    <View style={{ flexDirection: 'row' }}>
                        <AppButton padding={20} backgroundColor={Colors.pinkishSilver} onPress={() => { completeQuest(_id) }}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"Complete Quest"} />
                        <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => { editQuest(_id) }}
                            fontSize={18} borderRadius={25} width={120} height={65} title={"Edit"} />
                    </View>
                }
            </View>
            <Animated.View style={{ position: "absolute", top: height / 1.4, transform: [{ rotate: "-15deg" }, { translateX: translateXCompleted }] }}>
                {!isActive &&
                    <AppText color={Colors.bitterSweetRed} fontSize={35}> - Completed - </AppText>
                }
            </Animated.View>
            <Modal visible={descriptionModal} animationType='slide'>
                <View style={{ backgroundColor: Colors.pageBackground, flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <AppText padding={10} textAlign={'center'} fontSize={18}>{description}</AppText>
                    <AppButton padding={20} backgroundColor={Colors.pinkishSilver} onPress={() => {
                        setDescription('');
                        setDescriptionModal(false);
                    }}
                        fontSize={18} borderRadius={25} width={120} height={65} title={"Close"} />
                </View>
            </Modal>

        </View>
    )
}

export default function AnimatedCenterHorizontalList(data: any) {
    const [editModal, setEditModal] = useState(false)
    const [edit, setEdit] = useState('')
    const [adventure, setAdventure] = useState(data.data)
    const [quests, setQuests] = useState(data.isActive ? adventure.quests.filter((quest: QuestModal) => quest.active) : adventure.quests.filter((quest: QuestModal) => !quest.active))
    useEffect(() => { setQuests(data.isActive ? adventure.quests.filter((quest: QuestModal) => quest.active) : adventure.quests.filter((quest: QuestModal) => !quest.active)) }, [adventure])
    const scrollX = React.useRef(new Animated.Value(0)).current
    const completeQuest = (quest_id: string) => {
        const newAdventure = { ...adventure }
        const newQuestList = adventure.quests.map((quest: QuestModal) => {
            if (quest._id === quest_id) {
                quest.active = false
            }
            return quest
        });
        newAdventure.quests = newQuestList;
        setAdventure(newAdventure)
        adventureApi.updateAdventure(newAdventure);
        store.dispatch({ type: ActionType.UpdateSingleAdventure, payload: newAdventure });
        const activeQuests = adventure.quests.filter((quest: QuestModal) => quest.active)
        setQuests(activeQuests)
    }

    const editQuest = (quest_id: string) => {
        const quest = quests.filter((item: QuestModal) => item._id === quest_id);
        setEdit(quest)
        setEditModal(true)
    }
    return (
        <View style={styles.container}>
            <Animated.FlatList
                keyExtractor={(item: any, index: any) => index.toString()}
                data={quests}
                renderItem={({ item, index }: any) => <Item {...item} isActive={data.isActive} index={index} scrollX={scrollX} isDmLevel={data.isDmLevel}
                    editQuest={(quest_id: string) => { editQuest(quest_id) }} completeQuest={(quest_id: string) => { completeQuest(quest_id) }} />}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            />
            <Modal visible={editModal}>
                <CreateQuest adventure={adventure} close={(val: any) => {
                    setAdventure(val.info)
                    setQuests(adventure.quests.filter((quest: QuestModal) => quest.active))
                    setEditModal(val.isDone)
                }} edit={{ true: true, quest: edit[0] }} />
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    itemStyle: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        borderRadius: 25,
        width: width * 0.85,
        height: width * 0.85,
        resizeMode: 'contain',
        flex: .3,
    },
    textContainer: {
        alignItems: 'flex-start',
        alignSelf: "center",
        flex: 0.5,
    },
    removeButton: {
        flex: .4
    },
    heading: {
        fontFamily: "KumbhSans-Light",
        textTransform: 'uppercase',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 2,
        width: width * 0.75,
        marginBottom: 10,
    },
    description: {
        fontFamily: "KumbhSans-Light",
        fontWeight: '600',
        textAlign: 'left',
        width: width * 0.75,
        marginRight: 10,
        fontSize: 16,
        lineHeight: 16 * 1.5,
    },
    reward: {
        fontFamily: "KumbhSans-Light",
        fontWeight: '600',
        textAlign: "left",
        width: width * 0.75,
        marginRight: 10,
        marginTop: 15,
        fontSize: 20,
        lineHeight: 16 * 1.5,
    }
})