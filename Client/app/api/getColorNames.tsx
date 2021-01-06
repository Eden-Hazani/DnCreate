import { create } from 'apisauce';
import { Config } from '../../config';
import storage from '../auth/storage';


const apiClient = create({
    baseURL: `https://api.color.pizza/v1`
})



const colorMatcherRequest = (hex: any) => apiClient.get(`/${hex.replace('#', '')}`)



export default colorMatcherRequest;

