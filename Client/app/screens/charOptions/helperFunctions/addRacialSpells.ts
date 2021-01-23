import { RaceModel } from "../../../models/raceModel";


export function addRacialSpells(race: RaceModel) {
    let spells: string[] = []
    if (race.addedSpells)
        switch (true) {
            case race.addedSpells.length > 0:
                for (let item of race.addedSpells) {
                    spells.push(item)
                }
                break;
        }

    return spells
}