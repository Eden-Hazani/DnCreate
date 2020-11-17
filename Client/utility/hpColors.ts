import { Colors } from "../app/config/colors";


export function hpColors(hp: number, maxHp: number) {
    let color: string = ''
    const percentage = (hp / maxHp) * 100;
    switch (true) {
        case percentage >= 95:
            color = "#2ECC71";
            break;
        case percentage >= 85:
            color = "#82E0AA";
            break;
        case percentage >= 75:
            color = "#ABEBC6";
            break;
        case percentage >= 65:
            color = "#D5F5E3";
            break;
        case percentage >= 55:
            color = "#FEF9E7";
            break;
        case percentage >= 45:
            color = "#F9E79F";
            break;
        case percentage >= 35:
            color = "#FAD7A0";
            break;
        case percentage >= 30:
            color = "#EB984E";
            break;
        case percentage >= 25:
            color = "#D98880";
            break;
        case percentage >= 15:
            color = "#EC7063";
            break;
        case percentage >= 10:
            color = "#CB4335";
            break;
        case hp === 0 && maxHp !== 0:
            color = Colors.danger
            break;
        default:
            color = Colors.lightGray
    }
    return color;
}