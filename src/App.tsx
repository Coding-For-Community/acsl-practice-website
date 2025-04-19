import { useState } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { AppShell, Group, Image, Loader, MultiSelect, rem, Select, Stack, Text, Title } from '@mantine/core';
import { Contest, Division, getRandomProblem, Problem } from './config';
import { Quiz, QuizError } from './pages/Quiz';
import { useQuery } from '@tanstack/react-query';
import { addPointsToPlayer, getGoogleSheetsData } from './googleSheetsApi';
import { AnswerFeedback } from './pages/AnswerFeedback';

export function App() {
  const [contests, setContests] = useState<Contest[]>([])
  const [division, setDivision] = useState<Division>("Junior")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const sheetsDataQ = useQuery({
    queryKey: ['googleSheetsData'],
    queryFn: getGoogleSheetsData,
    staleTime: Infinity
  })

  if (!sheetsDataQ.isSuccess) {
    if (sheetsDataQ.isError) {
      console.log(sheetsDataQ.error)
    }
    return (
      <Group align="center" justify="center" h="100vh">
        <Loader color="cyan" size="xl" />
        <Title order={3}>Loading...</Title>
      </Group>
    )
  }
  
  const points = 
    currentPlayer == null
      ? 0
      : sheetsDataQ.data.pointValues[sheetsDataQ.data.allPlayers.indexOf(currentPlayer)]
  let error: QuizError = "ok"
  if (currentPlayer == null) {
    error = "no user"
  } else if (contests.length === 0) {
    error = "no contest"
  } else if (problem == null) {
    error = "no questions"
  }

  return (
    <>
      <AppShell
        header={{ height: rem(60) }}
        navbar={{
          width: rem(300),
          breakpoint: 'sm'
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group mt={rem(15)} ml={rem(14)} gap={rem(10)}>
            <Image
              src="/src/assets/ca-icon.png"
              alt="logo"
              h={rem(30)}
            />
            <Title order={3}>CA ACSL practice website</Title>
            <Text 
              ml="auto" 
              mr={rem(14)} 
              c="blue" 
              fw="bold"
              fz="lg"
            >{points} Points</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap={rem(15)}>
            <Select
              searchable
              label="Who are you?"
              labelProps={{ c: "blue", fz: "lg" }}
              data={sheetsDataQ.data.allPlayers}
              value={currentPlayer}
              onChange={value => {
                if (value != null) {
                  setCurrentPlayer(value)
                }
              }}
            />
            <MultiSelect 
              label="Choose Contests" 
              data={["Contest 1", "Contest 2", "Contest 3", "Contest 4"]}
              value={contests}
              onChange={values => {
                setContests(values as Contest[])
                setProblem(getRandomProblem(values as Contest[], division))
              }} 
            />
            <Select 
              label="Choose division"
              data={["Senior", "Intermediate", "Junior"]}
              value={division}
              onChange={value => { 
                if (value != null) { 
                  setDivision(value as Division) 
                  setProblem(getRandomProblem(contests, value as Division))
                } 
              }}
            />
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          {
            answer == null || problem == null
              ? <Quiz 
                  error={error}
                  problem={problem} 
                  onSubmit={answer => {
                    setAnswer(answer)
                    if (answer === problem!!.solution) {
                      addPointsToPlayer(currentPlayer!!, problem!!.points, sheetsDataQ.data)
                        .then(() => sheetsDataQ.refetch())
                        .then(() => console.log("Points added successfully."))
                    }
                  }} 
                />
              : <AnswerFeedback 
                  problem={problem}
                  userAnswer={answer}
                  onContinue={() => {
                    setAnswer(null)
                    setProblem(getRandomProblem(contests, division))
                  }}
                />
          }
        </AppShell.Main>
      </AppShell>
    </>
  )
}
