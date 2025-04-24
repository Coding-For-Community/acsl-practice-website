import { Tolerance } from "./Tolerance"
import { Division } from "./Division"
import { Problem } from "./Problem"
import { Topic } from "./Topic"

type FileName = string
type Solution = string | { answers: string[], tolerance: Tolerance }

function problems(
    topic: Topic,
    division: Division,
    fileToSolutionMap: Record<FileName, Solution>,
): Problem[] {
    const folder = topic.toString() + "/" + division
    const result: Problem[] = []
    for (const fileName of Object.keys(fileToSolutionMap)) {
        const solution = fileToSolutionMap[fileName]
        let tolerance = Tolerance.CaseAndSpaceSensitive
        let solutions: string[] = []
        if (typeof solution === "object") {
            tolerance = solution.tolerance
            solutions = solution.answers
        } else {
            solutions = [solution]
        }
        result.push({
            imageName: folder + "/" + fileName,
            solutions, tolerance, topic, division
        })
    }
    return result
}

export const ALL_PROBLEMS: Problem[] = [
    ...problems(Topic.CompNumSystems, "Intermediate", {
        "1.png": "5755",
        "2.png": "86D7",
        "3.png": "6",
        "4.png": "5",
        "5.png": "526",
        "6.png": "750220",
        "7.png": "C",
        "8.png": "5",
        "9.png": "29/128",
        "10.png": "29F",
        "11.png": "144",
        "12.png": "10357",
        "13.png": { answers: ["C", "124"], tolerance: Tolerance.Lenient },
        "14.png": "77",
        "15.png": { answers: ["C, B, A, D"], tolerance: Tolerance.Lenient },
        "16.png": "24256142326",
        "17.png": "11",
        "18.png": "1",
        "19.png": { answers: ["B", "133337"], tolerance: Tolerance.Lenient },
        "20.png": "100101010",
        "21.png": "C",
        "22.png": "2",
        "23.png": "103",
        "24.png": "6C",
        "25.png": "196",
        "26.png": "322",
        "27.png": "1100011",
        "28.png": "41C",
        "29.png": "4",
        "30.png": "B17",
        "31.png": "A54",
        "32.png": "C",
        "33.png": "103",
        "34.png": "CCF",
        "35.png": "241",
        "36.png": "678",
        "37.png": "20053",
        "38.png": "101",
        "39.png": "567",
    }),
    ...problems(Topic.BitStrFlicking, "Intermediate", {
        "1.png": "00100",
        "2.png": "0*01*",
        "3.png": "00111"
    }),
    ...problems(Topic.LISP, "Intermediate", {
        "1.png": "40",
        "2.png": "(d f)"
    })
]
