import { CharacterModel } from "../../../models/characterModel";
import { RaceModel } from "../../../models/raceModel";


export function addRacialSpells(race: RaceModel, character: CharacterModel) {
    let spells: string[] = []
    if (character.addedRaceFeatures) {
        for (let item of character.addedRaceFeatures) {
            if (item.addedSpells) {
                item.addedSpells.forEach((item: any[]) => {
                    if (item[0] === character.level) {
                        spells.push(item[1])
                    }
                })
            }
        }
    }
    if (race.addedSpells && character.level === 1) {
        switch (true) {
            case race.addedSpells.length > 0:
                for (let item of race.addedSpells) {
                    spells.push(item)
                }
                break;
        }
    }

    return spells
}