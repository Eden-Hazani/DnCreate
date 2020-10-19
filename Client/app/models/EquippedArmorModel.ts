export class EquippedArmorModel {
    public constructor(
        public id?: string,
        public name?: string,
        public ac?: number,
        public disadvantageStealth?: boolean,
        public armorType?: string
    ) { }
}
