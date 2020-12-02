import AsyncStorage from "@react-native-community/async-storage";
import { Vibration } from "react-native";


async function inspirationInitiator(char_id: string, charModifier: number) {
    if (charModifier < 1) { charModifier = 1 }
    let storedNumber = await AsyncStorage.getItem(`Inspiration${char_id}`);
    if (!storedNumber) {
        await AsyncStorage.setItem(`Inspiration${char_id}`, charModifier.toString())
        storedNumber = charModifier.toString();
        return storedNumber;
    }
    return storedNumber
}

async function decreaseInspiration(char_id: string) {
    let storedNumber = await AsyncStorage.getItem(`Inspiration${char_id}`);
    let newNumber = parseInt(storedNumber) - 1;
    if (newNumber < 0) {
        newNumber = parseInt(storedNumber)
        return newNumber
    }
    await AsyncStorage.setItem(`Inspiration${char_id}`, newNumber.toString());
    Vibration.vibrate(400)
    return newNumber;
}

async function increaseInspiration(char_id: string, charModifier: number) {
    if (charModifier < 1) { charModifier = 1 }
    let storedNumber = await AsyncStorage.getItem(`Inspiration${char_id}`);
    let newNumber = parseInt(storedNumber) + 1;
    console.log(charModifier)
    if (newNumber > charModifier) {
        newNumber = parseInt(storedNumber)
        return newNumber
    }
    await AsyncStorage.setItem(`Inspiration${char_id}`, newNumber.toString());
    Vibration.vibrate(400)
    return newNumber;
}


export { inspirationInitiator, increaseInspiration, decreaseInspiration }