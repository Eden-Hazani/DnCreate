import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";
import { UserModel } from "../models/userModel";
import storage from "../auth/storage";
import TokenHandler from "../auth/TokenHandler";
import reduxToken from "../auth/reduxToken";
import { CharacterModel } from "../models/characterModel";
import jwtDecode from 'jwt-decode';

export function reduce(currentState: AppState, action: Action): AppState {

    const newState = { ...currentState }; // Duplicate the old state into a new state.

    switch (action.type) {
        case ActionType.SetInfoToChar:
            newState.character = action.payload;
            break;
        case ActionType.SetCharacters:
            for (let character of action.payload) {
                newState.characters.push(character);
            }
            break;
        case ActionType.SetUserInfo:
            const user = new UserModel(action.payload._id, action.payload.username, action.payload.password, action.payload.profileImg)
            newState.user = user;
            break;

        case ActionType.SetUserInfoLoginRegister:
            const loggedUser = new UserModel(action.payload._id, action.payload.username, action.payload.password, action.payload.profileImg)
            newState.user = loggedUser
            break;

        case ActionType.Logout:
            newState.user = null;
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

        default: break;
    }

    return newState;
}

