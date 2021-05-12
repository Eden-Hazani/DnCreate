export class SpellsModel {
    cantrips: any[];
    firstLevelSpells?: any[];
    secondLevelSpells?: any[];
    thirdLevelSpells?: any[];
    forthLevelSpells?: any[];
    fifthLevelSpells?: any[];
    sixthLevelSpells?: any[];
    seventhLevelSpells?: any[];
    eighthLevelSpells?: any[];
    ninthLevelSpells?: any[];
    constructor(
        cantrips?: any[],
        firstLevelSpells?: any[],
        secondLevelSpells?: any[],
        thirdLevelSpells?: any[],
        forthLevelSpells?: any[],
        fifthLevelSpells?: any[],
        sixthLevelSpells?: any[],
        seventhLevelSpells?: any[],
        eighthLevelSpells?: any[],
        ninthLevelSpells?: any[],
    ) {
        this.cantrips = []
        this.firstLevelSpells = []
        this.thirdLevelSpells = []
        this.forthLevelSpells = []
        this.fifthLevelSpells = []
        this.sixthLevelSpells = []
        this.seventhLevelSpells = []
        this.eighthLevelSpells = []
        this.ninthLevelSpells = []
    }
}
