

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
    let unSetCurrentWeapon = {
        _id: null,
        dice: null,
        name: null,
        description: null,
        specialAbilities: null,
        removable: null,
    }
    if (!mainObj.currentWeapon || !mainObj.currentWeapon.name) {
        mainObj.currentWeapon = unSetCurrentWeapon;
    }
    if (!mainObj.magic) {
        mainObj.magic = unSetMagic;
    }
    return mainObj;
}
module.exports = removeEmptySpecificObj;