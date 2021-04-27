

export class ItemInMarketModel {
    public constructor(
        public _id?: string,
        public description?: string,
        public creatorName?: string,
        public race?: string,
        public image?: string,
        public charClass?: string,
        public currentLevel?: number,
        public itemName?: string,
        public downloadedTimes?: number,
        public marketType?: string,
    ) { }
}
