import { AdventureModel } from "../models/AdventureModel";
import { CharacterModel } from "../models/characterModel";
import { MarketFilterModal } from "../models/MarketFilterModal";
import { RaceModel } from "../models/raceModel";
import { SubClassModal } from "../models/SubClassModal";
import { UserModel } from "../models/userModel";



export class AppState {
    public nonUser: boolean;
    public beforeRegisterChar: CharacterModel
    public character: CharacterModel;
    public characters: CharacterModel[];
    public user: UserModel;
    public race: RaceModel;
    public participatingAdv: AdventureModel[];
    public leadingAdv: AdventureModel[];
    public firstLoginAd: boolean
    public colorScheme: boolean
    public customRaceEditing: boolean
    public customRace: RaceModel
    public customSubClass: SubClassModal
    public marketPlaceFilters: MarketFilterModal
    public marketPlaceSearchText: string
    public constructor() {
        this.colorScheme = false,
            this.nonUser = false;
        this.beforeRegisterChar = new CharacterModel();
        this.marketPlaceFilters = { classFilters: [], topDownLoaded: 1, isApplied: false }
        this.marketPlaceSearchText = '';
        this.character = new CharacterModel();
        this.characters = [];
        this.firstLoginAd = true;
        this.user = new UserModel();
        this.race = new RaceModel();
        this.participatingAdv = []
        this.leadingAdv = []
        this.customRaceEditing = false
        this.customRace = new RaceModel()
        this.customSubClass = new SubClassModal()
    }
}
