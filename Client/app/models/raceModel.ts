import { ModifiersModel } from "./modifiersModel";
import { RaceAbilityModel } from "./raceAbilityModal";

export class RaceModel {
    public constructor(
        public _id?: string,
        public name?: string,
        public description?: string,
        public image?: string,
        public abilityBonus?: ModifiersModel,
        public raceAbilities?: RaceAbilityModel,
        public raceColors?: string,
        public languages?: string[],

        public changeBaseAttributePoints?: {
            changePoints: boolean,
            amount: number
        },
        public baseWeaponProficiencies?: string[],
        public baseArmorProficiencies?: string[],
        public baseAddedSkills?: string[],
        public baseAddedTools?: string[],
        public skillPickChoice?: {
            skillList: any[],
            amountToPick: number
        },
        public toolProficiencyPick?: {
            toolList: any[],
            amountToPick: number
        },
        public extraLanguages?: number,

        public customWeaponProficiencies?: {
            type: string,
            amount: number
        },
        public customArmorProficiencies?: {
            type: string,
            amount: number
        },
        public addedSpells?: string[],
        public addedACPoints?: number,
        public visibleToEveryone?: boolean,
        public user_id?: boolean

    ) {
        if (!extraLanguages) {
            this.extraLanguages = 0
        }
        if (!languages) {
            this.languages = []
        }
        if (!baseWeaponProficiencies) {
            this.baseWeaponProficiencies = []
        }
        if (!baseArmorProficiencies) {
            this.baseArmorProficiencies = []
        }
        if (!skillPickChoice) {
            this.skillPickChoice = {
                skillList: [],
                amountToPick: 0
            }
        }
        if (!addedSpells) {
            this.addedSpells = []
        }
        if (!toolProficiencyPick) {
            this.toolProficiencyPick = {
                toolList: [],
                amountToPick: 0
            }
        }
        if (!baseAddedSkills) {
            this.baseAddedSkills = []
        }
        if (!baseAddedTools) {
            this.baseAddedTools = []
        }
        if (!changeBaseAttributePoints) {
            this.changeBaseAttributePoints = {
                changePoints: false,
                amount: 0
            }
        }
        if (!abilityBonus) {
            this.abilityBonus = new ModifiersModel()
        }
        if (!raceAbilities) {
            this.raceAbilities = new RaceAbilityModel()
        }
    }
}
