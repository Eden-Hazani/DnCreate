

const pfdPersonalityTraitPositionSwitch = (traitGroup: string) => {
    let height0: string = '';
    let height1: string = '';
    let height2: string = '';
    let height3: string = '';
    switch (true) {
        case traitGroup === "personalityTraits":
            height0 = "240px"
            height1 = "265px"
            height2 = "285px"
            height3 = "310px"
            break;
        case traitGroup === "ideals":
            height0 = "370px"
            height1 = "392px"
            height2 = "415px"
            break;

        case traitGroup === "bonds":
            height0 = "470px"
            height1 = "492px"
            height2 = "515px"
            break;

        case traitGroup === "flaws":
            height0 = "570px"
            height1 = "593px"
            height2 = "617px"
            break;

    }

    return { height0, height1, height2, height3 };
}

export default pfdPersonalityTraitPositionSwitch;