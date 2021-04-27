import { WeaponModal } from "./WeaponModal";

export class MarketWeaponItemModel {
    public constructor(
        public _id?: string,
        public creator_id?: string,
        public description?: string,
        public creatorName?: string,
        public itemName?: string,
        public weaponInfo?: WeaponModal,
        public marketType?: string,
        public downloadedTimes?: number,
        public image?: string
    ) { }
}
