import { CharacterModel } from "../models/characterModel";
import * as invocationsJson from "../../jsonDump/invocations.json"


export function eldritchInvocations(level: number, character: CharacterModel) {
    let eldritchInvocationsArray: any[] = []
    invocationsJson.invocation.forEach((inv, index) => {
        let flag = true
        if (inv.prerequisites) {
            if (inv.prerequisites.level && level < inv.prerequisites.level) {
                flag = false;
            }
            if (inv.prerequisites.pact && character.charSpecials.warlockPactBoon.name !== inv.prerequisites.pact) {
                flag = false;
            }
            if (inv.prerequisites.patron && character.charSpecials.warlockPatron !== inv.prerequisites.patron) {
                flag = false;
            }
            if (inv.prerequisites.spell && !character.spells.cantrips.find(spell => spell.name === inv.prerequisites.spell)) {
                flag = false;
            }
        }
        flag && eldritchInvocationsArray.push(inv);

    })
    return eldritchInvocationsArray;
}













    // switch (true) {
    //     case character.characterClass === "Warlock":
    //         eldritchInvocationsArray.push({ name: "Armor of Shadows", description: "You can cast mage armor on yourself at will, without expending a spell slot or material components." })
    //         eldritchInvocationsArray.push({ name: "Beast Speech", description: "You can cast speak with animals at will, without expending a spell slot." })
    //         eldritchInvocationsArray.push({ name: "Beguiling Influence", description: "You gain proficiency in the Deception and Persuasion skills." })
    //         eldritchInvocationsArray.push({ name: "Devil’s Sight", description: "You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet." })
    //         eldritchInvocationsArray.push({ name: "Eldritch Sight", description: "You can cast detect magic at will, without expending a spell slot." })
    //         eldritchInvocationsArray.push({ name: "Eyes of the Rune Keeper", description: "You can read all writing." })
    //         eldritchInvocationsArray.push({ name: "Thief of Five Fates", description: "You can cast bane once using a warlock spell slot. You can’t do so again until you finish a long rest." })
    //         eldritchInvocationsArray.push({ name: "Misty Visions", description: "You can cast silent image at will, without expending a spell slot or material components." })
    //         eldritchInvocationsArray.push({ name: "Mask of Many Faces", description: "You can cast disguise self at will, without expending a spell slot." })
    //         eldritchInvocationsArray.push({ name: "Fiendish Vigor", description: "You can cast false life on yourself at will as a 1st-level spell, without expending a spell slot or material components." })
    //         eldritchInvocationsArray.push({ name: "Gaze of Two Minds", description: "You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature’s senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings." })

    //     case character.charSpecials.warlockPactBoon.name === "Pact of the Chain":
    //         eldritchInvocationsArray.push({ name: "Voice of the Chain Master", description: "You can communicate telepathically with your familiar and perceive through your familiar’s senses as long as you are on the same plane of existence. Additionally, while perceiving through your familiar’s senses, you can also speak through your familiar in your own voice, even if your familiar is normally incapable of speech." })


    //     case level >= 5:
    //         eldritchInvocationsArray.push({ name: "Mire the Mind", description: "You can cast slow once using a warlock spell slot. You can’t do so again until you finish a long rest." })
    //         eldritchInvocationsArray.push({ name: "Sign of Ill Omen", description: "You can cast bestow curse once using a warlock spell slot. You can’t do so again until you finish a long rest." })
    //         eldritchInvocationsArray.push({ name: "One with Shadows", description: "When you are in an area of dim light or darkness, you can use your action to become invisible until you move or take an action or a reaction." })

    //     case level >= 5 && character.charSpecials.warlockPactBoon.name === "Pact of the Blade":
    //         eldritchInvocationsArray.push({ name: "Thirsting Blade", description: "You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn." })


    //     case level >= 7:
    //         eldritchInvocationsArray.push({ name: "Bewitching Whispers", description: "You can cast compulsion once using a warlock spell slot. You can’t do so again until you finish a long rest." })
    //         eldritchInvocationsArray.push({ name: "Dreadful Word", description: "You can cast confusion once using a warlock spell slot. You can’t do so again until you finish a long rest." })
    //         eldritchInvocationsArray.push({ name: "Sculptor of Flesh", description: "You can cast polymorph once using a warlock spell slot. You can’t do so again until you finish a long rest." })

    //     case level >= 9:
    //         eldritchInvocationsArray.push({ name: "Ascendant Step", description: "You can cast levitate on yourself at will, without expending a spell slot or material components." })
    //         eldritchInvocationsArray.push({ name: "Otherworldly Leap", description: "You can cast jump on yourself at will, without expending a spell slot or material components." })
    //         eldritchInvocationsArray.push({ name: "Whispers of the Grave", description: "You can cast speak with dead at will, without expending a spell slot." })
    //         eldritchInvocationsArray.push({ name: "Minions of Chaos", description: "You can cast conjure elemental once using a warlock spell slot. You can’t do so again until you finish a long rest." })


    //     case character.spells.cantrips.find(cantrip => cantrip.name === "eldritch blast"):
    //         eldritchInvocationsArray.push({ name: "Agonizing Blast", description: "When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit." })
    //         eldritchInvocationsArray.push({ name: "Eldritch Spear", description: "When you cast eldritch blast, its range is 300 feet." })
    //         eldritchInvocationsArray.push({ name: "Repelling Blast", description: "When you hit a creature with eldritch blast, you can push the creature up to 10 feet away from you in a straight line." })


    //     case character.charSpecials.warlockPactBoon.name === "Pact of the Tome":
    //         eldritchInvocationsArray.push({ name: "Book of Ancient Secrets", description: "You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class’s spell list (the two needn’t be from the same list). The spells appear in the book and don’t count against the number of spells you know. With your Book of Shadows in hand, you can cast the chosen spells as rituals. You can’t cast the spells except as rituals, unless you’ve learned them by some other means. You can also cast a warlock spell you know as a ritual if it has the ritual tag. On your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell’s level is equal to or less than half your warlock level (rounded up) and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it." })

    //     case level >= 12 && character.charSpecials.warlockPactBoon.name === "Pact of the Tome":
    //         eldritchInvocationsArray.push({ name: "Lifedrinker", description: "When you hit a creature with your pact weapon, the creature takes extra necrotic damage equal to your Charisma modifier (minimum 1)." })

    //     case level >= 15:
    //         eldritchInvocationsArray.push({ name: "Master of Myriad Forms", description: "You can cast alter self at will, without expending a spell slot." })
    //         eldritchInvocationsArray.push({ name: "Visions of Distant Realms", description: "You can cast arcane eye at will, without expending a spell slot." })
    //         eldritchInvocationsArray.push({ name: "Witch Sight", description: "You can see the true form of any shapechanger or creature concealed by illusion or transmutation magic while the creature is within 30 feet of you and within line of sight." })

    //     case level >= 15 && character.charSpecials.warlockPactBoon.name === "Pact of the Chain":
    //         eldritchInvocationsArray.push({ name: "Chains of Carceri", description: "You can cast hold monster at will — targeting a celestial, fiend, or elemental — without expending a spell slot or material components. You must finish a long rest before you can use this invocation on the same creature again." })

    // }