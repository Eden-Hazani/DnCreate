

const hitDiceSwitch = (charClass: string) => {
    let dice: number = null;
    switch (true) {
        case charClass === "Barbarian":
            dice = 12;
            break;
        case charClass === "Bard":
            dice = 8;
            break;
        case charClass === "Cleric":
            dice = 8;
            break;
        case charClass === "Druid":
            dice = 8;
            break;
        case charClass === "Fighter":
            dice = 10;
            break;
        case charClass === "Monk":
            dice = 8;
            break;
        case charClass === "Paladin":
            dice = 10;
            break;
        case charClass === "Ranger":
            dice = 10;
            break;
        case charClass === "Rouge":
            dice = 8;
            break;
        case charClass === "Sorcerer":
            dice = 6;
            break;
        case charClass === "Warlock":
            dice = 8;
            break;
        case charClass === "Wizard":
            dice = 6;
            break;
    }

    return dice;
}

export default hitDiceSwitch;