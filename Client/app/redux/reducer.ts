import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";
import { UserModel } from "../models/userModel";
import storage from "../auth/storage";
import { CharacterModel } from "../models/characterModel";
import * as GoogleSignIn from 'expo-google-sign-in';
import { RaceModel } from "../models/raceModel";

const initialState: AppState = new AppState();

export function reduce(currentState: AppState | undefined = initialState, action: Action): AppState {

    const newState = { ...currentState }; // Duplicate the old state into a new state.

    switch (action.type) {
        case ActionType.colorScheme:
            newState.colorScheme = action.payload;
            break;
        case ActionType.SetInfoBeforeRegisterChar:
            newState.beforeRegisterChar = action.payload
            break;
        case ActionType.ClearInfoBeforeRegisterChar:
            newState.beforeRegisterChar = new CharacterModel()
        case ActionType.StartAsNonUser:
            newState.nonUser = action.payload;
            break;
        case ActionType.SetInfoToChar:
            newState.character = action.payload;
            break;
        case ActionType.ResetCharSkillsToLowerLevel:
            const char = { ...newState.character };
            if (char.skills)
                for (let item of char.skills) {
                    if (item[1] === 4) {
                        item[1] = 4
                    }
                    item[1] = 0
                }
            newState.character = char;
            break;
        case ActionType.firstLoginAd:
            newState.firstLoginAd = false;
            break;
        case ActionType.SetCharacters:
            newState.characters = action.payload
            break;
        case ActionType.SetUserInfo:
            const user = new UserModel(action.payload._id, action.payload.username, action.payload.password, action.payload.profileImg, action.payload.activated, action.payload.premium)
            newState.user = user;
            break;

        case ActionType.SetUserInfoLoginRegister:
            const loggedUser = new UserModel(action.payload._id, action.payload.username, action.payload.password, action.payload.profileImg, action.payload.activated, action.payload.premium)
            newState.user = loggedUser
            break;

        case ActionType.Logout:
            GoogleSignIn.signOutAsync();
            newState.user = new UserModel();
            newState.character = new CharacterModel();
            newState.characters = [];
            newState.leadingAdv = [];
            newState.participatingAdv = [];
            storage.removeToken();
            break;

        case ActionType.PickedRace:
            newState.race = action.payload;
            break;

        case ActionType.CleanCreator:
            newState.character = new CharacterModel();
            break;

        case ActionType.SetParticipatingAdv:
            for (let adv of action.payload) {
                newState.participatingAdv.push(adv)
            }
            break;
        case ActionType.ClearParticipatingAdv:
            newState.participatingAdv = [];
            for (let adv of action.payload) {
                newState.participatingAdv.push(adv)
            }
            break;
        case ActionType.ReplaceLeadAdventure:
            const newLeadingAdv = newState.leadingAdv.map((item, index) => {
                if (item._id === action.payload._id) {
                    item = action.payload
                    return item
                }
                return item
            })
            newState.leadingAdv = newLeadingAdv;
            break;
        case ActionType.ReplaceParticipateAdventure:
            const newParticipateAdv = newState.participatingAdv.map((item, index) => {
                if (item._id === action.payload._id) {
                    item = action.payload
                    return item
                }
                return item
            })
            newState.participatingAdv = newParticipateAdv;
            break;

        case ActionType.SetLeadingAdv:
            for (let adv of action.payload) {
                newState.leadingAdv.push(adv)
            }
            break;
        case ActionType.ClearLeadingAdv:
            newState.leadingAdv = [];
            for (let adv of action.payload) {
                newState.leadingAdv.push(adv)
            }
            break;
        case ActionType.UpdateLeadingAdv:
            newState.leadingAdv.push(action.payload)
            break;
        case ActionType.UpdateParticipatingAdv:
            newState.participatingAdv.push(action.payload)
            break;
        case ActionType.DeleteAdventure:
            newState.leadingAdv = newState.leadingAdv.filter(adv => adv._id !== action.payload);
            break;
        case ActionType.UpdateSingleAdventure:
            const index = newState.leadingAdv.findIndex(adv => adv._id === action.payload._id);
            newState.leadingAdv[index] = action.payload;
            break;
        case ActionType.UpdateCustomRace:
            newState.customRace = action.payload
            break;
        case ActionType.cleanCustomRace:
            newState.customRace = new RaceModel()
        default: break;
    }

    return newState;
}

