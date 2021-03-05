export function charCanSpellCast(spellClass: string) {
    let canSpellCast: boolean = false
    switch (true) {
        case spellClass === "Bard":
            canSpellCast = true
            break;
        case spellClass === "Cleric":
            canSpellCast = true
            break;
        case spellClass === "Druid":
            canSpellCast = true
            break;
        case spellClass === "Paladin":
            canSpellCast = true
            break;
        case spellClass === "Ranger":
            canSpellCast = true
            break;
        case spellClass === "Sorcerer":
            canSpellCast = true
            break;
        case spellClass === "Warlock":
            canSpellCast = true
            break;
        case spellClass === "Wizard":
            canSpellCast = true
            break;
        case spellClass === "Artificer":
            canSpellCast = true
            break;

    }

    return canSpellCast
}