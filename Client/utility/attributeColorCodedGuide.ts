import colors from "../app/config/colors"


export function attributeColorCodedGuide(charClass: string) {
    let result: any[] = []
    switch (true) {
        case charClass === "Barbarian":
            result = [colors.paleGreen, colors.paleGreen, colors.yellow, colors.danger, colors.danger, colors.yellow]
            break;
        case charClass === "Druid":
            result = [colors.yellow, colors.paleGreen, colors.yellow, colors.yellow, colors.paleGreen, colors.yellow]
            break;
        case charClass === "Bard":
            result = [colors.yellow, colors.yellow, colors.paleGreen, colors.yellow, colors.yellow, colors.paleGreen]
            break;
        case charClass === "Cleric":
            result = [colors.paleGreen, colors.paleGreen, colors.danger, colors.yellow, colors.paleGreen, colors.yellow]
            break;
        case charClass === "Fighter":
            result = [colors.paleGreen, colors.paleGreen, colors.paleGreen, colors.danger, colors.danger, colors.danger]
            break;
        case charClass === "Monk":
            result = [colors.yellow, colors.yellow, colors.paleGreen, colors.yellow, colors.paleGreen, colors.yellow]
            break;
        case charClass === "Paladin":
            result = [colors.paleGreen, colors.yellow, colors.yellow, colors.danger, colors.yellow, colors.paleGreen]
            break;
        case charClass === "Ranger":
            result = [colors.yellow, colors.yellow, colors.paleGreen, colors.danger, colors.paleGreen, colors.yellow]
            break;
        case charClass === "Rogue":
            result = [colors.yellow, colors.yellow, colors.paleGreen, colors.paleGreen, colors.yellow, colors.yellow]
            break;
        case charClass === "Sorcerer":
            result = [colors.danger, colors.paleGreen, colors.danger, colors.yellow, colors.yellow, colors.paleGreen]
            break;
        case charClass === "Warlock":
            result = [colors.danger, colors.paleGreen, colors.danger, colors.yellow, colors.yellow, colors.paleGreen]
            break;
        case charClass === "Wizard":
            result = [colors.danger, colors.paleGreen, colors.paleGreen, colors.paleGreen, colors.yellow, colors.yellow]
            break;

    }
    return result
}