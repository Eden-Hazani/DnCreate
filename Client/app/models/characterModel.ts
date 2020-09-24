import { ModifiersModel } from "./modifiersModel";

export class CharacterModel {
    public constructor(
        public _id?: string,
        public user_id?: string,
        public name?: string,
        public race?: string,
        public age?: number,
        public height?: number,
        public weight?: number,
        public eyes?: string,
        public skin?: string,
        public hair?: string,
        public strength?: number,
        public constitution?: number,
        public dexterity?: number,
        public intelligence?: number,
        public wisdom?: number,
        public charisma?: number,
        public modifiers?: ModifiersModel,
        public characterClass?: any,
        public image?: string,
        public backStory?: string,
        public flaws?: string[],
        public ideals?: string[],
        public bonds?: string[],
        public personalityTraits?: string[],
        public level?: number,
        public skills?: string[],
        public maxHp?: number,
        public items?: any,
        public currency?: {
            gold: number,
            silver: number,
            copper: number
        }
    ) {
        if (!modifiers) {
            this.modifiers = new ModifiersModel();
        }
    }
}