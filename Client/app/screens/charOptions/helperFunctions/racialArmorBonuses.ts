export function racialArmorBonuses(race: string) {
    let bonus: number = 0;
    switch (true) {
        case race === "Warforged":
            bonus = 1
            break;
    }
    return bonus;
}