import { RaceModel } from '../models/raceModel';
import client from './client';

const endpoint = '/races'

const getRaceList = (start: number, end: number, _id: string, raceType: any) => client.get(`${endpoint}/raceList/${start}/${end}/${_id}/${raceType}`);

const getPrimeList = () => client.get(`${endpoint}/getPrimeRaceList`);

const getUserMadeRaces = (uid: string) => client.get(`${endpoint}/getUserCreatedRaces/${uid}`)

const editRace = (race: RaceModel) => {
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
    return client.patch(`${endpoint}/editCustomRace`, formData);
}

const SearchRaceList = (search: any, raceType: any, user_id: any) => client.get(`${endpoint}/searchRace/${search}/${raceType}/${user_id}`)

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
    addRace,
    getPrimeList,
    getUserMadeRaces,
    editRace
}