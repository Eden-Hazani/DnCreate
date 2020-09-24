
function skillModifier(skill: string) {
    let skillGroup: string = ''
    const skills = [['Athletics'], ['Acrobatics', 'Sleight of Hand', 'Stealth'], ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
    ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'], ['Deception', 'Intimidation', 'Performance', 'Persuasion']];

    let result: number = null;
    skills.filter((item, index) => {
        if (item.includes(skill)) {
            result = index
            return result;
        }
    })
    switch (true) {
        case result === 0:
            skillGroup = 'strength'
            break;
        case result === 1:
            skillGroup = 'dexterity'
            break;
        case result === 2:
            skillGroup = 'intelligence'
            break;
        case result === 3:
            skillGroup = 'wisdom'
            break;
        case result === 4:
            skillGroup = 'charisma'
            break;
    }

    return skillGroup;
}

export default skillModifier;