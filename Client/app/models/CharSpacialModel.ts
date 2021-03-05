import { CompanionModel } from "./companionModel";
import { ModifiersModel } from "./modifiersModel";

export class CharSpacialModel {
    public constructor(
        public rageAmount?: number,
        public rageDamage?: number,
        public fightingStyle?: any[],
        public kiPoints?: number,
        public martialPoints?: number,
        public sneakAttackDie?: number,
        public sorceryPoints?: number,
        public sorcererMetamagic?: any[],
        public warlockPactBoon?: {
            name: string,
            description: string
        },
        public eldritchInvocations?: any[],
        public warlockPatron?: string,
        public battleMasterManeuvers?: any[],
        public monkElementsDisciplines?: any[],
        public druidCircle?: string,
        public companion?: CompanionModel[],
        public warlockSpellSlotLevel?: string,
        public warlockSpellSlots?: number,
        public dragonBornAncestry?: any,
        public alwaysOnToolExpertise?: boolean,
        public currentInfusedItems?: any[],
        public artificerInfusions?: any[]
    ) { }
}
