import { CharacterModel } from "../models/characterModel";
import * as invocationsJson from "../../jsonDump/invocations.json"
import logger from "../../utility/logger";


export function eldritchInvocations(level: number, character: CharacterModel) {
    try {
        let eldritchInvocationsArray: any[] = []
        invocationsJson.invocation.forEach((inv, index) => {
            let flag = true
            if (inv.prerequisites?.level && level < inv.prerequisites.level) {
                flag = false;
            }
            if (inv.prerequisites?.pact && character.charSpecials?.warlockPactBoon?.name !== inv.prerequisites.pact) {
                flag = false;
            }
            if (inv.prerequisites?.patron && character.charSpecials?.warlockPatron !== inv.prerequisites.patron) {
                flag = false;
            }
            if (inv?.prerequisites?.spell && character.spells && character.spells.cantrips && !character.spells.cantrips.find(spell => spell.spell.name === inv.prerequisites?.spell)) {
                flag = false;
            }
            flag && eldritchInvocationsArray.push(inv);

        })
        return eldritchInvocationsArray;
    } catch (err) {
        logger.log(new Error(err))
        return []
    }
}












