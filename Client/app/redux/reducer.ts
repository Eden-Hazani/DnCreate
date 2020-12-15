import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";
import { UserModel } from "../models/userModel";
import storage from "../auth/storage";
import TokenHandler from "../auth/TokenHandler";
import reduxToken from "../auth/reduxToken";
import { CharacterModel } from "../models/characterModel";
import jwtDecode from 'jwt-decode';
import AsyncStorage from "@react-native-community/async-storage";

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
            const user = new UserModel(action.payload._id, action.payload.username, action.payload.password, action.payload.profileImg, action.payload.activated)
            newState.user = user;
            break;

        case ActionType.SetUserInfoLoginRegister:
            const loggedUser = new UserModel(action.payload._id, action.payload.username, action.payload.password, action.payload.profileImg, action.payload.activated)
            newState.user = loggedUser
            break;

        case ActionType.Logout:
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

            break;

        default: break;
    }

    return newState;
}

