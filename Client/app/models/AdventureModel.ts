import { AdventurePhotoArrayModal } from "./AdventurePhotoArrayModal";
import { CharacterModel } from "./characterModel";
import { QuestModal } from "./questModel";

export class AdventureModel {
    public constructor(
        public _id?: string,
        public adventureName?: string,
        public participants_id?: CharacterModel[],
        public leader_id?: string,
        public adventureSetting?: string,
        public adventureIdentifier?: string,
        public backgroundImage?: string,
        public quests?: QuestModal[],
        public uploadedPhotoArray?: AdventurePhotoArrayModal[]
    ) {
        if (!this.uploadedPhotoArray) {
            uploadedPhotoArray = []
        }
    }
}
