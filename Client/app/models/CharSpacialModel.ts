export class CharSpacialModel {
    public constructor(
        public rageAmount?: number,
        public rageDamage?: number,
        public fightingStyle?: {
            name: string,
            description: string
        },
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
        public warlockPatron?: string
    ) { }
}
