import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { Colors } from '../../config/colors';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { MessageModal } from '../../models/MessageModal';
import { CharacterModel } from '../../models/characterModel';
import adventureApi from '../../api/adventureApi';
import logger from '../../../utility/logger';
import { io } from 'socket.io-client';
import { Config } from '../../../config';
import AuthContext from '../../auth/context';
import authApi from '../../api/authApi';
import { DmNoPremium } from './errors/DmNoPremium';
import { PartyMemberNoPremium } from './errors/PartyMemberNoPremium';
import { displayUserColor, setColorName } from './functions/colorChatName';


const socket = io(Config.serverUrl);

export function AdventureChat({ DM_id, participantChar, adventure_id, adventureIdentifier }: any) {
    const [chatOpen, setChatOpen] = useState<boolean>(false)
    const [currentMessage, setCurrentMessage] = useState<string>('')
    const [messageArray, setMessageArray] = useState<MessageModal[]>([])
    const [keyBoardVisible, setKeyboardVisible] = useState<boolean>(false)
    const [currentMessageLimit, setCurrentMessageLimit] = useState<number>(0)
    const [lastPushedMessage, setLastPushedMessage] = useState<MessageModal>(new MessageModal())
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [noPremium, setNoPremium] = useState<string>('')
    const [userNameColorArray, setUserNameColorArray] = useState<{ user: string, color: string }[]>([]);

    const userContext: any = useContext(AuthContext)
    const flatListRef = useRef<FlatList<MessageModal>>(null);

    const handleClick = () => {
        setChatOpen(prevState => !prevState)
    }


    useEffect(() => {
        getMessages()
        socket.on(`adventure${adventure_id}-messageUpdate`, (message: MessageModal) => {
            pushMessage(message)
        });
        const _keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true); // or some other action
        });
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            });
        return () => {
            socket.disconnect()
            keyboardDidHideListener.remove();
            _keyboardDidShow.remove();
        };
    }, [])

    const pushMessage = (message: MessageModal) => {
        setMessageArray(oldArray => [...oldArray, message]);
        setLastPushedMessage(message)
    }

    useEffect(() => {
        setTimeout(() => {
            if (messageArray.length > 0) {
                flatListRef.current?.scrollToIndex({ index: messageArray.length - 1 })
            }
        }, 50);
    }, [chatOpen])

    useEffect(() => {
        if (messageArray.length > 0) {
            flatListRef.current?.scrollToIndex({ index: messageArray.length - 1 })
        }
    }, [lastPushedMessage])

    const sendMessage = () => {
        try {
            if (currentMessage === '') {
                return;
            }
            const message = new MessageModal();
            message.message = currentMessage;
            message.adventure_id = adventure_id;
            message.sender_id = participantChar._id
            message.date = new Date().getTime();
            message.adventureIdentifier = adventureIdentifier;
            message.senderName = participantChar.name
            adventureApi.sendMessage(message).then(() => setCurrentMessage(''))
        } catch (err) {
            logger.log(err)
        }
    }
    const getMessages = async () => {
        try {
            const result = await adventureApi.getMessages(adventure_id, 0, 20);
            const messages: MessageModal[] = result.data as any
            const newUserNameColorArray: { user: string, color: string }[] = []
            for (let item of messages) {
                const recognizedUser = userNameColorArray.find((user) => user.user === item.sender_id);
                if (!recognizedUser) {
                    const newColor = await setColorName(item.sender_id as string);
                    newUserNameColorArray.push({ user: item.sender_id || '', color: newColor })
                }
            }
            setUserNameColorArray(newUserNameColorArray)
            setMessageArray(messages.reverse())
        } catch (err) {
            console.log(err)
        }
    }

    const loadNextRaceBatch = async () => {
        const result = await adventureApi.getMessages(adventure_id, currentMessageLimit + 20, 20);
        const messages: MessageModal[] = result.data as any
        if (messages.length === 0) {
            return
        }
        const newMessages: any = [...messages, ...messageArray];
        setMessageArray(newMessages)
        setCurrentMessageLimit(prevState => prevState + 20)
    }


    return (
        <View >
            <AppButton
                borderRadius={15} width={150} height={70} title={"Adventure Chat"} backgroundColor={Colors.bitterSweetRed}
                onPress={async () => {
                    if (participantChar.name === 'DM' && !userContext.user.premium) {
                        setNoPremium('DM')
                        return;
                    }
                    else if (participantChar.name !== 'DM') {
                        const result = await authApi.isPremium(DM_id);
                        if (result.data === 'false') {
                            setNoPremium('Member')
                            return;
                        }
                    }
                    handleClick()
                }} />
            <Modal visible={noPremium !== ''}>
                {noPremium === 'DM' && <DmNoPremium close={() => setNoPremium('')} />}
                {noPremium === 'Member' && <PartyMemberNoPremium close={() => setNoPremium('')} />}
            </Modal>
            <Modal visible={chatOpen}>
                <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                    <View style={styles.messageBoardContainer}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            onScrollToIndexFailed={info => {
                                const wait = new Promise(resolve => setTimeout(resolve, 500));
                                wait.then(() => {
                                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                                });
                            }}
                            ref={flatListRef}
                            style={{ flex: 1 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => loadNextRaceBatch()}
                                />
                            }
                            data={messageArray}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => <View style={[item.senderName === participantChar.name ? styles.messageBox : styles.messageBoxOthers, { backgroundColor: item.senderName === 'DM' ? Colors.metallicBlue : item.senderName === participantChar.name ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <AppText color={displayUserColor(item.sender_id || '', userNameColorArray)}
                                        fontSize={12}>: {item.senderName}</AppText>
                                </View>
                                <AppText fontSize={15}>{item.message}</AppText>
                                <View style={[item.senderName === participantChar.name ? styles.rightArrow : styles.leftArrow, { backgroundColor: item.senderName === 'DM' ? Colors.metallicBlue : item.senderName === participantChar.name ? Colors.bitterSweetRed : Colors.lightGray }]}></View>
                                <View style={[item.senderName === participantChar.name ? styles.rightArrowOverlap : styles.leftArrowOverlap, { backgroundColor: Colors.pageBackground }]}></View>
                            </View>}
                        />
                    </View>
                    <View style={[styles.messageLine, { flex: keyBoardVisible ? .2 : .1 }]}>
                        <AppTextInput marginBottom={'auto'} value={currentMessage} width={250} onChangeText={(message: string) => setCurrentMessage(message)} placeholder={'Message...'} />
                        <TouchableOpacity style={{ zIndex: 20 }} onPress={() => sendMessage()}>
                            <IconGen size={40} name={"send"} backgroundColor={Colors.bitterSweetRed} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ zIndex: 20 }} onPress={() => setChatOpen(false)}>
                            <IconGen size={40} name={"close"} backgroundColor={Colors.bitterSweetRed} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageBoardContainer: {
        flex: .9,
    },
    messageLine: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "baseline"
    },
    messageBox: {
        padding: 10,
        marginLeft: '45%',
        borderRadius: 15,
        marginTop: 5,
        marginRight: "5%",
        maxWidth: '50%',
        alignSelf: 'flex-end',
    },
    messageBoxOthers: {
        padding: 10,
        marginEnd: '45%',
        borderRadius: 15,
        marginTop: 5,
        marginLeft: "5%",
        maxWidth: '50%',
        alignSelf: 'flex-start',
    },

    rightArrow: {
        position: "absolute",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10
    },
    rightArrowOverlap: {
        position: "absolute",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20
    },
    leftArrow: {
        position: "absolute",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left: -10
    },

    leftArrowOverlap: {
        position: "absolute",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -20
    }
});