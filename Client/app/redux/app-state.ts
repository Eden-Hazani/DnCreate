import { CharacterModel } from "../models/characterModel";
import { RaceModel } from "../models/raceModel";
import { UserModel } from "../models/userModel";

export class AppState {
    public character: CharacterModel;
    public user: UserModel;
    public race: RaceModel;
    public constructor() {
        this.character = new CharacterModel();
        this.user = new UserModel();
        this.race = new RaceModel();
    }
}
