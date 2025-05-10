import { Tolerance, Division, Problem, Topic } from "../types"
import { NO_SOLUTION_OPTION } from "./otherConstants"

type FileName = string
type Solution = string | { answers: string[]; tolerance?: Tolerance }

function problems(
  topic: Topic,
  division: Division,
  defaultTolerance: Tolerance,
  fileToSolutionMap: Record<FileName, Solution>,
): Problem[] {
  const folder = topic.toString() + "/" + division
  const result: Problem[] = []
  for (const fileName of Object.keys(fileToSolutionMap)) {
    const solution = fileToSolutionMap[fileName]
    let tolerance = defaultTolerance
    let solutions: string[] = []
    if (typeof solution === "object") {
      tolerance = solution.tolerance ?? defaultTolerance
      solutions = solution.answers
    } else {
      solutions = [solution]
    }
    result.push({
      imageName: folder + "/" + fileName,
      solutions,
      tolerance,
      topic,
      division,
    })
  }
  return result
}

export const ALL_PROBLEMS: Problem[] = [
  ...problems(Topic.CompNumSystems, "Intermediate", "CaseSensitive", {
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
    "13.png": { answers: ["C", "124"], tolerance: "Lenient" },
    "14.png": "77",
    "15.png": { answers: ["C, B, A, D"], tolerance: "Lenient" },
    "16.png": "24256142326",
    "17.png": "11",
    "18.png": "1",
    "19.png": { answers: ["B", "133337"], tolerance: "Lenient" },
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
  // note: some problems excluded because we can't handle complex math exps yet
  ...problems(Topic.DigitalElec, "Intermediate", "CaseSensitive", {
    "1.png": { answers: ["(0,1,1)", "(1,1,1)"] },
    "3.png": "4",
    "4.png": "(1,0)",
    "5.png": "XYZ + !Y!Z",
    "6.png": "D",
    "7.png": "(1,0,1)",
    "9.png": "0",
    "11.png": "B!C",
    "12.png": { answers: ["(1,0,1)", "(0,0,1)", "(0,1,1)", "(0,1,0)"] },
    "13.png": { answers: ["(1,0,0)", "(0,0,0)", "(0,1,1)"] },
    "15.png": { answers: ["(0,0,0)", "(1,0,0)", "(1,1,0)"] },
    "16.png": "4",
    "17.png": "A!B!C",
    "18.png": { answers: ["(1,1,1)", "(0,1,1)", "(0,0,1)"] },
    "19.png": "ABC",
    "20.png": "3",
    "21.png": "!AB!C",
    "22.png": { answers: ["(0,0,0)", "(0,0,0)", "(0,1,1)"] },
    "23.png": "0",
    "24.png": "(1,1,0)",
    "25.png": "2",
    "26.png": "!A!B!C!D",
    "27.png": { answers: ["(1,1,0)", "(0,1,0)", "(0,0,1)"] },
    "28.png": "(0,0,0)",
    "29.png": { answers: ["(1,0,1)", "(1,1,1)", "(0,1,1)"] },
    "30.png": "(1,1,1)",
    "31.png": "2",
    "32.png": "D",
    "33.png": "2",
    "34.png": "C",
    "35.png": { answers: ["(1,1,0)", "(0,0,0)", "(0,1,0)"] },
    "36.png": NO_SOLUTION_OPTION,
    "37.png": "0",
    "38.png": { answers: ["(1,1,0)", "(1,0,0)"] },
    "39.png": "A!BC",
    "40.png": "!A!BC",
    "41.png": "(1,1,1)",
    "42.png": "8",
    "43.png": "ABC",
  }),
  ...problems(Topic.BitStrFlicking, "Intermediate", "CaseAndSpaceSensitive", {
    "1.png": "00100",
    "2.png": "0*01*",
    "3.png": "00111",
  }),
  ...problems(Topic.LISP, "Intermediate", "CaseAndSpaceSensitive", {
    "1.png": "40",
    "2.png": "(d f)",
  }),
  ...problems(Topic.GraphTheory, "Intermediate", "Lenient", {
    "1.png": "13",
    "2.png": "B",
    "3.png": "C",
    "5.png": "9",
    "6.png": "19",
    "8.png": "1",
    "9.png": "7",
    "11.png": "11",
    "12.png": "6",
    "13.png": "7",
    "14.png": "4",
    "16.png": "7",
    "17.png": "8",
    "18.png": "6",
    // TODO find out 19.png
    "20.png": "9",
    "22.png": "32",
    "24.png": "20",
    "25.png": "2",
    "26.png": "64",
    "28.png": "23",
    "30.png": "8",
    "32.png": {
      answers: [
        "AB,CB,DB",
        "AB,DB,CB",
        "CB,AB,DB",
        "CB,DB,AB",
        "DB,AB,CB",
        "DB,CB,AB",
      ],
    },
  }),
]
