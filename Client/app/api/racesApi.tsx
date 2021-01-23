import { RaceModel } from '../models/raceModel';
import client from './client';

const endpoint = '/races'

const getRaceList = () => client.get(`${endpoint}/raceList`);

const SearchRaceList = (search: any) => client.get(`${endpoint}/searchRace/${search}`)

const addRace = (race: RaceModel) => {
    let formData: FormData = new FormData();
    formData.append("raceInfo", JSON.stringify(race))
    const image: any = race.image
    if (image) {
        formData.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: `image`
        });
    }
    return client.post(`${endpoint}/addRace`, formData);
}


export default {
    getRaceList,
    SearchRaceList,
    addRace
}