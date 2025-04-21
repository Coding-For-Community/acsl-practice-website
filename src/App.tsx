import './App.css'
import { useState } from 'react'
import { Affix, AppShell, Button, Chip, Group, Image, Loader, MultiSelect, rem, Select, Stack, Text, Title } from '@mantine/core';
import { getRandomProblem, Problem } from './api/Problem';
import { Division } from "./api/Division";
import { Quiz, QuizError } from './pages/Quiz';
import { useQuery } from '@tanstack/react-query';
import { allPlayers, fetchAllPlayerData, updatePoints } from './api/api';
import { AnswerFeedback } from './pages/AnswerFeedback';
import { ALL_CONTEST_TOPICS, DIVISION_SELECT_SCHEMA, JUNIOR_DIVISION_SELECT_SCHEMA, Topic } from './api/Topic';

export function App() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [division, setDivision] = useState<Division>("Junior")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const sheetsDataQ = useQuery({
    queryKey: ['googleSheetsData'],
    queryFn: fetchAllPlayerData,
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
  
  const coins = 
    currentPlayer == null
      ? 0
      : sheetsDataQ.data[currentPlayer].totalCoins
  let error: QuizError = "ok"
  if (currentPlayer == null) {
    error = "no user"
  } else if (topics.length === 0) {
    error = "no topic"
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
            >{coins} Coins</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar px={rem(15)}>
          <Select
            my={rem(15)}
            searchable
            label="Who are you?"
            labelProps={{ c: "blue", fz: "lg" }}
            data={allPlayers(sheetsDataQ.data)}
            value={currentPlayer}
            onChange={value => {
              if (value != null) {
                setAnswer(null)
                setCurrentPlayer(value)
              }
            }}
          />
          <Select 
            mb={rem(15)}
            label="Choose division"
            data={["Senior", "Intermediate", "Junior"]}
            value={division}
            onChange={value => { 
              if (value != null) { 
                setAnswer(null)
                setDivision(value as Division) 
                setProblem(getRandomProblem(topics, value as Division))
              } 
            }}
          />
          <MultiSelect 
            mb={rem(10)}
            label="Choose topics to practice" 
            data={division === "Junior" ? JUNIOR_DIVISION_SELECT_SCHEMA : DIVISION_SELECT_SCHEMA}
            value={topics}
            clearable
            onChange={values => {
              setAnswer(null)
              setTopics(values as Topic[])
              setProblem(getRandomProblem(values as Topic[], division))
            }} 
          />
          <Chip 
            onClick={() => {
              if (topics === ALL_CONTEST_TOPICS) {
                setTopics([])
                setProblem(null)
              } else {
                setTopics(ALL_CONTEST_TOPICS)
                setProblem(getRandomProblem(ALL_CONTEST_TOPICS, division))
              }
            }}
            checked={topics.length === ALL_CONTEST_TOPICS.length}
          >Practice Everything</Chip>
        </AppShell.Navbar>

        <AppShell.Aside w={rem(350)}>
          Leaderboard/User Stats
        </AppShell.Aside>

        <AppShell.Main>
          {
            answer == null || problem == null
              ? <Quiz 
                  error={error}
                  problem={problem} 
                  onSubmit={answer => {
                    setAnswer(answer)
                    updatePoints(
                      sheetsDataQ.data[currentPlayer!!], 
                      problem!!.topic, 
                      answer === problem!!.solution
                    )
                      .then(() => sheetsDataQ.refetch())
                      .then(() => console.log("Points added successfully."))
                  }} 
                />
              : <AnswerFeedback 
                  problem={problem}
                  userAnswer={answer}
                  onContinue={() => {
                    setAnswer(null)
                    setProblem(getRandomProblem(topics, division))
                  }}
                />
          }
        </AppShell.Main>
      </AppShell>

      <Affix position={{ bottom: rem(15), right: rem(15) }}>
        <Button>View Stats & Leaderboard</Button>
      </Affix>
    </>
  )
}
