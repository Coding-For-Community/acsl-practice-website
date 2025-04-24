import { Button, Image, rem, Text, Title } from "@mantine/core"
import { isCorrect, Problem } from "../api/Problem"
import { useHotkeys } from "@mantine/hooks"

export function AnswerFeedback(args: {problem: Problem, userAnswer: string, onContinue: () => void}) {
    // TODO add trim
    const correct = isCorrect(args.userAnswer, args.problem)
    const msg = correct ? "Correct! Good Job!!!" : ("Incorrect! Correct Answer(s): " + args.problem.solutions.join(", "))
    useHotkeys([
        ['Enter', args.onContinue]
    ]) // allows user to press enter to continue

    return (
        <div>
            <Title order={3} mb={rem(10)} c={correct ? "green" : "red"}>{msg}</Title>
            <Text mb={rem(5)}>Solution: </Text>
            <Image 
                src={`/src/assets/contest-solutions/${args.problem.imageName}`} 
                alt="Problem Solution Image" 
                h="auto"
                fit="contain"
                w={rem(600)}
                mb={rem(5)}
            />
            <Text mb={rem(5)}>Problem: </Text>
            <Image 
                src={`/src/assets/contest-problems/${args.problem.imageName}`} 
                alt="Problem Image" 
                h="auto"
                fit="contain"
                w={rem(600)}
                mb={rem(5)}
            />
            <Button color={correct ? "green" : "gray"} onClick={args.onContinue}>Continue</Button>
        </div>
    )
}