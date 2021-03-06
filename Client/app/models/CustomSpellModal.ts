export class CustomSpellModal {
    public constructor(
        public _id?: string,
        public casting_time?: string,
        public classes?: string[],
        public higher_levels?: string,
        public materials_needed?: string,
        public description?: string,
        public duration?: string,
        public level?: string,
        public name?: string,
        public range?: string,
        public school?: string,
        public type?: string,
        public marketStatus?: { isInMarket: boolean, market_id: string, creator_id: string }
    ) { }
}
