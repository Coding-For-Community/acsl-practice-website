export const ALL_DIVISIONS: Division[] = [
  "Senior",
  "Intermediate",
  "Junior",
  "Senior (All star)",
  "Intermediate (All star)",
  "Junior (All star)",
]

// the | syntax means that Division can be any of the strings below
export type Division =
  | "Senior"
  | "Intermediate"
  | "Junior"
  | "Senior (All star)"
  | "Intermediate (All star)"
  | "Junior (All star)"
