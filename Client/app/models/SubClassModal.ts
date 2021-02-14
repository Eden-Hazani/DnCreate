import { levelUpChartModal } from "./levelUpChartModal";

export class SubClassModal {
    constructor(
        public _id?: string,
        public name?: string,
        public baseClass?: string,
        public description?: string,
        public isPublic?: boolean,
        public levelUpChart?: object,
        public user_id?: string
    ) {
        if (!levelUpChart) {
            this.levelUpChart = new Object()
        }
    }
}