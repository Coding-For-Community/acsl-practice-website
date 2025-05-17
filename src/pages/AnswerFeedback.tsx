import { Button, Image, rem, Text, Title } from "@mantine/core"
import { Problem } from "../api/types"
import { useHotkeys } from "@mantine/hooks"
import { memo } from "react"

export const AnswerFeedback = memo(AnswerFeedbackImpl)

export interface FeedbackArgs {
  problem: Problem
  userAnswer: string
  points: number
  onContinue: () => void
}

function AnswerFeedbackImpl(args: FeedbackArgs) {
  useHotkeys([["Enter", args.onContinue]]) // allows user to press enter to continue
  const correct = args.points > 0.01
  let msg = correct
    ? "Correct! Good Job!!!"
    : "Incorrect! Correct Answer(s): " + args.problem.solutions.join(", ")

  return (
    <div style={{ maxWidth: rem(600), minWidth: rem(300) }}>
      <Title order={3} mb={rem(15)} c={correct ? "green" : "red"}>
        {msg}
      </Title>
      <Text mb={rem(5)} td="underline">
        Solution:
      </Text>
      <Image
        src={`contest-solutions/${args.problem.imageName}`}
        alt="Problem Solution Image"
        h="auto"
        fit="contain"
        mb={rem(5)}
      />
      <Text mb={rem(5)} td="underline">
        Problem:
      </Text>
      <Image
        src={`contest-problems/${args.problem.imageName}`}
        alt="Problem Image"
        h="auto"
        fit="contain"
        mb={rem(5)}
      />
      <Text mb={rem(5)}>Your answer: {args.userAnswer}</Text>
      <Text mb={rem(5)}>Points earned: {args.points.toFixed(1)}</Text>
      <Button color={correct ? "green" : "gray"} onClick={args.onContinue}>
        Continue
      </Button>
    </div>
  )
}
