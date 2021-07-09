import { RaceModel } from '../models/raceModel';
import client from './client';

const endpoint = '/races'

const getRaceList = (start: number, end: number, _id: string, raceType: any, isPopularOrder: string) => client.get(`${endpoint}/raceList/${start}/${end}/${_id}/${raceType}/${isPopularOrder}`);

const getPrimeList = (isPopularOrder: string | boolean, raceType: string, user_id: string) => client.get(`${endpoint}/getPrimeRaceList/${isPopularOrder}/${raceType}/${user_id}`);

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


const popularizeAllRaces = (data: any) => {
    let formData: FormData = new FormData();
    formData.append("raceInfo", JSON.stringify(data))
    client.post(`${endpoint}/popularizeAllRaces`, formData)
}

export default {
    getRaceList,
    SearchRaceList,
    addRace,
    getPrimeList,
    getUserMadeRaces,
    editRace,
    popularizeAllRaces
}