import { Topic } from "./Topic"
import { Division } from "./Division"
import { Tolerance } from "./Tolerance"
import { ALL_PROBLEMS } from "./allProblems"

export interface Problem {
  imageName: string
  solutions: string[]
  topic: Topic
  division: Division
  tolerance: Tolerance
}

let seenProblems: (Problem | null)[] = [null, null]

export function getRandomProblem(
  topics: Topic[],
  division: Division,
): Problem | null {
  const problems = ALL_PROBLEMS.filter(
    problem => topics.includes(problem.topic) && problem.division === division,
  )
  if (problems.length === 0) {
    return null
  }
  const newProblems = problems.filter(
    problem => !seenProblems.includes(problem),
  )
  const problem =
    newProblems.length > 1
      ? newProblems[Math.floor(Math.random() * newProblems.length)]
      : problems[Math.floor(Math.random() * problems.length)]
  seenProblems = seenProblems.slice(1).concat(problem)
  return problem
}

export function isCorrect(answer: string, problem: Problem): boolean {
  answer = answer.trim()
  const lowercaseMode =
    problem.tolerance === Tolerance.Lenient ||
    problem.tolerance === Tolerance.SpaceSensitive
  const noSpaceMode =
    problem.tolerance === Tolerance.Lenient ||
    problem.tolerance === Tolerance.CaseSensitive
  if (lowercaseMode) answer = answer.toLowerCase()
  if (noSpaceMode) answer = answer.replace(/ /g, "")
  for (let solution of problem.solutions) {
    if (lowercaseMode) solution = solution.toLowerCase()
    if (noSpaceMode) solution = solution.replace(/ /g, "")
    if (solution === answer) return true
  }
  return false
}
