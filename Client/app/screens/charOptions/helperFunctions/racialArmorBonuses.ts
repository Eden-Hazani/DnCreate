import { RaceModel } from "../../../models/raceModel";

export function racialArmorBonuses(race: RaceModel) {
    let bonus: number = 0;
    if (race.addedACPoints)
        switch (true) {
            case race.addedACPoints > 0:
                bonus = race.addedACPoints
                break;
        }
    return bonus;
}