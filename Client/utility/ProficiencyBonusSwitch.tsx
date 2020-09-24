

const switchProficiency = (level: number) => {
    let bonus = null;
    switch (true) {
        case level < 5:
            bonus = 2;
            break;
        case level < 9:
            bonus = 3;
            break;
        case level < 13:
            bonus = 4;
            break;
        case level < 17:
            bonus = 5;
            break;
        case level <= 20:
            bonus = 6;
            break;
    }

    return bonus;
}

export default switchProficiency;