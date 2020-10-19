

export function spellLevelChanger(spellLevel: string) {
    let result: string = ''
    switch (true) {
        case spellLevel === "cantrip":
            result = 'cantrips'
            break;
        case spellLevel === "1":
            result = 'firstLevelSpells'
            break;
        case spellLevel === "2":
            result = 'secondLevelSpells'
            break;
        case spellLevel === "3":
            result = 'thirdLevelSpells'
            break;
        case spellLevel === "4":
            result = 'forthLevelSpells'
            break;
        case spellLevel === "5":
            result = 'fifthLevelSpells'
            break;
        case spellLevel === "6":
            result = 'sixthLevelSpells'
            break;
        case spellLevel === "7":
            result = 'seventhLevelSpells'
            break;
        case spellLevel === "8":
            result = 'eighthLevelSpells'
            break;
        case spellLevel === "9":
            result = 'ninthLevelSpells'
            break;
    }
    return result;

}