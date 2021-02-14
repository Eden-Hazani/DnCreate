import { RaceModel } from '../models/raceModel';
import { SubClassModal } from '../models/SubClassModal';
import client from './client';

const endpoint = '/subClasses'

const getSubclassList = (searchObj: {}) => {
    let formData: FormData = new FormData();
    formData.append("request", JSON.stringify(searchObj))
    return client.post(`${endpoint}/getSubClasses`, formData)
};

const getSubclass = (name: string) => client.get(`${endpoint}/getSubClass/${name}`);


const saveSubclass = (subclass: SubClassModal) => {
    let formData: FormData = new FormData();
    formData.append("subclass", JSON.stringify(subclass))
    return client.post(`${endpoint}/addSubClass`, formData)
};

const searchSubClasses = (searchObj: {}) => {
    let formData: FormData = new FormData();
    formData.append("search", JSON.stringify(searchObj))
    return client.post(`${endpoint}/searchSubClasses`, formData)
};



export default {
    getSubclassList,
    getSubclass,
    saveSubclass,
    searchSubClasses
}