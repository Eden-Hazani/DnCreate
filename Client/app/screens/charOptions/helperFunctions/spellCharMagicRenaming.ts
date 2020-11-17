export function spellCharMagicRenaming(spellLevel: string) {
    let result: string = ''
    switch (true) {
        case spellLevel === "cantrips":
            result = 'cantrips'
            break;
        case spellLevel === "firstLevelSpells":
            result = '1st Level Spells'
            break;
        case spellLevel === "secondLevelSpells":
            result = '2nd Level Spells'
            break;
        case spellLevel === "thirdLevelSpells":
            result = '3rd Level Spells'
            break;
        case spellLevel === "forthLevelSpells":
            result = '4th Level Spells'
            break;
        case spellLevel === "fifthLevelSpells":
            result = '5th Level Spells'
            break;
        case spellLevel === "sixthLevelSpells":
            result = '6th Level Spells'
            break;
        case spellLevel === "seventhLevelSpells":
            result = '7th Level Spells'
            break;
        case spellLevel === "eighthLevelSpells":
            result = '8th Level Spells'
            break;
        case spellLevel === "ninthLevelSpells":
            result = '9th Level Spells'
            break;
    }
    return result;

}