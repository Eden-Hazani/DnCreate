

const spacialRaceProficiency = (race: string) => {
    let totalPoints = null;
    switch (true) {
        case race === 'Half Elf':
            totalPoints = 2;
            break;
    }

    return totalPoints;
}

export default spacialRaceProficiency;