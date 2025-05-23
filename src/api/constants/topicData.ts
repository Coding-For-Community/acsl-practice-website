import { Topic } from "../types"

export const ALL_CONTEST_TOPICS = Object.values(Topic)
export const NON_JUNIOR_DIV_TOPICS = [
  Topic.LISP,
  Topic.FSAsAndRegExp,
  Topic.AssemblyLang,
]
/** A map between the contest num(1-4) and the topics within said contest. */
export const CONTEST_TO_TOPIC_MAP: Record<number, Topic[]> = {
  1: [Topic.CompNumSystems, Topic.RecursiveFuncs, Topic.WDTPD],
  2: [Topic.PIPNotation, Topic.BitStrFlicking, Topic.LISP],
  3: [Topic.BoolAlgebra, Topic.DataStructures, Topic.FSAsAndRegExp],
  4: [Topic.GraphTheory, Topic.DigitalElec, Topic.AssemblyLang],
}
/**
 * A map between a contest as well as its 'difficulty scalar'
 * (the multiplier for timer points calcs).
 */
export const TOPIC_DIFFICULTY_SCALARS: Record<Topic, number> = {
  [Topic.CompNumSystems]: 0.5,
  [Topic.RecursiveFuncs]: 0.5,
  [Topic.WDTPD]: 0.8,
  [Topic.PIPNotation]: 0.5,
  [Topic.BitStrFlicking]: 0.6,
  [Topic.LISP]: 0.7,
  [Topic.BoolAlgebra]: 0.7,
  [Topic.DataStructures]: 0.8,
  [Topic.FSAsAndRegExp]: 0.8,
  [Topic.GraphTheory]: 0.7,
  [Topic.DigitalElec]: 0.8,
  [Topic.AssemblyLang]: 0.7,
}
