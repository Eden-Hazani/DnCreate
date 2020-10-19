export function spellLevelReadingChanger(spellLevel: string) {
    let result: string = ''
    switch (true) {
        case spellLevel === "cantrip":
            result = 'cantrips'
            break;
        case spellLevel === "1":
            result = '1st Level Spells'
            break;
        case spellLevel === "2":
            result = '2nd Level Spells'
            break;
        case spellLevel === "3":
            result = '3rd Level Spells'
            break;
        case spellLevel === "4":
            result = '4th Level Spells'
            break;
        case spellLevel === "5":
            result = '5th Level Spells'
            break;
        case spellLevel === "6":
            result = '6th Level Spells'
            break;
        case spellLevel === "7":
            result = '7th Level Spells'
            break;
        case spellLevel === "8":
            result = '8th Level Spells'
            break;
        case spellLevel === "9":
            result = '9th Level Spells'
            break;
    }
    return result;

}