import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { MessageModal } from '../../../models/MessageModal';
import { displayUserColor } from '../functions/colorChatName';

interface Props {
    participantChar: CharacterModel;
    item: MessageModal;
    userNameColorArray: { user: string, color: string }[]
}

export function Message({ item, participantChar, userNameColorArray }: Props) {
    return (
        <View style={[item.senderName === participantChar.name ? styles.messageBox : styles.messageBoxOthers,
        {
            backgroundColor: item.senderName === 'DM' ? Colors.metallicBlue : item.senderName === participantChar.name ? Colors.bitterSweetRed :
                Colors.lightGray
        }]}>
            <View style={{ alignItems: 'flex-end' }}>
                <AppText color={displayUserColor(item.sender_id || '', userNameColorArray)} fontSize={12}>: {item.senderName}</AppText>
            </View>
            <AppText fontSize={15}>{item.message}</AppText>
            <View style={[item.senderName === participantChar.name ? styles.rightArrow : styles.leftArrow, {
                backgroundColor: item.senderName === 'DM' ?
                    Colors.metallicBlue : item.senderName === participantChar.name ? Colors.bitterSweetRed : Colors.lightGray
            }]}></View>

            <View style={[item.senderName === participantChar.name ? styles.rightArrowOverlap : styles.leftArrowOverlap, { backgroundColor: Colors.pageBackground }]}></View>
        </View>
    )
}


const styles = StyleSheet.create({
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