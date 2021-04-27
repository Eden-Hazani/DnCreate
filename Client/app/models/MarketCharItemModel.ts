import { CharacterModel } from "./characterModel";
import { WeaponModal } from "./WeaponModal";

export class MarketCharItemModel {
    public constructor(
        public _id?: string,
        public currentLevelChar?: CharacterModel,
        public creator_id?: string,
        public armorItems?: any[],
        public weaponItems?: WeaponModal[],
        public shieldItems?: any[],
        public characterLevelList?: CharacterModel[],
        public description?: string,
        public creatorName?: string,
        public race?: string,
        public marketType?: string,
        public image?: string,
        public charClass?: string,
        public currentLevel?: number,
        public itemName?: string,
        public downloadedTimes?: number
    ) { }
}
