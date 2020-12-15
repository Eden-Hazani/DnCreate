

export function addRacialSpells(race: string) {
    let spells: string[] = []
    switch (true) {
        case race === "Aasimar":
            spells.push("Light")
            break;
        case race === "Fire Genasi":
            spells.push("Produce Flame")
            break;
        case race === "Water Genasi":
            spells.push("Shape Water")
            break;
        case race === "Yuan-Ti":
            spells.push("Poison Spray")
            break;
    }

    return spells
}