import { AdventureModel } from "../models/AdventureModel";
import { CharacterModel } from "../models/characterModel";
import { RaceModel } from "../models/raceModel";
import { UserModel } from "../models/userModel";

export class AppState {
    public character: CharacterModel;
    public characters: CharacterModel[];
    public user: UserModel;
    public race: RaceModel;
    public participatingAdv: AdventureModel[];
    public leadingAdv: AdventureModel[];
    public constructor() {
        this.character = new CharacterModel();
        this.characters = [];
        this.user = new UserModel();
        this.race = new RaceModel();
        this.participatingAdv = []
        this.leadingAdv = []
    }
}
