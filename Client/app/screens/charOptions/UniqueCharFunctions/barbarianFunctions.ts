import AsyncStorage from "@react-native-async-storage/async-storage";
import { Vibration } from "react-native";


async function rageInitiator(char_id: string, totalRage: number) {
    let storedNumber = await AsyncStorage.getItem(`Rage${char_id}`);
    if (!storedNumber) {
        await AsyncStorage.setItem(`Rage${char_id}`, totalRage.toString())
        storedNumber = totalRage.toString();
        return storedNumber;
    }
    return storedNumber
}

async function decreaseRage(char_id: string) {
    let newNumber = 0;
    let storedNumber = await AsyncStorage.getItem(`Rage${char_id}`);
    if (storedNumber) {
        newNumber = parseInt(storedNumber) - 1;
        if (newNumber < 0) {
            newNumber = parseInt(storedNumber)
            return newNumber
        }
        await AsyncStorage.setItem(`Rage${char_id}`, newNumber.toString());
        Vibration.vibrate(400)
    }
    return newNumber;
}

async function increaseRage(char_id: string, totalRage: number) {
    let newNumber = 0;
    let storedNumber = await AsyncStorage.getItem(`Rage${char_id}`);
    if (storedNumber) {
        newNumber = parseInt(storedNumber) + 1;
        if (newNumber > totalRage) {
            newNumber = parseInt(storedNumber)
            return newNumber
        }
        await AsyncStorage.setItem(`Rage${char_id}`, newNumber.toString());
        Vibration.vibrate(400)
    }
    return newNumber;
}


export { rageInitiator, decreaseRage, increaseRage }