import AsyncStorage from "@react-native-async-storage/async-storage";


async function layOnHandsInitiator(char_id: string, charLevel: number) {
    let layOnHandsAmount = 5 * charLevel;
    let storedNumber = await AsyncStorage.getItem(`layOnHands${char_id}`);
    if (!storedNumber) {
        await AsyncStorage.setItem(`layOnHands${char_id}`, layOnHandsAmount.toString())
        storedNumber = layOnHandsAmount.toString()
    }
    return { layOnHandsAmount, storedNumber: storedNumber };
}

async function changeLayOnHands(char_id: string, input: number, charLevel: number) {
    let storedNumber = await AsyncStorage.getItem(`layOnHands${char_id}`);
    let layOnHandsAmount = 5 * charLevel;
    if (storedNumber) {
        if (input < 0) {
            return { alertMes: alert("Cannot be negative."), stayOpen: true, newNumber: parseInt(storedNumber) }
        }
        if (input > layOnHandsAmount) {
            return { alertMes: alert("Cannot be grater than total amount."), stayOpen: true, newNumber: parseInt(storedNumber) }
        }
    }
    await AsyncStorage.setItem(`layOnHands${char_id}`, input.toString());
    return { newNumber: input, stayOpen: false };
}



export { layOnHandsInitiator, changeLayOnHands }