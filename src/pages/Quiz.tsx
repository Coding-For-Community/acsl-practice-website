import { Button, Image, rem, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { Problem } from "../config";

export interface QuizArgs {
    problem: Problem | null
    hasNotChosen: boolean,
    canAnswer: boolean,
    onSubmit: (answer: string) => void
}

export function Quiz(args: QuizArgs) {
    const [answer, setAnswer] = useState("");
    return (
        <>
            {
                args.problem != null
                    ? <Image 
                        src={`/src/assets/contest-problems/${args.problem.imageName}`} 
                        alt="Problem Image" 
                        w="auto"
                        fit="contain"
                        h={rem(100)}
                    />
                    : <Text>{args.hasNotChosen ? "Choose a contest to get started!" : "No problems fit these criteria."}</Text>
            }
            <TextInput 
                label="Answer: "
                placeholder="Type Here"
                mb={10}
                w={rem(500)}
                value={answer}
                onChange={event => setAnswer(event.currentTarget.value)}
                onSubmit={() => args.onSubmit(answer)}
                disabled={!args.canAnswer}
                error={args.canAnswer ? null : "Please tell us who you are(Choose User)."}
            />
            <Button onClick={() => args.onSubmit(answer)} disabled={!args.canAnswer}>
                Check Answer
            </Button>
        </>
    )
}