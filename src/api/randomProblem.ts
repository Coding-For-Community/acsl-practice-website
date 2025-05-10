import { ALL_PROBLEMS } from "./constants/allProblems"
import { logDebug } from "./logDebug"
import { Division, Problem, Topic } from "./types"

let seenProblems: (Problem | null)[] = [null, null]

export function randomProblem(
  topics: Topic[],
  division: Division,
): Problem | null {
  const problems = ALL_PROBLEMS.filter(
    problem => topics.includes(problem.topic) && problem.division === division,
  )
  if (problems.length === 0) {
    logDebug("[randomProblem] problem: null")
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
  logDebug("[randomProblem] problem: ", problem)
  logDebug("[SOLUTIONS] " + problem.solutions)
  return problem
}
