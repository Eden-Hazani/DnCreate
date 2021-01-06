

const pfdPersonalityTraitPositionSwitch = (traitGroup: string) => {
    let height0: string = '';
    let height1: string = '';
    let height2: string = '';
    let height3: string = '';
    switch (true) {
        case traitGroup === "personalityTraits":
            height0 = "244px"
            height1 = "267px"
            height2 = "290px"
            height3 = "312px"
            break;
        case traitGroup === "ideals":
            height0 = "372px"
            height1 = "395px"
            height2 = "418px"
            break;

        case traitGroup === "bonds":
            height0 = "472px"
            height1 = "495px"
            height2 = "518px"
            break;

        case traitGroup === "flaws":
            height0 = "572px"
            height1 = "595px"
            height2 = "618px"
            break;

    }

    return { height0, height1, height2, height3 };
}

export default pfdPersonalityTraitPositionSwitch;