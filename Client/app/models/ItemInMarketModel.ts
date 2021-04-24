

export class ItemInMarketModel {
    public constructor(
        public _id?: string,
        public description?: string,
        public creatorName?: string,
        public race?: string,
        public raceImag?: string,
        public charClass?: string,
        public currentLevel?: number,
        public charName?: string,
        public downloadedTimes?: number
    ) { }
}
