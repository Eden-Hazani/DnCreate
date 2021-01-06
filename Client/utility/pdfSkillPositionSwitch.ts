

const pdfSkillPositionSwitch = (skill: string) => {
    let dotHeight: string = '';
    let numberHeight: string = '';
    switch (true) {
        case skill === "Acrobatics":
            dotHeight = "567px";
            numberHeight = "570px";
            break;
        case skill === "Animal Handling":
            dotHeight = "592px";
            numberHeight = "595px";
            break;
        case skill === "Arcana":
            dotHeight = "617px";
            numberHeight = "620px";
            break;
        case skill === "Athletics":
            dotHeight = "642px";
            numberHeight = "645px";
            break;
        case skill === "Deception":
            dotHeight = "667px";
            numberHeight = "671px";
            break;
        case skill === "History":
            dotHeight = "692px";
            numberHeight = "694px";
            break;
        case skill === "Insight":
            dotHeight = "716px";
            numberHeight = "720px";
            break;
        case skill === "Intimidation":
            dotHeight = "742px";
            numberHeight = "744px";
            break;
        case skill === "Investigation":
            dotHeight = "767px";
            numberHeight = "770px";
            break;
        case skill === "Medicine":
            dotHeight = "792px";
            numberHeight = "795px";
            break;
        case skill === "Nature":
            dotHeight = "817px";
            numberHeight = "820px";
            break;
        case skill === "Perception":
            dotHeight = "841px";
            numberHeight = "845px";
            break;
        case skill === "Performance":
            dotHeight = "867px";
            numberHeight = "871px";
            break;
        case skill === "Persuasion":
            dotHeight = "892px";
            numberHeight = "895px";
            break;
        case skill === "Religion":
            dotHeight = "916px";
            numberHeight = "920px";
            break;
        case skill === "Sleight of Hand":
            dotHeight = "942px";
            numberHeight = "945px";
            break;
        case skill === "Stealth":
            dotHeight = "967px";
            numberHeight = "970px";
            break;
        case skill === "Survival":
            dotHeight = "992px";
            numberHeight = "995px";
            break;

    }

    return { dotHeight, numberHeight };
}

export default pdfSkillPositionSwitch;