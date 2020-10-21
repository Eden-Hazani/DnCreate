import { CharacterModel } from "../models/characterModel";

const Barbarian = (level: number, character: CharacterModel) => {
    let paths: string[] = ["Ancestral Guardian", "Battlerager", "Beast", "Berserker", "Storm Herald", "Totem Warrior", "Wild Soul", "Zealot", "Depths", "Juggernaut"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 2, rageDamage: 2 }
            }
            break;
        case level === 2:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 2, rageDamage: 2 }
            }
            break;
        case level === 3:
            LevelUpFunction = {
                operation: true, action: { pathSelector: paths, rageAmount: 3, rageDamage: 2 }
            }
            break;
        case level === 4:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true, rageAmount: 3, rageDamage: 2 }
            }
            break;
        case level === 5:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 3, rageDamage: 2 }
            }
            break;
        case level === 6:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true, rageAmount: 4, rageDamage: 2 }
            }
            break;
        case level === 7:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 4, rageDamage: 2 }
            }
            break;
        case level === 8:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true, rageAmount: 4, rageDamage: 2 }
            }
            break;
        case level === 9:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 4, rageDamage: 3 }
            }
            break;
        case level === 10:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true, rageAmount: 4, rageDamage: 3 }
            }
            break;
        case level === 11:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 4, rageDamage: 3 }
            }
            break;
        case level === 12:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true, rageAmount: 5, rageDamage: 3 }
            }
            break;
        case level === 13:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 5, rageDamage: 3 }
            }
            break;
        case level === 14:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true, rageAmount: 5, rageDamage: 3 }
            }
            break;
        case level === 15:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 5, rageDamage: 3 }
            }
            break;
        case level === 16:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true, rageAmount: 5, rageDamage: 4 }
            }
        case level === 17:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 6, rageDamage: 4 }
            }
            break;
        case level === 18:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 6, rageDamage: 4 }
            }
            break;
        case level === 19:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true, rageAmount: 6, rageDamage: 4 }
            }
        case level === 20:
            LevelUpFunction = {
                operation: true, action: { rageAmount: 99, rageDamage: 4 }
            }
            break;

    }
    return LevelUpFunction;
}


const Bard = (level: number, character: CharacterModel) => {
    let paths: string[] = ["Creation Collage", "Eloquence Collage", "Glamour Collage", "Lore Collage", "Satire Collage", "Totem Warrior", "Spirits Collage", "Swords Collage", "Valor Collage", "Whispers Collage", "Dirge Singer Collage"]
    let LevelUpFunction: any;
    switch (true) {
        case (level === 1):
            LevelUpFunction = {
                operation: true, action: { cantrips: 2, spells: [2, 0, 0, 0, 0, 0, 0, 0, 0], spellsKnown: 4 }
            }
            break;
        case (level === 2):
            LevelUpFunction = {
                operation: true, action: { cantrips: 2, spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], spellsKnown: 5 }
            }
            break;
        case (level === 3):
            LevelUpFunction = {
                operation: true, action: { cantrips: 2, spells: [4, 2, 0, 0, 0, 0, 0, 0, 0], pathSelector: paths, expertise: 2, spellsKnown: 6 }
            }
            break;
        case (level === 4):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true, spellsKnown: 7 }
            }
            break;
        case (level === 5):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 3, 2, 0, 0, 0, 0, 0, 0], spellsKnown: 8 }
            }
            break;
        case (level === 6):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 3, 3, 0, 0, 0, 0, 0, 0], pathFeature: true, spellsKnown: 9 }
            }
            break;
        case (level === 7):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 3, 3, 1, 0, 0, 0, 0, 0], spellsKnown: 10 }
            }
            break;
        case (level === 8):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], abilityPointIncrease: true, spellsKnown: 11 }
            }
            break;
        case (level === 9):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 3, 3, 3, 1, 0, 0, 0, 0], spellsKnown: 12 }
            }
            break;
        case (level === 10):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 0, 0, 0, 0], expertise: 2, spellsKnown: 14 }
            }
            break;
        case (level === 11):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 0, 0, 0], spellsKnown: 15 }
            }
            break;
        case (level === 12):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 0, 0, 0], abilityPointIncrease: true, spellsKnown: 15 }
            }
            break;
        case (level === 13):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 1, 0, 0], spellsKnown: 16 }
            }
            break;
        case (level === 14):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 1, 0, 0], pathFeature: true, spellsKnown: 18 }
            }
            break;
        case (level === 15):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 1, 1, 0], spellsKnown: 19 }
            }
            break;
        case (level === 16):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 1, 1, 0], abilityPointIncrease: true, spellsKnown: 19 }
            }
            break;
        case (level === 17):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 1, 1, 1], spellsKnown: 20 }
            }
            break;
        case (level === 18):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 1, 1, 1, 1], spellsKnown: 22 }
            }
            break;
        case (level === 19):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 2, 1, 1, 1], abilityPointIncrease: true, spellsKnown: 22 }
            }
            break;
        case (level === 20):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 2, 2, 2, 1, 1], spellsKnown: 22 }
            }
            break;
    }
    return LevelUpFunction;
}


