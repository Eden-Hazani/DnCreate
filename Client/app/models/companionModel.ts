import { ModifiersModel } from "./modifiersModel";

export class CompanionModel {
    public constructor(
        public name?: string,
        public animalType?: string,
        public strength?: number,
        public constitution?: number,
        public dexterity?: number,
        public intelligence?: number,
        public wisdom?: number,
        public charisma?: number,
        public maxHp?: number,
        public skills?: any[],
        public trait?: string,
        public flaw?: string,
        public modifiers?: ModifiersModel
    ) { }
}
