import { store } from "../../../redux/store"


const checkMarketItemValidity = (market_id: string, charName: string) => {
    const characters = store.getState().characters;
    for (let item of characters) {
        if (item.marketStatus?.market_id === market_id) {
            return 'MATCH_ID'
        }
        if (charName === item.name) {
            return 'MATCH_NAME'
        }
    }
    return 'OK'
}




export { checkMarketItemValidity };