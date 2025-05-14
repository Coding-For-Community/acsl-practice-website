import { logDebug } from "./logDebug"
import { Problem } from "./types"

export function computePoints(
  answer: string,
  problem: Problem,
  time: number,
  streak: number,
  setStreak: (value: number) => void,
): number {
  if (!isCorrect(answer, problem)) {
    setStreak(0)
    logDebug(`[computePoints] points: 0, time: ${time}`)
    return 0
  }
  setStreak(streak + 1)
  const timerBonus = Math.floor(4 * Math.pow(0.5, time/20))
  const points = 10 + timerBonus + streak
  logDebug(`[computePoints] points: ${points}, time: ${time}`)
  return points
}

function isCorrect(answer: string, problem: Problem): boolean {
  answer = answer.trim()
  const lowercaseMode =
    problem.tolerance === "Lenient" || problem.tolerance === "SpaceSensitive"
  const noSpaceMode =
    problem.tolerance === "Lenient" || problem.tolerance === "CaseSensitive"
  if (lowercaseMode) answer = answer.toLowerCase()
  if (noSpaceMode) answer = answer.replace(/ /g, "")
  for (let solution of problem.solutions) {
    if (lowercaseMode) solution = solution.toLowerCase()
    if (noSpaceMode) solution = solution.replace(/ /g, "")
    if (solution === answer) return true
  }
  return false
}
