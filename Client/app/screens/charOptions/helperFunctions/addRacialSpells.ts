

export function addRacialSpells(race: string) {
    let spells: string[] = []
    switch (true) {
        case race === "Aasimar":
            spells.push("Light")
    }

    return spells
}