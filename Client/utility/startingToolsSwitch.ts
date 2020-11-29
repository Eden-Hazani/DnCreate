

export function startingToolsSwitch(charClass: string) {
    let tools: any[] = [];
    switch (true) {
        case charClass === 'Rogue':
            tools.push(["Thieves' tools", 0])
            break;
        case charClass === 'Bard':
            tools.push(["Three musical instruments of your choice", 0])
            break;
        case charClass === 'Druid':
            tools.push(["Herbalism kit", 0])
            break;
    }
    return tools;
}