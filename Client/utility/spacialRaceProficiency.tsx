

const spacialRaceProficiency = (race: string) => {
    let totalPoints = 0;
    switch (true) {
        case race === 'Half Elf':
            totalPoints = 2;
            break;
        case race === 'Changeling':
            totalPoints = 1;
            break;
        case race === 'Warforged':
            totalPoints = 1;
            break;
    }

    return totalPoints;
}

export default spacialRaceProficiency;