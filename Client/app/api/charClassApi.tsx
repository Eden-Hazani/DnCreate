import { ClassModel } from '../models/classModel';
import client from './client';

const endpoint = '/classes'

const getClassesList = () => client.get<ClassModel[]>(`${endpoint}/charClassList`);


export default {
    getClassesList,
}