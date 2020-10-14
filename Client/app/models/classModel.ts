export class ClassModel {
    public constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public backgroundColor?: string,
        public icon?: string,
        public brifInfo?: string,
        public armorProficiencies?: [],
        public weaponProficiencies?: [],
        public savingThrows?: any[],
        public recommendation?: string,
        public information?: string

    ) { }
}
