import { string } from "yup";

export class WeaponModal {
    public constructor(
        public _id?: string,
        public dice?: string,
        public diceAmount?: number,
        public name?: string,
        public description?: string,
        public specialAbilities?: string,
        public modifier?: string,
        public isProficient?: boolean,
        public removable?: boolean
    ) { }
}
