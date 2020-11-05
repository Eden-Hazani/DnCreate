

function removeEmptySpecificObj(mainObj) {
    let unSetMagic = {
        cantrips: null,
        firstLevelSpells: null,
        secondLevelSpells: null,
        thirdLevelSpells: null,
        forthLevelSpells: null,
        fifthLevelSpells: null,
        sixthLevelSpells: null,
        seventhLevelSpells: null,
        eighthLevelSpells: null,
        ninthLevelSpells: null,
    }
    if (!mainObj.magic) {
        mainObj.magic = unSetMagic;
    }
    return mainObj;
}
module.exports = removeEmptySpecificObj;