
export class RaceAbilityModel {
    public constructor(
        public age?: string,
        public alignment?: string,
        public size?: string,
        public speed?: number,
        public languages?: string,
        public uniqueAbilities?: any[]
    ) {
        if (!uniqueAbilities) {
            this.uniqueAbilities = []
        }
        if (!age) {
            this.age = ''
        }
        if (!alignment) {
            this.alignment = ''
        }
        if (!size) {
            this.size = ''
        }
        if (!speed) {
            this.speed = 0
        }
        if (!languages) {
            this.languages = ''
        }
    }
}
