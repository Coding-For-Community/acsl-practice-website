import { ComboboxItemGroup } from "@mantine/core"

export enum Topic {
  CompNumSystems = "Computer Number Systems",
  RecursiveFuncs = "Recursive Functions",
  WDTPD = "What Does This Program Do",
  PIPNotation = "Prefix/Infix/Postfix Notation",
  BitStrFlicking = "Bit-String Flicking",
  LISP = "LISP",
  BoolAlgebra = "Boolean Algebra",
  DataStructures = "Data Structures",
  FSAsAndRegExp = "FSAs and Regular Expressions",
  GraphTheory = "Graph Theory",
  DigitalElec = "Digital Electronics",
  AssemblyLang = "Assembly Language",
}

export const ALL_CONTEST_TOPICS = Object.values(Topic)
export const NON_JUNIOR_DIV_TOPICS = [
  Topic.LISP,
  Topic.FSAsAndRegExp,
  Topic.AssemblyLang,
]
export const CONTEST_TO_TOPIC_MAP: Record<number, Topic[]> = {
  1: [Topic.CompNumSystems, Topic.RecursiveFuncs, Topic.WDTPD],
  2: [Topic.PIPNotation, Topic.BitStrFlicking, Topic.LISP],
  3: [Topic.BoolAlgebra, Topic.DataStructures, Topic.FSAsAndRegExp],
  4: [Topic.GraphTheory, Topic.DigitalElec, Topic.AssemblyLang],
}
export const DIVISION_SELECT_SCHEMA: ComboboxItemGroup[] = [1, 2, 3, 4].map(
  contestNum => ({
    group: `Contest ${contestNum}`,
    items: CONTEST_TO_TOPIC_MAP[contestNum].map(topic => topic.toString()),
  }),
)
export const JUNIOR_DIVISION_SELECT_SCHEMA: ComboboxItemGroup[] = [
  1, 2, 3, 4,
].map(contestNum => ({
  group: `Contest ${contestNum}`,
  items: CONTEST_TO_TOPIC_MAP[contestNum]
    .filter(topic => !NON_JUNIOR_DIV_TOPICS.includes(topic))
    .map(topic => topic.toString()),
}))

export function getId(topic: Topic) {
  return ALL_CONTEST_TOPICS.indexOf(topic)
}
