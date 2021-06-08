import adventureApi from "../../../api/adventureApi";
import { CharacterModel } from "../../../models/characterModel";
import { MessageModal } from "../../../models/MessageModal";
import { setColorName } from "./colorChatName";

const sendMessage = (currentMessage: string, adventure_id: string, participantChar: CharacterModel, adventureIdentifier: string) => {
    if (currentMessage === '') {
        return '';
    }
    const message = new MessageModal();
    message.message = currentMessage;
    message.adventure_id = adventure_id;
    message.sender_id = participantChar._id
    message.date = new Date().getTime();
    message.adventureIdentifier = adventureIdentifier;
    message.senderName = participantChar.name
    return adventureApi.sendMessage(message).then(() => {
        return ''
    }).catch((err) => {
        return ''
    })
}

const getStartingMessages = async (adventure_id: string, userNameColorArray: { user: string, color: string }[]) => {
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
        return ({ messageArray: messages.reverse(), usernameColor: newUserNameColorArray });
    } catch (err) {
        return ({ messageArray: [], usernameColor: [] });
    }
}


const getMessageBatchFromServer = async (adventure_id: string, currentMessageLimit: number) => {
    const result = await adventureApi.getMessages(adventure_id, currentMessageLimit + 20, 20);
    const messages: MessageModal[] = result.data as any
    if (messages.length === 0) {
        return []
    }
    return messages;
}

export { sendMessage, getStartingMessages, getMessageBatchFromServer }