import { Colors } from "../app/config/colors"


export function attributeColorCodedGuide(charClass: string) {
    let result: any[] = []
    switch (true) {
        case charClass === "Barbarian":
            result = [Colors.paleGreen, Colors.paleGreen, Colors.yellow, Colors.danger, Colors.danger, Colors.yellow]
            break;
        case charClass === "Druid":
            result = [Colors.yellow, Colors.paleGreen, Colors.yellow, Colors.yellow, Colors.paleGreen, Colors.yellow]
            break;
        case charClass === "Bard":
            result = [Colors.yellow, Colors.yellow, Colors.paleGreen, Colors.yellow, Colors.yellow, Colors.paleGreen]
            break;
        case charClass === "Cleric":
            result = [Colors.paleGreen, Colors.paleGreen, Colors.danger, Colors.yellow, Colors.paleGreen, Colors.yellow]
            break;
        case charClass === "Fighter":
            result = [Colors.paleGreen, Colors.paleGreen, Colors.paleGreen, Colors.danger, Colors.danger, Colors.danger]
            break;
        case charClass === "Monk":
            result = [Colors.yellow, Colors.yellow, Colors.paleGreen, Colors.yellow, Colors.paleGreen, Colors.yellow]
            break;
        case charClass === "Paladin":
            result = [Colors.paleGreen, Colors.yellow, Colors.yellow, Colors.danger, Colors.yellow, Colors.paleGreen]
            break;
        case charClass === "Ranger":
            result = [Colors.yellow, Colors.yellow, Colors.paleGreen, Colors.danger, Colors.paleGreen, Colors.yellow]
            break;
        case charClass === "Rogue":
            result = [Colors.yellow, Colors.yellow, Colors.paleGreen, Colors.paleGreen, Colors.yellow, Colors.yellow]
            break;
        case charClass === "Sorcerer":
            result = [Colors.danger, Colors.paleGreen, Colors.danger, Colors.yellow, Colors.yellow, Colors.paleGreen]
            break;
        case charClass === "Warlock":
            result = [Colors.danger, Colors.paleGreen, Colors.danger, Colors.yellow, Colors.yellow, Colors.paleGreen]
            break;
        case charClass === "Wizard":
            result = [Colors.danger, Colors.paleGreen, Colors.paleGreen, Colors.paleGreen, Colors.yellow, Colors.yellow]
            break;

    }
    return result
}