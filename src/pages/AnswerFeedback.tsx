import { Button, Image, rem, Text, Title } from "@mantine/core"
import { Problem } from "../api/Problem"
import { useHotkeys } from "@mantine/hooks"

export function AnswerFeedback(args: {problem: Problem, userAnswer: string, onContinue: () => void}) {
    const isCorrect = args.problem.solution.toLowerCase() === args.userAnswer.toLowerCase() 
    const msg = isCorrect ? "Correct! Good Job!!!" : ("Incorrect! The answer was: " + args.problem.solution)
    useHotkeys([
        ['Enter', args.onContinue]
    ]) // allows user to press enter to continue

    return (
        <div>
            <Title order={3} mb={rem(10)} c={isCorrect ? "green" : "red"}>{msg}</Title>
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
            <Button color={isCorrect ? "green" : "gray"} onClick={args.onContinue}>Continue</Button>
        </div>
    )
}