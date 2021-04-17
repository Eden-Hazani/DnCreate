import { Colors } from "../../../config/colors"

const getColorStatus = (marketStatus: { creator_id: string, isInMarket: boolean, market_id: string } | undefined | null, user_id: string) => {
    if (marketStatus) {

        if (marketStatus.isInMarket) {
            if (marketStatus.creator_id === user_id) {
                return Colors.paleGreen
            } else {
                return Colors.deepGold
            }
        } else {
            if (marketStatus.creator_id === user_id) {
                return Colors.softPageBackground
            } else {
                return Colors.deepGold
            }
        }

    } else {
        return Colors.softPageBackground
    }
}

export default getColorStatus