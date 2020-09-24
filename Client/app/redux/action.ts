import { ActionType } from "./action-type";

export interface Action{
    type: ActionType;
    payload?:any; //payload is optional so we add ?
    

}