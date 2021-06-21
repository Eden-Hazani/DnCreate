import { MarketCharItemModel } from '../models/MarketCharItemModel';
import { ItemInMarketModel } from '../models/ItemInMarketModel';
import client from './client';
import { MarketFilterModal } from '../models/MarketFilterModal';
import { MarketWeaponItemModel } from '../models/MarketWeaponItemModel';
import { SpellMarketItem } from '../models/SpellMarketItem';


const endpoint = '/market'

const addToMarket = (marketItem: MarketCharItemModel | MarketWeaponItemModel | SpellMarketItem, type: string) => {
    let formData: FormData = new FormData();
    formData.append("marketItem", JSON.stringify(marketItem))
    return client.post<string>(`${endpoint}/addToMarket/${type}`, formData)
};

const deleteFromMarket = (market_id: string, type: string) => client.delete(`${endpoint}/removeItemFromMarket/${market_id}/${type}`);


const getPrimeItemsFromMarket = (marketType: string) => client.get<ItemInMarketModel[]>(`${endpoint}/getPrimeItems/${marketType}`);


const getSingleMarketItem = (market_id: string, type: string) => client.get<MarketCharItemModel>(`${endpoint}/getMarketItem/${market_id}/${type}`);

const getMarketItemBatchFromServer = (start: number, end: number, filters: MarketFilterModal, search: string | null, marketType: string) => {
    let formData: FormData = new FormData();
    formData.append("filters", JSON.stringify(filters))
    formData.append("start", start.toString())
    formData.append("end", end.toString())
    if (search) {
        formData.append("search", search)
    }
    return client.post<ItemInMarketModel[]>(`${endpoint}/getItemBatch/${marketType}`, formData)
};


const addDownloadToMarketItem = (market_id: string, marketType: string) => client.patch(`${endpoint}/addToItemDownloadAmount/${marketType}/${market_id}`);


export default {
    addToMarket,
    deleteFromMarket,
    getPrimeItemsFromMarket,
    getSingleMarketItem,
    getMarketItemBatchFromServer,
    addDownloadToMarketItem
}