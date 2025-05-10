/**
 * Represents a contest problem.
 */
export interface Problem {
  imageName: string
  solutions: string[]
  topic: Topic
  division: Division
  tolerance: Tolerance
}

/**
 * A string type that represents a division.
 */
export type Division =
  | "Senior"
  | "Intermediate"
  | "Junior"
  | "Senior (All star)"
  | "Intermediate (All star)"
  | "Junior (All star)"

/**
 * An enum that represents a specific contest topic.
 * An enum is used over a string type here, as it allows for a more compact
 * in-code representation.
 */
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

/**
 * A string type that represents how answer checking should function
 * (whether to ignore whitespace, case, or whether to ignore both - Lenient).
 */
export type Tolerance =
  | "Lenient"
  | "CaseSensitive"
  | "SpaceSensitive"
  | "CaseAndSpaceSensitive"
