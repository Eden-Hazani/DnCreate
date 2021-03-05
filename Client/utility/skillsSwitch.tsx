

const skillSwitch = (charClass: string) => {
    let skills: any = {};
    skills.skillList = [''];
    skills.amount = 0
    switch (true) {
        case charClass === 'Barbarian':
            skills.skillList = ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'];
            skills.amount = 2;
            break;
        case charClass === 'Bard':
            skills.skillList = ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival', 'Acrobatics', 'Sleight of Hand'
                , 'Stealth', 'Arcana', 'History', 'Investigation', 'Religion', 'Insight', 'Medicine', 'Deception', 'Performance', 'Persuasion'];
            skills.amount = 3;
            break;
        case charClass === 'Cleric':
            skills.skillList = ['History', 'Insight', 'Medicine', 'Nature', 'Persuasion', 'Religion'];
            skills.amount = 2;
            break;
        case charClass === 'Druid':
            skills.skillList = ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Religion', 'Perception', 'Survival'];
            skills.amount = 2;
            break;
        case charClass === 'Fighter':
            skills.skillList = ['Acrobatics', 'Animal Handling', 'Athletics', 'Insight', 'History', 'Intimidation', 'Perception', 'Survival'];
            skills.amount = 2;
            break;
        case charClass === 'Monk':
            skills.skillList = ['Acrobatics', 'Athletics', 'Insight', 'History', 'Religion', 'Stealth'];
            skills.amount = 2;
            break;
        case charClass === 'Paladin':
            skills.skillList = ['Intimidation', 'Athletics', 'Insight', 'Medicine', 'Religion', 'Persuasion'];
            skills.amount = 2;
            break;
        case charClass === 'Ranger':
            skills.skillList = ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Survival', 'Stealth'];
            skills.amount = 3;
            break;
        case charClass === 'Rogue':
            skills.skillList = ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Stealth', 'Performance', 'Persuasion', 'Sleight of Hand'];
            skills.amount = 4;
            break;
        case charClass === 'Sorcerer':
            skills.skillList = ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'];
            skills.amount = 2;
            break;
        case charClass === 'Warlock':
            skills.skillList = ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Religion', 'Nature'];
            skills.amount = 2;
            break;
        case charClass === 'Wizard':
            skills.skillList = ['Arcana', 'History', 'Insight', 'Investigation', 'Religion', 'Medicine'];
            skills.amount = 2;
            break;
        case charClass === 'Artificer':
            skills.skillList = ['Arcana', 'History', 'Investigation', 'Nature', 'Perception', 'Medicine', 'Sleight of Hand'];
            skills.amount = 2;
            break;
    }

    return skills;
}

export default skillSwitch;