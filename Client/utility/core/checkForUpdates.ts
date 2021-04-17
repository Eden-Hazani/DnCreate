import { Alert } from "react-native";
import logger from "../logger";
import * as Updates from 'expo-updates';

const updateCheck = async (resolveCallback: Function) => {
    try {
        const updates = await Updates.checkForUpdateAsync();
        if (updates.isAvailable) {
            Alert.alert("New Update", "DnCreate has a new update, would you like to download it?",
                [{
                    text: 'Yes', onPress: async () => {
                        Updates.fetchUpdateAsync().then(({ isNew }) => {
                            if (isNew) {
                                setTimeout(() => {
                                    Updates.reloadAsync();
                                }, 2000);
                            }
                        }).catch(() => {
                            resolveCallback(false)
                        })
                    }
                }, {
                    text: 'No', onPress: () => {
                        resolveCallback(false)
                    }
                }])
        } else {
            resolveCallback(false)
        }
    } catch (err) {
        logger.log(new Error('Error in updates'))
        logger.log(new Error(err))

        resolveCallback(false)
    }
}

export default updateCheck