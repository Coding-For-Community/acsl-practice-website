import { Alert, Button, Code, Group, Image, rem, Switch, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { Problem } from "../api/Problem"
import { getHotkeyHandler } from "@mantine/hooks"
import { Topic } from "../api/Topic"
import { Info } from "../components/icons/Info"
import { NO_SOLUTION_OPTION } from "../api/constants/otherConstants"

export type QuizError = "ok" | "no user" | "no topic" | "no questions"

export interface QuizArgs {
  problem: Problem | null
  error: QuizError
  onSubmit: (answer: string) => void
}

export function Quiz(args: QuizArgs) {
  const [answer, setAnswer] = useState("")
  const [noSolution, setNoSolution] = useState(false)
  const disabled = args.problem == null || args.error !== "ok"
  let errMsg: string | null = null
  switch (args.error) {
    case "no user":
      errMsg = "No user specified. (On the left panel; on small screens, click the menu icon to open it)"
      break
    case "no topic":
      errMsg = "No topics have been chosen. (On the left panel; on small screens, click the menu icon to open it)"
      break
    case "no questions":
      errMsg = "No questions fit the criteria given."
      break
  }
  const submitFunction = () => {
    if (answer === "") return
    args.onSubmit(noSolution ? NO_SOLUTION_OPTION : answer)
  }
  return (
    <div style={{ maxWidth: rem(600), minWidth: rem(300) }}>
      {args.problem != null && (
        <Image
          src={`contest-problems/${args.problem.imageName}`}
          alt="Problem Image"
          fit="contain"
          h="auto"
        />
      )}
      <TextInput
        label="Answer: "
        placeholder="Type Here"
        mb={10}
        value={answer}
        onChange={event => setAnswer(event.currentTarget.value)}
        onKeyDown={getHotkeyHandler([["Enter", submitFunction]])}
        error={errMsg}
        disabled={noSolution || disabled}
        errorProps={{ fz: "sm" }}
      />
      <Group mb={rem(10)} justify="center">
        <Button onClick={submitFunction} disabled={disabled}>
          Check Answer
        </Button>
        <Switch 
          ml="auto"
          label="No Solution"
          labelPosition="left"
          fw="600"
          c="red.9" // sets text color
          color="red.9" // sets the toggler color
          disabled={disabled}
          checked={noSolution}
          onChange={() => setNoSolution(!noSolution)}
        />
      </Group>
      {(args.problem?.topic === Topic.DigitalElec ||
        args.problem?.topic === Topic.BoolAlgebra) && (
        <Alert
          variant="light"
          color="blue"
          title="Notice:"
          icon={<Info />}
        >
          <Text fz="xs">
            For Digital Elec/Boolean Alg questions which have multiple answers
            that satisfy the conditions given in the problem, only enter ONE of
            the possible answers.
            <br /> <br />
            For instance, if the tuples (0, 1, 1) and (1, 0, 1) satisfy the
            conditions given in the problem, only answer <Code>
              (0,1,1)
            </Code> or <Code>(1,0,1)</Code>. Don't comma-separate answers or use
            * notation: <br />
            like <Code>(0,1,1), (1,0,1)</Code> or <Code>(*,0,1)</Code>.
            <br /> <br />
            In order to denote (not A), use <Code>!A</Code> or{" "}
            <Code>!(AB)</Code>. For (A or B), use <Code>A + B</Code>. For (A and
            B), use <Code>AB</Code>.
          </Text>
        </Alert>
      )}
    </div>
  )
}
