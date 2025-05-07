import { Button, Image, rem, Text, Title } from "@mantine/core"
import { isCorrect, Problem } from "../api/Problem"
import { useHotkeys } from "@mantine/hooks"
import { NO_SOLUTION_OPTION } from "../api/constants/otherConstants"

export interface FeedbackArgs {
  problem: Problem
  userAnswer: string
  onContinue: () => void
}

export function AnswerFeedback(args: FeedbackArgs) {
  useHotkeys([["Enter", args.onContinue]]) // allows user to press enter to continue
  const correct = isCorrect(args.userAnswer, args.problem)
  let msg = "Correct! Good Job!!!"
  if (!correct) {
    const sols = args.problem.solutions
    if (sols.includes(NO_SOLUTION_OPTION)) {
      msg = "Incorrect! There was no solution."
    } else {
      msg = "Incorrect! Correct Answer(s): " + args.problem.solutions.join(", ")
    }
  } 

  return (
    <div style={{ maxWidth: rem(600), minWidth: rem(300) }}>
      <Title order={3} mb={rem(15)} c={correct ? "green" : "red"}>
        {msg}
      </Title>
      <Text mb={rem(5)} td="underline">
        Solution:{" "}
      </Text>
      <Image
        src={`contest-solutions/${args.problem.imageName}`}
        alt="Problem Solution Image"
        h="auto"
        fit="contain"
        mb={rem(5)}
      />
      <Text mb={rem(5)} td="underline">
        Problem:{" "}
      </Text>
      <Image
        src={`contest-problems/${args.problem.imageName}`}
        alt="Problem Image"
        h="auto"
        fit="contain"
        mb={rem(5)}
      />
      <Button color={correct ? "green" : "gray"} onClick={args.onContinue}>
        Continue
      </Button>
    </div>
  )
}
