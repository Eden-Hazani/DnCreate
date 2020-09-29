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

const getLeadingAdventures = (user_id: string) => client.get<AdventureModel[]>(`${endpoint}/getLeadingAdventures/${user_id}`);

const getParticipationAdventures = (characters: string[]) => {
    let formData = new FormData();
    formData.append("characters", JSON.stringify(characters));
    return client.post<any>(`${endpoint}/getParticipatingAdventures`, formData);
};

const findAdventure = (adventureIdentifier: string) => client.get<AdventureModel>(`${endpoint}/findAdventure/${adventureIdentifier}`);


export default {
    saveAdventure,
    getLeadingAdventures,
    updateAdventure,
    findAdventure,
    getParticipationAdventures
}