const Fighter = (level: number, character: CharacterModel) => {
    let fightingStyle: any[] = [{ name: 'Archery', description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' }, { name: "Defence", description: "While you are wearing armor, you gain a +1 bonus to AC." }, { name: 'dueling', description: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' }, { name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.' },
    { name: 'Protection', description: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' }, { name: 'Two-Weapon Fighting', description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.' }]
    let paths: string[] = ["Arcane Archer", "Banneret", "Brute", "Battle Master", "Cavalier", "Champion", "Echo Knight", "Eldritch Knight", "Monster Hunter", "Psi Knight", "Psychic Warrior", "Rune Knight", "Samurai", "Scout", "Sharpshooter", "Renegade", "Gunslinger"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            LevelUpFunction = {
                operation: true, action: { pickFightingStyle: fightingStyle }
            }
            break;
        case level === 3:
            LevelUpFunction = {
                operation: true, action: { pathSelector: paths }
            }
            break;
        case level === 4:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;
        case level === 6:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;
        case level === 7:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true }
            }
            break;
        case level === 8:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;
        case level === 10:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true }
            }
            break;
        case level === 12:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;
        case level === 14:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;
        case level === 15:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true }
            }
            break;
        case level === 16:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;
        case level === 18:
            LevelUpFunction = {
                operation: true, action: { pathFeature: true }
            }
        case level === 19:
            LevelUpFunction = {
                operation: true, action: { abilityPointIncrease: true }
            }
            break;

    }
    return LevelUpFunction;
}

