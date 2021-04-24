import AsyncStorage from "@react-native-async-storage/async-storage";

const setColorName = async (sender_id: string) => {
    const currentColor = await AsyncStorage.getItem(`${sender_id}color`);
    if (!currentColor) {
        const newColor = colorRandomized();
        await AsyncStorage.setItem(`${sender_id}color`, newColor);
        return newColor
    } else {
        return currentColor
    }
}

const displayUserColor = (sender_id: string, userColorArray: { user: string, color: string }[]) => {
    let user = userColorArray.find((item) => item.user === sender_id);
    if (!user) {
        user = { user: sender_id, color: 'black' }
    }
    return user.color
}

const colorRandomized = () => {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

export {
    setColorName,
    displayUserColor
}