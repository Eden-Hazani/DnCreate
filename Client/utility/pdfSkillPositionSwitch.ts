

const pdfSkillPositionSwitch = (skill: string) => {
    let dotHeight: string = '';
    let numberHeight: string = '';
    switch (true) {
        case skill === "Acrobatics":
            dotHeight = "562px";
            numberHeight = "568px";
            break;
        case skill === "Deception":
            dotHeight = "661px";
            numberHeight = "668px";
            break;
        case skill === "Athletics":
            dotHeight = "636px";
            numberHeight = "642px";
            break;
        case skill === "Arcana":
            dotHeight = "611px";
            numberHeight = "617px";
            break;
        case skill === "Animal Handling":
            dotHeight = "587px";
            numberHeight = "592px";
            break;
        case skill === "History":
            dotHeight = "686px";
            numberHeight = "692px";
            break;
        case skill === "Insight":
            dotHeight = "711px";
            numberHeight = "718px";
            break;
        case skill === "Intimidation":
            dotHeight = "736.5px";
            numberHeight = "743px";
            break;
        case skill === "Investigation":
            dotHeight = "761.5px";
            numberHeight = "768px";
            break;
        case skill === "Medicine":
            dotHeight = "786px";
            numberHeight = "793px";
            break;
        case skill === "Nature":
            dotHeight = "811px";
            numberHeight = "817px";
            break;
        case skill === "Perception":
            dotHeight = "836px";
            numberHeight = "842.5px";
            break;
        case skill === "Performance":
            dotHeight = "860.5px";
            numberHeight = "866.5px";
            break;
        case skill === "Persuasion":
            dotHeight = "885.5px";
            numberHeight = "892px";
            break;
        case skill === "Religion":
            dotHeight = "910.5px";
            numberHeight = "916.5px";
            break;
        case skill === "Sleight of Hand":
            dotHeight = "935.5";
            numberHeight = "942px";
            break;
        case skill === "Stealth":
            dotHeight = "960.5px";
            numberHeight = "966px";
            break;
        case skill === "Survival":
            dotHeight = "985.5px";
            numberHeight = "992px";
            break;

    }

    return { dotHeight, numberHeight };
}

export default pdfSkillPositionSwitch;