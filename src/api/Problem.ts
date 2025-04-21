import { Topic } from "./Topic"
import { Division } from "./Division"

export interface Problem {
    imageName: string
    solution: string,
    topic: Topic,
    division: Division,
    points: number
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
        newProblems.length > 0
            ? newProblems[Math.floor(Math.random() * newProblems.length)]
            : problems[Math.floor(Math.random() * problems.length)]
    seenProblems = seenProblems.slice(1).concat(problem)
    return problem
}

export const ALL_PROBLEMS: Problem[] = [
    {
        imageName: "one.png",
        solution: "5123",
        topic: Topic.CompNumSystems,
        division: "Senior",
        points: 1
    },
    {
        imageName: "two.png",
        solution: "5123",
        topic: Topic.CompNumSystems,
        division: "Senior",
        points: 1
    },
    {
        imageName: "three.png",
        solution: "5123",
        topic: Topic.CompNumSystems,
        division: "Senior",
        points: 1
    },
    {
        imageName: "four.png",
        solution: "5123",
        topic: Topic.CompNumSystems,
        division: "Senior",
        points: 1
    },
    {
        imageName: "five.png",
        solution: "5123",
        topic: Topic.CompNumSystems,
        division: "Senior",
        points: 1
    }
]
