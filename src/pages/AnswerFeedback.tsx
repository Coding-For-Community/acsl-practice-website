import { Button, Image, rem, Text } from "@mantine/core"
import { Problem } from "../config"

export function AnswerFeedback(args: {problem: Problem, userAnswer: string, onContinue: () => void}) {
    const isCorrect = args.problem.solution.toLowerCase() === args.userAnswer.toLowerCase() 
    const msg = isCorrect ? "Correct! Good Job" : ("Incorrect! The answer was: " + args.problem.solution)
    return (
        <>
            <Text mb={10}>{msg}</Text>
            <Image 
                src={`/src/assets/contest-solutions/${args.problem.imageName}`} 
                alt="Problem Solution Image" 
                w="auto"
                fit="contain"
                h={rem(100)}
                mb={10}
            />
            <Button color={isCorrect ? "green" : "gray"} onClick={args.onContinue}>Continue</Button>
        </>
    )
}