import { CharacterModel } from "./characterModel";

export class AdventureModel {
    public constructor(
        public _id?: string,
        public adventureName?: string,
        public participants_id?: CharacterModel[],
        public leader_id?: string,
        public adventureSetting?: string,
        public adventureIdentifier?: string
    ) { }
}
