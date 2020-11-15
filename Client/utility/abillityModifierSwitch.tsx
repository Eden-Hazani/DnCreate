

const switchModifier = (score: number) => {
    if (score < 1 || score > 30) {
        return 0;
    }
    return Math.floor(score / 2) - 5;
}

export default switchModifier;