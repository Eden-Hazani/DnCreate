import { store } from "../../../redux/store"

const checkMarketItemValidity = (market_id: string) => {
    const characters = store.getState().characters;
    for (let item of characters) {
        console.log(item.race, item.marketStatus?.market_id === market_id)
        if (item.marketStatus?.market_id === market_id) {
            return true
        }
    }
    return false
}


export { checkMarketItemValidity };