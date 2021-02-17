import * as xpChart from '../../../../jsonDump/experienceLevelChart.json'
export function experienceCalculator(characterExperience: number, currentLevelGoal: number) {
    const percentage = characterExperience / xpChart[currentLevelGoal]
    return percentage
}