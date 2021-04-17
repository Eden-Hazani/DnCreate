import { CharacterModel } from "../../app/models/characterModel";


const cleanCharObj = (character: CharacterModel) => {
    delete character._id;
    delete character.user_id;
    return character;
}

export default cleanCharObj;