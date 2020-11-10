import { ModifiersModel } from "./modifiersModel";
import { RaceAbilityModel } from "./raceAbilityModal";

export class RaceModel {
    public constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public image?: string,
        public abilityBonus?: ModifiersModel,
        public raceAbilities?: RaceAbilityModel

    ) {
        if (!abilityBonus) {
            this.abilityBonus = new ModifiersModel()
        }
        if (!raceAbilities) {
            this.raceAbilities = new RaceAbilityModel()
        }
    }
}
