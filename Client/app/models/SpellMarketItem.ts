import { CharacterModel } from "./characterModel";
import { CustomSpellModal } from "./CustomSpellModal";
import { WeaponModal } from "./WeaponModal";

export class SpellMarketItem {
    public constructor(
        public _id?: string,
        public creator_id?: string,
        public spell?: CustomSpellModal,
        public description?: string,
        public creatorName?: string,
        public marketType?: string,
        public itemName?: string,
        public downloadedTimes?: number,
        public image?: string
    ) { }
}