const Druid = (level: number, character: CharacterModel) => {
    let cantrips: number = 0;
    let spells: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let paths: string[] = ["Dreams", "Moon", "Land", "Shepherd", "Spores", "Stars", "Twilight", "Wildfire"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            cantrips = 2;
            spells = [2, 0, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 2:
            cantrips = 2;
            spells = [3, 0, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathSelector: paths }
            }
            break;
        case level === 3:
            cantrips = 2;
            spells = [4, 2, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 4:
            cantrips = 2;
            spells = [4, 3, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 5:
            cantrips = 3;
            spells = [4, 3, 2, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 6:
            cantrips = 3;
            spells = [4, 3, 3, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true }
            }
            break;
        case level === 7:
            cantrips = 3;
            spells = [4, 3, 3, 1, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 8:
            cantrips = 3;
            spells = [4, 3, 3, 2, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 9:
            cantrips = 3;
            spells = [4, 3, 3, 3, 1, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 10:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true }
            }
            break;
        case level === 11:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 12:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 13:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 1, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 14:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 1, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true }
            }
            break;
        case level === 15:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 1, 1, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 16:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 1, 1, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 17:
            cantrips = 4;
            spells = [4, 3, 3, 3, 2, 1, 1, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 18:
            cantrips = 4;
            spells = [4, 3, 3, 3, 3, 1, 1, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 19:
            cantrips = 4;
            spells = [4, 3, 3, 3, 3, 2, 1, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 20:
            cantrips = 4;
            spells = [4, 3, 3, 3, 3, 2, 2, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
    }

    return LevelUpFunction;
}

const Cleric = (level: number, character: CharacterModel) => {
    let cantrips: number = 0;
    let spells: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let paths: string[] = ["Arcana", "City", "Death", "Forge", "Grave", "Knowledge", "Life", "Light", "Nature", "Order", "Protection", "Tempest", "Trickery",
        "Twilight", "Unity", "War", "Blood", "Solidarity", "Strength", "Strength", "Zeal", "Beauty", "Mind"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            cantrips = 3;
            spells = [2, 0, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathSelector: paths }
            }
            break;
        case level === 2:
            cantrips = 3;
            spells = [3, 0, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true }
            }
            break;
        case level === 3:
            cantrips = 3;
            spells = [4, 2, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 4:
            cantrips = 4;
            spells = [4, 3, 0, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 5:
            cantrips = 4;
            spells = [4, 3, 2, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 6:
            cantrips = 4;
            spells = [4, 3, 3, 0, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true }
            }
            break;
        case level === 7:
            cantrips = 4;
            spells = [4, 3, 3, 1, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 8:
            cantrips = 4;
            spells = [4, 3, 3, 2, 0, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true, abilityPointIncrease: true }
            }
            break;
        case level === 9:
            cantrips = 4;
            spells = [4, 3, 3, 3, 1, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 10:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 0, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 11:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 12:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 0, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 13:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 1, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 14:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 1, 0, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 15:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 1, 1, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 16:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 1, 1, 0];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 17:
            cantrips = 5;
            spells = [4, 3, 3, 3, 2, 1, 1, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, pathFeature: true }
            }
            break;
        case level === 18:
            cantrips = 5;
            spells = [4, 3, 3, 3, 3, 1, 1, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
        case level === 19:
            cantrips = 5;
            spells = [4, 3, 3, 3, 3, 2, 1, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells, abilityPointIncrease: true }
            }
            break;
        case level === 20:
            cantrips = 5;
            spells = [4, 3, 3, 3, 3, 2, 2, 1, 1];
            LevelUpFunction = {
                operation: true, action: { cantrips: cantrips, spells: spells }
            }
            break;
    }

    return LevelUpFunction;
}
const Monk = (level: number, character: CharacterModel) => {
    let paths: string[] = ["Astral Self", "Drunken Master", "Four Elements", "Kensei", "Long Death", "Mercy", "Open Hand", "Shadow", "Soul Knife", "Sun Soul", "Tranquility", "Cobalt Soul", "Living Weapon"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 0, monkMartialArts: 4 }
            }
            break;
        case level === 2:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 2, monkMartialArts: 4 }
            }
            break;
        case level === 3:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 3, monkMartialArts: 4, pathSelector: paths }
            }
            break;
        case level === 4:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 4, monkMartialArts: 4, abilityPointIncrease: true }
            }
            break;
        case level === 5:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 5, monkMartialArts: 6 }
            }
            break;
        case level === 6:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 6, monkMartialArts: 6, pathFeature: true }
            }
            break;
        case level === 7:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 7, monkMartialArts: 6 }
            }
            break;
        case level === 8:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 8, monkMartialArts: 6, abilityPointIncrease: true }
            }
            break;
        case level === 9:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 9, monkMartialArts: 6 }
            }
            break;
        case level === 10:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 10, monkMartialArts: 6 }
            }
            break;
        case level === 11:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 11, monkMartialArts: 8, pathFeature: true }
            }
            break;
        case level === 12:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 12, monkMartialArts: 8, abilityPointIncrease: true }
            }
            break;
        case level === 13:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 13, monkMartialArts: 8 }
            }
            break;
        case level === 14:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 14, monkMartialArts: 8 }
            }
            break;
        case level === 15:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 15, monkMartialArts: 8 }
            }
            break;
        case level === 16:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 16, monkMartialArts: 8, abilityPointIncrease: true }
            }
            break;
        case level === 17:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 17, monkMartialArts: 10, pathFeature: true }
            }
            break;
        case level === 18:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 18, monkMartialArts: 10 }
            }
            break;
        case level === 19:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 19, monkMartialArts: 10, abilityPointIncrease: true }
            }
            break;
        case level === 20:
            LevelUpFunction = {
                operation: true, action: { kiPoints: 20, monkMartialArts: 10 }
            }
            break;

    }
    return LevelUpFunction;
}
const Paladin = (level: number, character: CharacterModel) => {
    let fightingStyle: any[] = [{ name: 'Defense', description: 'While you are wearing armor, you gain a +1 bonus to AC.' }, { name: 'Great Weapon Fighting', description: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.' },
    { name: 'Protection', description: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.' }]
    let paths: string[] = ["Ancients", "Conquest", "Crown", "Devotion", "Glory", "Redemption", "Treachery", "Vengeance", "Watchers", "Oathbreaker"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            LevelUpFunction = false;
            break;
        case level === 2:
            LevelUpFunction = {
                operation: true, action: { spells: [2, 0, 0, 0, 0, 0, 0, 0, 0], pickFightingStyle: fightingStyle }
            }
            break;
        case level === 3:
            LevelUpFunction = {
                operation: true, action: { spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], pathSelector: paths }
            }
            break;
        case level === 4:
            LevelUpFunction = {
                operation: true, action: { spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 5:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 2, 0, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 6:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 2, 0, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 7:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], pathFeature: true }
            }
            break;
        case level === 8:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 9:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 2, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 10:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 2, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 11:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 12:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 13:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 1, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 14:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 1, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 15:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], pathFeature: true }
            }
            break;
        case level === 16:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 17:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 3, 1, 0, 0, 0, 0] }
            }
            break;
        case level === 18:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 3, 1, 0, 0, 0, 0] }
            }
            break;
        case level === 19:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 3, 2, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 20:
            LevelUpFunction = {
                operation: true, action: { spells: [4, 3, 3, 3, 2, 0, 0, 0, 0], pathFeature: true }
            }
            break;
    }
    return LevelUpFunction;
}
const Ranger = (level: number, character: CharacterModel) => {
    let fightingStyle: any[] = [{ name: 'Defense', description: 'While you are wearing armor, you gain a +1 bonus to AC.' }, { name: 'Archery', description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
    { name: 'Dueling', description: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.' }, { name: "Two-Weapon Fighting", description: "When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack." }]
    let paths: string[] = ["Beast Master", "Fey Wanderer", "Horizon Walker", "Gloom Stalker", "Hunter", " Monster Slayer", "Primeval Guardian", "Swarmkeeper"]
    let LevelUpFunction: any;
    switch (true) {
        case level === 1:
            LevelUpFunction = false;
            break;
        case level === 2:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 2, spells: [2, 0, 0, 0, 0, 0, 0, 0, 0], pickFightingStyle: fightingStyle }
            }
            break;
        case level === 3:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 3, spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], pathSelector: paths }
            }
            break;
        case level === 4:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 3, spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 5:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 4, spells: [4, 2, 0, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 6:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 4, spells: [4, 2, 0, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 7:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 5, spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], pathFeature: true }
            }
            break;
        case level === 8:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 5, spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 9:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 6, spells: [4, 3, 2, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 10:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 6, spells: [4, 3, 2, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 11:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 7, spells: [4, 3, 3, 0, 0, 0, 0, 0, 0], pathFeature: true }
            }
            break;
        case level === 12:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 7, spells: [4, 3, 3, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 13:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 8, spells: [4, 3, 3, 1, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 14:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 8, spells: [4, 3, 3, 1, 0, 0, 0, 0, 0] }
            }
            break;
        case level === 15:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 9, spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], pathFeature: true }
            }
            break;
        case level === 16:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 9, spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 17:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 10, spells: [4, 3, 3, 3, 1, 0, 0, 0, 0] }
            }
            break;
        case level === 18:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 10, spells: [4, 3, 3, 3, 1, 0, 0, 0, 0] }
            }
            break;
        case level === 19:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 11, spells: [4, 3, 3, 3, 2, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case level === 20:
            LevelUpFunction = {
                operation: true, action: { spellsKnown: 11, spells: [4, 3, 3, 3, 2, 0, 0, 0, 0] }
            }
            break;
    }
    return LevelUpFunction;
}

