import { Button, Image, rem, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { Problem } from "../config";

export interface QuizArgs {
    problem: Problem | null
    hasNotChosen: boolean,
    canSubmit: boolean,
    submit: (answer: string) => void
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
                onSubmit={() => args.submit(answer)}
                disabled={!args.canSubmit}
                error={args.canSubmit ? null : "Please tell us who you are(Choose User)."}
            />
            <Button onClick={() => args.submit(answer)} disabled={!args.canSubmit}>
                Check Answer
            </Button>
        </>
    )
}