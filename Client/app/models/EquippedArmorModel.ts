export class EquippedArmorModel {
    public constructor(
        public id?: string,
        public name?: string,
        public ac?: number,
        public baseAc?: number,
        public disadvantageStealth?: boolean,
        public armorType?: string,
        public armorBonusesCalculationType?: string
    ) { }
}
