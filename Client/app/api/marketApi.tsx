import { MarketCharItemModel } from '../models/MarketCharItemModel';
import { ItemInMarketModel } from '../models/ItemInMarketModel';
import client from './client';

const endpoint = '/market'

const addCharToMarket = (marketCharItem: MarketCharItemModel) => {
    let formData: FormData = new FormData();
    formData.append("marketItem", JSON.stringify(marketCharItem))
    return client.post<string>(`${endpoint}/addCharToMarket`, formData)
};

const deleteFromMarket = (market_id: string) => client.delete(`${endpoint}/removeCharFromMarket/${market_id}`);


const getPrimeItemsFromMarket = () => client.get<ItemInMarketModel[]>(`${endpoint}/getPrimeItems`);


const getSingleMarketItem = (market_id: string) => client.get<MarketCharItemModel>(`${endpoint}/getMarketItem/${market_id}`);


export default {
    addCharToMarket,
    deleteFromMarket,
    getPrimeItemsFromMarket,
    getSingleMarketItem
}