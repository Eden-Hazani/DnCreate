import { AdventureModel } from '../models/AdventureModel';
import { CharacterModel } from '../models/characterModel';
import client from './client';

const endpoint = '/adventures'

const saveAdventure = (adventure: AdventureModel) => {
    let formData = new FormData();
    formData.append("adventure", JSON.stringify(adventure));
    return client.post(`${endpoint}/createAdventure`, formData);
};

const updateAdventure = (adventure: AdventureModel) => {
    let formData = new FormData();
    formData.append("adventure", JSON.stringify(adventure));
    return client.patch(`${endpoint}/updateAdventure`, formData);
};

const addAdventureParticipant = (adventure: AdventureModel) => {
    let formData = new FormData();
    formData.append("adventure", JSON.stringify(adventure));
    return client.patch(`${endpoint}/updateAdventure`, formData);
};

const getLeadingAdventures = (user_id: string) => client.get<AdventureModel[]>(`${endpoint}/getLeadingAdventures/${user_id}`);

const getSingleLeadingAdventure = (user_id: string, adventureIdentifier: string) => client.get<AdventureModel>(`${endpoint}/getSingleLeadingAdventure/${user_id}/${adventureIdentifier}`);

const getParticipationAdventures = (characters: string[]) => {
    let formData = new FormData();
    formData.append("characters", JSON.stringify(characters));
    return client.post<any>(`${endpoint}/getParticipatingAdventures`, formData);
};

const findAdventure = (adventureIdentifier: string) => client.get<AdventureModel>(`${endpoint}/findAdventure/${adventureIdentifier}`);

const leaveAdventure = (adventure: AdventureModel) => {
    let formData = new FormData();
    formData.append("adventure", JSON.stringify(adventure));
    return client.patch(`${endpoint}/leaveAdventure`, formData);
};

const deleteAdventure = (adventureIdentifier: string, leader_id: string) =>
    client.delete(`${endpoint}/deleteAdventure/${adventureIdentifier}/${leader_id}`);


const userInAdv = (adventureIdentifier: string, user_id: string) => client.get(`${endpoint}/userInAdv/${user_id}/${adventureIdentifier}`)

const getUserProfileImages = (userList: string[]) => {
    let formData = new FormData();
    formData.append("userList", JSON.stringify(userList));
    return client.post(`${endpoint}/getUsersProfilePic`, formData);
}

export default {
    saveAdventure,
    getLeadingAdventures,
    updateAdventure,
    findAdventure,
    getParticipationAdventures,
    leaveAdventure,
    deleteAdventure,
    userInAdv,
    getSingleLeadingAdventure,
    getUserProfileImages,
    addAdventureParticipant
}