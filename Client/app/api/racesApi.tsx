import client from './client';

const endpoint = '/races'

const getRaceList = () => client.get(`${endpoint}/raceList`);


//not in use for now, no need for server searches
const SearchRaceList = (search: any) => client.get(`${endpoint}/searchRace/${search}`)

export default {
    getRaceList,
    SearchRaceList
}