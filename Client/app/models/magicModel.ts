export class MagicModel {
    public constructor(
        public cantrips?: number,
        public firstLevelSpells?: number,
        public secondLevelSpells?: number,
        public thirdLevelSpells?: number,
        public forthLevelSpells?: number,
        public fifthLevelSpells?: number,
        public sixthLevelSpells?: number,
        public seventhLevelSpells?: number,
        public eighthLevelSpells?: number,
        public ninthLevelSpells?: number,
    ) {
        if (!cantrips) {
            this.cantrips = 0
        }
        if (!firstLevelSpells) {
            this.firstLevelSpells = 0
        }
        if (!secondLevelSpells) {
            this.secondLevelSpells = 0
        }
        if (!thirdLevelSpells) {
            this.thirdLevelSpells = 0
        }
        if (!forthLevelSpells) {
            this.forthLevelSpells = 0
        }
        if (!fifthLevelSpells) {
            this.fifthLevelSpells = 0
        }
        if (!sixthLevelSpells) {
            this.sixthLevelSpells = 0
        }
        if (!seventhLevelSpells) {
            this.seventhLevelSpells = 0
        }
        if (!eighthLevelSpells) {
            this.eighthLevelSpells = 0
        }
        if (!ninthLevelSpells) {
            this.ninthLevelSpells = 0
        }
    }
}
