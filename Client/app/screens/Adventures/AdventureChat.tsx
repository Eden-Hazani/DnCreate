import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableOpacity, Modal, RefreshControl, FlatList } from 'react-native';
import { Colors } from '../../config/colors';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import { MessageModal } from '../../models/MessageModal';
import adventureApi from '../../api/adventureApi';
import { io } from 'socket.io-client';
import { Config } from '../../../config';
import { DmNoPremium } from './errors/DmNoPremium';
import { PartyMemberNoPremium } from './errors/PartyMemberNoPremium';
import { setColorName } from './functions/colorChatName';
import { Message } from './adventureComponents/Message';
import { getStartingMessages, sendMessage, getMessageBatchFromServer } from './functions/chatFunctions';


const socket = io(Config.serverUrl);

interface Props {
    navigation: any;
    route: any;
}

export function AdventureChat({ navigation, route }: Props) {
    const [currentMessage, setCurrentMessage] = useState<string>('')
    const [messageArray, setMessageArray] = useState<MessageModal[]>([])
    const [keyBoardVisible, setKeyboardVisible] = useState<boolean>(false)
    const [currentMessageLimit, setCurrentMessageLimit] = useState<number>(0)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [userNameColorArray, setUserNameColorArray] = useState<{ user: string, color: string }[]>([]);

    const props = route.params;
    const flatListRef = useRef<FlatList<MessageModal>>(null);

    useEffect(() => {
        if (props.premiumStatus !== "OK") {
            return;
        }
        getMessages();
        socket.connect()
        socket.on(`adventure${props.adventure_id}-messageUpdate`, (message: MessageModal) => {
            pushMessage(message)
        });
        const _keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            });
        return () => {
            socket.disconnect()
            keyboardDidHideListener.remove();
            _keyboardDidShow.remove();
        };
    }, [])

    const pushMessage = (message: MessageModal) => {
        setMessageArray(oldArray => [...oldArray, message]);
    }


    useEffect(() => {
        if (messageArray.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true })
        }
    }, [currentMessage])

    const getMessages = async () => {
        const { messageArray, usernameColor } = await getStartingMessages(props.adventure_id, userNameColorArray);
        setMessageArray(messageArray);
        setUserNameColorArray(usernameColor)
        setTimeout(() => {
            if (messageArray.length > 0) {
                flatListRef.current?.scrollToIndex({ index: messageArray.length - 1 })
            }
        }, 200);
    }

    const loadNextRaceBatch = async () => {
        const messages = await getMessageBatchFromServer(props.adventure_id, currentMessageLimit)
        const newMessages: any = [...messages, ...messageArray];
        setMessageArray(newMessages)
        setCurrentMessageLimit(prevState => prevState + 20)
    }


    return (
        <View style={{ flex: 1 }}>
            {props.premiumStatus === 'DM_ERROR' && <DmNoPremium close={() => navigation.goBack()} />}
            {props.premiumStatus === 'MEMBER_ERROR' && <PartyMemberNoPremium close={() => navigation.goBack()} />}
            {props.premiumStatus === "OK" && <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
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
                                enabled={true}
                                refreshing={refreshing}
                                onRefresh={() => loadNextRaceBatch()}
                            />
                        }
                        data={messageArray}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => <Message item={item} participantChar={props.participantChar} userNameColorArray={userNameColorArray} />}
                    />
                </View>
                <View style={[styles.messageLine, { flex: keyBoardVisible ? .2 : .1 }]}>
                    <AppTextInput marginBottom={'auto'} value={currentMessage} width={250} onChangeText={(message: string) => setCurrentMessage(message)} placeholder={'Message...'} />
                    <TouchableOpacity style={{ zIndex: 20 }} onPress={async () => setCurrentMessage(await sendMessage(currentMessage, props.adventure_id, props.participantChar, props.adventureIdentifier))}>
                        <IconGen size={40} name={"send"} backgroundColor={Colors.bitterSweetRed} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ zIndex: 20 }} onPress={() => navigation.goBack()}>
                        <IconGen size={40} name={"close"} backgroundColor={Colors.bitterSweetRed} />
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageBoardContainer: {
        flex: 1,
    },
    messageLine: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "baseline"
    },
});