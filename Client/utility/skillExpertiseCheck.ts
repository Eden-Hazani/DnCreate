

export function skillExpertiseCheck(skill: any, proficiency: number) {
    let value: number = null
    switch (true) {
        case skill === 0:
            value = 0;
            break;
        case skill === 2:
            value = proficiency;
            break;
    }
    return value;
}