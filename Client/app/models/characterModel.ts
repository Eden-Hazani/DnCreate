import { BackgroundModal } from "./backgroundModal";
import { CharSpacialModel } from "./CharSpacialModel";
import { ClassModel } from "./classModel";
import { EquippedArmorModel } from "./EquippedArmorModel";
import { MagicModel } from "./magicModel";
import { ModifiersModel } from "./modifiersModel";
import { RaceModel } from "./raceModel";
import { SpellsModel } from "./spellsModel";

export class CharacterModel {
    public constructor(
        public _id?: string,
        public user_id?: string,
        public name?: string,
        public race?: string,
        public age?: number,
        public height?: number,
        public weight?: number,
        public eyes?: string,
        public skin?: string,
        public hair?: string,
        public strength?: number,
        public constitution?: number,
        public dexterity?: number,
        public intelligence?: number,
        public wisdom?: number,
        public charisma?: number,
        public modifiers?: ModifiersModel,
        public characterClass?: any,
        public characterClassId?: ClassModel,
        public raceId?: RaceModel,
        public image?: string,
        public backStory?: string,
        public flaws?: string[],
        public ideals?: string[],
        public bonds?: string[],
        public personalityTraits?: string[],
        public level?: number,
        public skills?: any[],
        public maxHp?: number,
        public items?: any,
        public path?: any,
        public pathFeatures?: any[],
        public spellsKnown?: any,
        public unrestrictedKnownSpells?: number,
        public differentClassSpellsToPick?: any[],
        public currency?: {
            gold: number,
            silver: number,
            copper: number
        },
        public magic?: MagicModel,
        public spells?: SpellsModel,
        public charSpecials?: CharSpacialModel,
        public tools?: any[],
        public addedWeaponProf?: any[],
        public addedArmorProf?: any[],
        public feats?: any[],
        public equippedArmor?: EquippedArmorModel,
        public languages?: any[],
        public spellCastingClass?: string,
        public nonClassAvailableSpells?: string[],
        public background?: BackgroundModal
    ) {
        if (!modifiers) {
            this.modifiers = new ModifiersModel();
        }
        if (!magic) {
            this.magic = new MagicModel();
        }
        if (!spells) {
            this.spells = new SpellsModel();
        }
        if (!charSpecials) {
            this.charSpecials = new CharSpacialModel();
        }
        if (!equippedArmor) {
            this.equippedArmor = new EquippedArmorModel();
        }
        if (!background) {
            this.background = new BackgroundModal();
        }
    }
}