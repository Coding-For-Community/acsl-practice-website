import { Button, Image, rem, Text, Title } from "@mantine/core"
import { isCorrect, Problem } from "../api/Problem"
import { useHotkeys } from "@mantine/hooks"

export interface FeedbackArgs {
  problem: Problem
  userAnswer: string
  onContinue: () => void
}

export function AnswerFeedback(args: FeedbackArgs) {
  // TODO add trim
  const correct = isCorrect(args.userAnswer, args.problem)
  const msg = correct
    ? "Correct! Good Job!!!"
    : "Incorrect! Correct Answer(s): " + args.problem.solutions.join(", ")
  useHotkeys([["Enter", args.onContinue]]) // allows user to press enter to continue

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
