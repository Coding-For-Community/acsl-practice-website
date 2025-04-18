
export type Contest = "Contest 1" | "Contest 2" | "Contest 3" | "Contest 4"
export type Division = "Senior" | "Intermediate" | "Junior"

export interface Problem {
    imageName: string
    solution: string,
    contest: Contest,
    division: Division
}

export function getRandomProblem(contests: Contest[], division: Division): Problem | null {
    const filteredProblems = ALL_PROBLEMS.filter(problem => {
        return contests.includes(problem.contest) && problem.division === division
    })
    if (filteredProblems.length === 0) {
        return null
    }
    const randomIndex = Math.floor(Math.random() * filteredProblems.length)
    return filteredProblems[randomIndex]
}

export const ALL_PROBLEMS: Problem[] = [
    {
        imageName: "one.png",
        solution: "5123",
        contest: "Contest 1",
        division: "Senior"
    },
    {
        imageName: "two.png",
        solution: "5123",
        contest: "Contest 1",
        division: "Senior"
    },
    {
        imageName: "three.png",
        solution: "5123",
        contest: "Contest 1",
        division: "Senior"
    },
    {
        imageName: "four.png",
        solution: "5123",
        contest: "Contest 1",
        division: "Senior"
    },
    {
        imageName: "five.png",
        solution: "5123",
        contest: "Contest 1",
        division: "Senior"
    }
]
