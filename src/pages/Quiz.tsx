import { Button, Image, rem, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { Problem } from "../config";

export type QuizError = "ok" | "no user" | "no contest" | "no questions"

export interface QuizArgs {
    problem: Problem | null
    error: QuizError
    onSubmit: (answer: string) => void
}

export function Quiz(args: QuizArgs) {
    const [answer, setAnswer] = useState("")
    const disabled = args.problem == null || args.error !== "ok"
    let errMsg: string | null = null
    switch (args.error) {
        case "no user": 
            errMsg = "Please tell us who you are (select your name)."
            break
        case "no contest": 
            errMsg = "Please select a contest to answer questions."
            break
        case "no questions": 
            errMsg = "No questions fit the criteria given."
            break
    }
    return (
        <>
            {
                args.problem != null && 
                <Image 
                    src={`/src/assets/contest-problems/${args.problem.imageName}`} 
                    alt="Problem Image" 
                    w={rem(600)}
                    fit="contain"
                    h="auto"
                />
            }
            <TextInput 
                label="Answer: "
                placeholder="Type Here"
                mb={10}
                w={rem(600)}
                value={answer}
                onChange={event => setAnswer(event.currentTarget.value)}
                onSubmit={() => args.onSubmit(answer)}
                error={errMsg}
                disabled={disabled}
                errorProps={{ fz: "sm"}}
            />
            <Button onClick={() => args.onSubmit(answer)} disabled={disabled}>
                Check Answer
            </Button>
        </>
    )
}