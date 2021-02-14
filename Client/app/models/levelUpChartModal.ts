import { MagicModel } from "./magicModel";

export class levelUpChartModal {
    constructor(

        //done------
        public name?: string,
        public description?: string,
        public choices?: any[],
        public numberOfChoices?: number,
        public skillList?: [],
        public skillPickNumber?: number,
        public skillsStartAsExpertise?: boolean,
        //adds list of spells to add to character (by name)
        public spellsToBeAdded?: string[],
        // adds list of tools with amount to pick from
        public toolsToPick?: string[],
        public amount?: number,
        //adds Exact tools from list 
        public toolsToBeAdded?: string[],
        //List of magic per level ---------> lists for every level
        public customUserMagicLists?: any,
        // the magical class of the new character ----> drop down list to pick from
        public spellCastingClass?: string,
        //always = custom
        public addMagicalAbilities?: string,
        //----------------------------


        // Add List of spells to pick from without class limitation
        public addSpellAvailability?: string[],


        //adds a cantrip slot.
        public additionCantrip?: number,


        //adds saving throws - will be added without conditions
        public savingThrowList?: string[],
        public saveThrowPickNumber?: number,

        //increase total max hpe
        public increaseMaxHp?: number,


        //adds Exact skills from list
        public addExactSkillProficiency?: string[],

        //needed only for cleric
        //needed clericDomainSpellsPicker for cleric subclasses.
        //character model will have path - for naming
        // and it will have a subclass _id to be filled.
        // clericDomainSpellsPicker will be available in LevelChartSetUp as a pop up model
        public levelOneSpells?: boolean,
        public noCountAgainstKnown?: boolean,
        public spellsToAddThisLevel?: string[],


        // adds spells by choice with a limit.
        public spellListWithLimiter?: {
            limit: number,
            spells: string[]
        },
        public AddSpellsFromDifferentClass?: {
            className: string,
            numberOfSpells: number,
            spellLevel: string
        },


    ) { }
}