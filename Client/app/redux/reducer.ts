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
            console.log(action.payload)
            newState.character = action.payload;
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
            storage.removeToken();
            break;
        case ActionType.PickedRace:
            newState.race = action.payload;
            break;

        case ActionType.CleanCreator:
            newState.character = new CharacterModel();
            break;
        default: break;
    }

    return newState;
}