const Rogue = (level: number, character: CharacterModel) => {
    let paths: string[] = ["Arcane Trickster", "Assassin", "Inquisitive", "Mastermind", "Phantom", "Revived", "Scout", "Soulknife", "Swashbuckler", "Thief", "Wild Card"]
    let LevelUpFunction: any;
    switch (true) {
        case (level === 1):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 1, expertise: 2 }
            }
            break;
        case (level === 2):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 1 }
            }
            break;
        case (level === 3):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 2, pathSelector: paths }
            }
            break;
        case (level === 4):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 2, abilityPointIncrease: true }
            }
            break;
        case (level === 5):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 3 }
            }
            break;
        case (level === 6):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 3, expertise: 2 }
            }
            break;
        case (level === 7):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 4 }
            }
            break;
        case (level === 8):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 4, abilityPointIncrease: true }
            }
            break;
        case (level === 9):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 5, pathFeature: true }
            }
            break;
        case (level === 10):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 5, abilityPointIncrease: true }
            }
            break;
        case (level === 11):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 6 }
            }
            break;
        case (level === 12):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 6, abilityPointIncrease: true }
            }
            break;
        case (level === 13):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 7, pathFeature: true }
            }
            break;
        case (level === 14):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 7 }
            }
            break;
        case (level === 15):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 8 }
            }
            break;
        case (level === 16):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 8, abilityPointIncrease: true }
            }
            break;
        case (level === 17):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 9, pathFeature: true }
            }
            break;
        case (level === 18):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 9 }
            }
            break;
        case (level === 19):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 10, abilityPointIncrease: true }
            }
            break;
        case (level === 20):
            LevelUpFunction = {
                operation: true, action: { sneakAttackDie: 10 }
            }
            break;
    }
    return LevelUpFunction;
}
const Sorcerer = (level: number, character: CharacterModel) => {
    let paths: string[] = ["Aberrant Mind", "Clockwork Soul", "Inquisitive", "Draconic Bloodline", "Divine Soul",
        "Giant Soul", "Phoenix", "Scout", "Psionic Soul", "Pyromancy", "Sea", "Shadow", "Stone", "Storm", "Wild Magic", "Runechild"]
    let metamagic: any[] = [{ name: "Careful Spell", description: "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell’s full force. To do so, you spend 1 sorcery point and choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell." },
    { name: "Distant Spell", description: "When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell. When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet." },
    { name: "Empowered Spell", description: "When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell." },
    { name: "Extended Spell", description: "When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours." },
    { name: "Heightened Spell", description: "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell." },
    { name: "Quickened Spell", description: "When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting." },
    { name: "Subtle Spell", description: "When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components." },
    { name: "Twinned Spell", description: "When you cast a spell that targets only one creature and doesn’t have a range of self, you can spend a number of sorcery points equal to the spell’s level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip). To be eligible, a spell must be incapable of targeting more than one creature at the spell’s current level. For example, magic missile and scorching ray aren’t eligible, but ray of frost and chromatic orb are." }]
    let LevelUpFunction: any;
    switch (true) {
        case (level === 1):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spellsKnown: 2, spells: [2, 0, 0, 0, 0, 0, 0, 0, 0], pathSelector: paths }
            }
            break;
        case (level === 2):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spellsKnown: 3, spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], sorceryPoints: 2 }
            }
            break;
        case (level === 3):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spellsKnown: 4, spells: [4, 2, 0, 0, 0, 0, 0, 0, 0], sorceryPoints: 3, metamagic: { value: metamagic, amount: 2 } }
            }
            break;
        case (level === 4):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spellsKnown: 5, spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], sorceryPoints: 4, abilityPointIncrease: true }
            }
            break;
        case (level === 5):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spellsKnown: 6, spells: [4, 3, 2, 0, 0, 0, 0, 0, 0], sorceryPoints: 5 }
            }
            break;
        case (level === 6):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spellsKnown: 7, spells: [4, 3, 3, 0, 0, 0, 0, 0, 0], sorceryPoints: 6, pathFeature: true }
            }
            break;
        case (level === 7):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spellsKnown: 8, spells: [4, 3, 3, 1, 0, 0, 0, 0, 0], sorceryPoints: 7 }
            }
            break;
        case (level === 8):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spellsKnown: 9, spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], sorceryPoints: 8, abilityPointIncrease: true }
            }
            break;
        case (level === 9):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spellsKnown: 10, spells: [4, 3, 3, 3, 1, 0, 0, 0, 0], sorceryPoints: 9 }
            }
            break;
        case (level === 10):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 11, spells: [4, 3, 3, 3, 2, 0, 0, 0, 0], sorceryPoints: 10, metamagic: { value: metamagic, amount: 1 } }
            }
            break;
        case (level === 11):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 12, spells: [4, 3, 3, 3, 2, 1, 0, 0, 0], sorceryPoints: 11 }
            }
            break;
        case (level === 12):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 12, spells: [4, 3, 3, 3, 2, 1, 0, 0, 0], sorceryPoints: 12, abilityPointIncrease: true }
            }
            break;
        case (level === 13):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 13, spells: [4, 3, 3, 3, 2, 1, 1, 0, 0], sorceryPoints: 13 }
            }
            break;
        case (level === 14):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 13, spells: [4, 3, 3, 3, 2, 1, 1, 0, 0], sorceryPoints: 14, pathFeature: true }
            }
            break;
        case (level === 15):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 14, spells: [4, 3, 3, 3, 2, 1, 1, 1, 0], sorceryPoints: 15 }
            }
            break;
        case (level === 16):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 14, spells: [4, 3, 3, 3, 2, 1, 1, 1, 0], sorceryPoints: 16, abilityPointIncrease: true }
            }
            break;
        case (level === 17):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 15, spells: [4, 3, 3, 3, 2, 1, 1, 1, 1], sorceryPoints: 17, metamagic: { value: metamagic, amount: 1 } }
            }
            break;
        case (level === 18):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 15, spells: [4, 3, 3, 3, 3, 1, 1, 1, 1], sorceryPoints: 18, pathFeature: true }
            }
            break;
        case (level === 19):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 15, spells: [4, 3, 3, 3, 3, 2, 1, 1, 1], sorceryPoints: 19, abilityPointIncrease: true }
            }
            break;
        case (level === 20):
            LevelUpFunction = {
                operation: true, action: { cantrips: 6, spellsKnown: 15, spells: [4, 3, 3, 3, 3, 2, 2, 1, 1], sorceryPoints: 20 }
            }
            break;
    }
    return LevelUpFunction;
}
const Warlock = (level: number, character: CharacterModel) => {
    let patrons: string[] = ["The Archfey", "The Celestial", "The Fiend", "The Genie", "The Ghost in the Machine", "The Great Old One", "The Hexblade", "The Kraken", "The Lurker in the Deep", "The Noble Genie", "The Raven Queen", "The Seeker", "The Undead", "The Undying"]
    let pacts: any[] = [{ name: "Blade", description: "You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die. You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can’t affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks." },
    { name: "Chain", description: "You learn the find familiar spell and can cast it as a ritual. The spell doesn’t count against your number of spells known. When you cast the spell, you can choose one of the normal forms for your familiar or one of the following special forms: imp, pseudodragon, quasit, or sprite. Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack with its reaction." },
    { name: "Tome", description: "Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class’s spell list (the three needn’t be from the same list). While the book is on your person, you can cast those cantrips at will. They don’t count against your number of cantrips known. If they don’t appear on the warlock spell list, they are nonetheless warlock spells for you. If you lose your Book of Shadows, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die." }]
    let LevelUpFunction: any;
    switch (true) {
        case (level === 1):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 1, cantrips: 2, spellsKnown: 2, spellSlotLevel: 1, pathSelector: patrons }
            }
            break;
        case (level === 2):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 3, spellSlotLevel: 2, eldritchInvocations: 2 }
            }
            break;
        case (level === 3):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 4, spellSlotLevel: 2, eldritchInvocations: 2, pactSelector: pacts }
            }
            break;
        case (level === 4):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 5, spellSlotLevel: 2, eldritchInvocations: 2, abilityPointIncrease: true }
            }
            break;
        case (level === 5):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 6, spellSlotLevel: 3, eldritchInvocations: 3 }
            }
            break;
        case (level === 6):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 7, spellSlotLevel: 3, eldritchInvocations: 3, pathFeature: true }
            }
            break;
        case (level === 7):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 8, spellSlotLevel: 4, eldritchInvocations: 4 }
            }
            break;
        case (level === 8):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 9, spellSlotLevel: 4, eldritchInvocations: 4, abilityPointIncrease: true }
            }
            break;
        case (level === 9):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 3, spellsKnown: 10, spellSlotLevel: 5, eldritchInvocations: 5 }
            }
            break;
        case (level === 10):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 2, cantrips: 4, spellsKnown: 10, spellSlotLevel: 5, eldritchInvocations: 5, pathFeature: true }
            }
            break;
        case (level === 11):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 3, cantrips: 4, spellsKnown: 11, spellSlotLevel: 5, eldritchInvocations: 5 }
            }
            break;
        case (level === 12):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 3, cantrips: 4, spellsKnown: 11, spellSlotLevel: 5, eldritchInvocations: 6, abilityPointIncrease: true }
            }
            break;
        case (level === 13):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 3, cantrips: 4, spellsKnown: 12, spellSlotLevel: 5, eldritchInvocations: 6 }
            }
            break;
        case (level === 14):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 3, cantrips: 4, spellsKnown: 12, spellSlotLevel: 5, eldritchInvocations: 6, pathFeature: true }
            }
            break;
        case (level === 15):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 3, cantrips: 4, spellsKnown: 13, spellSlotLevel: 5, eldritchInvocations: 7 }
            }
            break;
        case (level === 16):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 3, cantrips: 4, spellsKnown: 13, spellSlotLevel: 5, eldritchInvocations: 7, abilityPointIncrease: true }
            }
            break;
        case (level === 17):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 4, cantrips: 4, spellsKnown: 14, spellSlotLevel: 5, eldritchInvocations: 7 }
            }
            break;
        case (level === 18):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 4, cantrips: 4, spellsKnown: 14, spellSlotLevel: 5, eldritchInvocations: 8 }
            }
            break;
        case (level === 19):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 4, cantrips: 4, spellsKnown: 15, spellSlotLevel: 5, eldritchInvocations: 8, abilityPointIncrease: true }
            }
            break;
        case (level === 20):
            LevelUpFunction = {
                operation: true, action: { spellSlots: 4, cantrips: 4, spellsKnown: 15, spellSlotLevel: 5, eldritchInvocations: 8 }
            }
            break;


    }
    return LevelUpFunction;
}
const Wizard = (level: number, character: CharacterModel) => {
    let paths: string[] = ["Abjuration", "Bladesinger", "Chronurgy", "Conjuration", "Divination", "Enchantment", "Evocation", "Graviturgy", "Illusion", "Invention", "Lore Mastery", "Necromancy",
        "Onomancy", "Order of Scribes", "Psionics", "Technomancy", "Theurgy", "Transmutation", "War Magic"]
    let LevelUpFunction: any;
    switch (true) {
        case (level === 1):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [2, 0, 0, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case (level === 2):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [3, 0, 0, 0, 0, 0, 0, 0, 0], pathSelector: paths }
            }
            break;
        case (level === 3):
            LevelUpFunction = {
                operation: true, action: { cantrips: 3, spells: [4, 2, 0, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case (level === 4):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 0, 0, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case (level === 5):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 2, 0, 0, 0, 0, 0, 0] }
            }
            break;
        case (level === 6):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 0, 0, 0, 0, 0, 0], pathFeature: true }
            }
            break;
        case (level === 7):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 1, 0, 0, 0, 0, 0] }
            }
            break;
        case (level === 8):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 2, 0, 0, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case (level === 9):
            LevelUpFunction = {
                operation: true, action: { cantrips: 4, spells: [4, 3, 3, 3, 1, 0, 0, 0, 0] }
            }
            break;
        case (level === 10):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 0, 0, 0, 0] }
            }
            break;
        case (level === 11):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 0, 0, 0] }
            }
            break;
        case (level === 12):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 0, 0, 0], abilityPointIncrease: true }
            }
            break;
        case (level === 13):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 1, 0, 0] }
            }
            break;
        case (level === 14):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 1, 0, 0], pathFeature: true }
            }
            break;
        case (level === 15):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 1, 1, 0] }
            }
            break;
        case (level === 16):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 1, 1, 0], abilityPointIncrease: true }
            }
            break;
        case (level === 17):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 1, 1, 1] }
            }
            break;
        case (level === 18):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 1, 1, 1, 1] }
            }
            break;
        case (level === 19):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 2, 1, 1, 1], abilityPointIncrease: true }
            }
            break;
        case (level === 20):
            LevelUpFunction = {
                operation: true, action: { cantrips: 5, spells: [4, 3, 3, 3, 2, 2, 2, 1, 1] }
            }
            break;


    }
    return LevelUpFunction;
}

export { Barbarian, Bard, Fighter, Druid, Cleric, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard };