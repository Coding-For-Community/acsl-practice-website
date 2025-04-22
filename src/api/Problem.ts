import { Topic } from "./Topic"
import { Division } from "./Division"

export interface Problem {
    imageName: string
    solution: string,
    topic: Topic,
    division: Division
}

let seenProblems: (Problem | null)[] = [null, null]

export function getRandomProblem(topics: Topic[], division: Division): Problem | null {
    const problems = ALL_PROBLEMS.filter(
        problem => topics.includes(problem.topic) && problem.division === division
    )
    if (problems.length === 0) {
        return null
    }
    const newProblems = problems.filter(problem => !seenProblems.includes(problem))
    const problem = 
        newProblems.length > 1
            ? newProblems[Math.floor(Math.random() * newProblems.length)]
            : problems[Math.floor(Math.random() * problems.length)]
    seenProblems = seenProblems.slice(1).concat(problem)
    return problem
}

export const ALL_PROBLEMS: Problem[] = [
    {
        imageName: "one.png",
        solution: "00100",
        topic: Topic.BitStringFlicking,
        division: "Intermediate"
    },
    {
        imageName: "two.png",
        solution: "0*01*",
        topic: Topic.BitStringFlicking,
        division: "Intermediate"
    },
    {
        imageName: "three.png",
        solution: "00111",
        topic: Topic.BitStringFlicking,
        division: "Intermediate"
    },
    {
        imageName: "four.png",
        solution: "40",
        topic: Topic.LISP,
        division: "Intermediate"
    },
    {
        imageName: "five.png",
        solution: "(d f)",
        topic: Topic.AssemblyLang,
        division: "Intermediate"
    }
]
