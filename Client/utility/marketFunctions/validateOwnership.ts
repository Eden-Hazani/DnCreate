
const validateOwnership = (user_id: string, marketStatus: { isInMarket: boolean, market_id: string, creator_id: string } | undefined) => {
    if (!marketStatus) {
        return true
    }
    else if (marketStatus.creator_id === user_id) {
        return true
    }
    else if (marketStatus.creator_id !== user_id) {
        return false
    }
}

export default validateOwnership;