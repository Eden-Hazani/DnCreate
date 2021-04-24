import { MarketCharItemModel } from '../models/MarketCharItemModel';
import { ItemInMarketModel } from '../models/ItemInMarketModel';
import client from './client';
import { MarketFilterModal } from '../models/MarketFilterModal';


const endpoint = '/market'

const addCharToMarket = (marketCharItem: MarketCharItemModel) => {
    let formData: FormData = new FormData();
    formData.append("marketItem", JSON.stringify(marketCharItem))
    return client.post<string>(`${endpoint}/addCharToMarket`, formData)
};

const deleteFromMarket = (market_id: string) => client.delete(`${endpoint}/removeCharFromMarket/${market_id}`);


const getPrimeItemsFromMarket = () => client.get<ItemInMarketModel[]>(`${endpoint}/getPrimeItems`);


const getSingleMarketItem = (market_id: string) => client.get<MarketCharItemModel>(`${endpoint}/getMarketItem/${market_id}`);

const getMarketItemBatchFromServer = (start: number, end: number, filters: MarketFilterModal, search: string | null) => {
    let formData: FormData = new FormData();
    formData.append("filters", JSON.stringify(filters))
    formData.append("start", start.toString())
    formData.append("end", end.toString())
    if (search) {
        formData.append("search", search)
    }
    return client.post<ItemInMarketModel[]>(`${endpoint}/getItemBatch`, formData)
};


export default {
    addCharToMarket,
    deleteFromMarket,
    getPrimeItemsFromMarket,
    getSingleMarketItem,
    getMarketItemBatchFromServer
}