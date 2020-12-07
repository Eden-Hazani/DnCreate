import AsyncStorage from "@react-native-community/async-storage";
import { Vibration } from "react-native";


async function kiPointInitiator(kiPoints: number, char_id: string) {
    let storedNumber = await AsyncStorage.getItem(`kiPoints${char_id}`);
    if (!storedNumber) {
        await AsyncStorage.setItem(`kiPoints${char_id}`, kiPoints.toString())
        storedNumber = kiPoints.toString();
        return storedNumber;
    }
    return storedNumber
}

async function decreaseKiPoint(char_id: string) {
    let storedNumber = await AsyncStorage.getItem(`kiPoints${char_id}`);
    let newNumber = parseInt(storedNumber) - 1;
    if (newNumber < 0) {
        newNumber = parseInt(storedNumber)
        return newNumber
    }
    await AsyncStorage.setItem(`kiPoints${char_id}`, newNumber.toString());
    Vibration.vibrate(400)
    return newNumber;
}

async function increaseKiPoints(char_id: string, kiPoints: number) {
    let storedNumber = await AsyncStorage.getItem(`kiPoints${char_id}`);
    let newNumber = parseInt(storedNumber) + 1;
    if (newNumber > kiPoints) {
        newNumber = parseInt(storedNumber)
        return newNumber
    }
    await AsyncStorage.setItem(`kiPoints${char_id}`, newNumber.toString());
    Vibration.vibrate(400)
    return newNumber;
}


export { increaseKiPoints, decreaseKiPoint, kiPointInitiator }