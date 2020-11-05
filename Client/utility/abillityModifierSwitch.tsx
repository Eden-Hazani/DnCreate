

const switchModifier = (score: number) => {
    let modifier = null;
    switch (true) {
        case score === 1:
            modifier = -5;
            break;
        case 2 === score || score === 3:
            modifier = -4;
            break;
        case 4 === score || score === 5:
            modifier = -3;
            break;
        case 6 === score || score === 7:
            modifier = -2;
            break;
        case 8 === score || score === 9:
            modifier = -1;
            break;
        case 10 === score || score === 11:
            modifier = 0;
            break;
        case 12 === score || score === 13:
            modifier = 1;
            break;
        case 14 === score || score === 15:
            modifier = 2;
            break;
        case 16 === score || score === 17:
            modifier = 3;
            break;
        case 18 === score || score === 19:
            modifier = 4;
            break;
        case 20 === score || score === 21:
            modifier = 5;
            break;
        case 22 === score || score === 23:
            modifier = 6;
            break;
        case 24 === score || score === 25:
            modifier = 7;
            break;
        case 26 === score || score === 27:
            modifier = 8;
            break;
        case 28 === score || score === 29:
            modifier = 9;
            break;
        case score === 30:
            modifier = 10;
            break;
        default:
            modifier = 0
    }
    return modifier;
}

export default switchModifier;