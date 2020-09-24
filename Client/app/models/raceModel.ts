import { ModifiersModel } from "./modifiersModel";

export class RaceModel {
    public constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public image?: string,
        public abilityBonus?: ModifiersModel

    ) {
        if (!abilityBonus) {
            this.abilityBonus = new ModifiersModel()
        }
    }
}
