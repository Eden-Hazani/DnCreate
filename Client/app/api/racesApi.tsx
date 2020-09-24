import client from './client';

const endpoint = '/races'

const getRaceList = () => client.get(`${endpoint}/raceList`);

const SearchRaceList = (search: any) => client.get(`${endpoint}/searchRace/${search}`)

export default {
    getRaceList,
    SearchRaceList
}