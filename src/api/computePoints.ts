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
  let points = Math.sqrt(streak + 1) + Math.pow(0.5, time / 20)
  points = Math.round(points * 10) / 10
  logDebug(`[computePoints] points: ${points}, time: ${time}`)
  setStreak(streak + 1)
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
