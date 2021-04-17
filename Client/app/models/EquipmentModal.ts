import { ModifiersModel } from "./modifiersModel";
import { RaceAbilityModel } from "./raceAbilityModal";

export class EquipmentModal {
    public constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public image?: string,
        public equipmentType?: string,
        public isEquipped?: boolean,
        public addedAc?: number,
        public addedDam?: number
    ) { }
}
