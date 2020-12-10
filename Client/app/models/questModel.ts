export class QuestModal {
    public constructor(
        public _id?: string,
        public questGiver?: string,
        public questName?: string,
        public questLocation?: string,
        public reward?: string,
        public questDescription?: string,
        public active?: boolean,
        public ImageUri?: string
    ) {

    }
}