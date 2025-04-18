import { useState } from 'react'
import './App.css'
import '@mantine/core/styles.css';
import { AppShell, Group, Image, Loader, MultiSelect, rem, Select, Stack, Title } from '@mantine/core';
import { Contest, Division, getRandomProblem, Problem } from './config';
import { Quiz } from './pages/Quiz';
import { useQuery } from '@tanstack/react-query';
import { getGoogleSheetsData } from './googleSheetsApi';

export function App() {
  const [contests, setContests] = useState<Contest[]>([])
  const [division, setDivision] = useState<Division>("Junior")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [isAnswering, setAnswering] = useState(true)
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

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm'
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group mt={15} ml={10} gap={10}>
            <Image
              src="/src/assets/ca-icon.png"
              alt="logo"
              h={rem(30)}
            />
            <Title order={3}>CA ACSL practice website</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap={15}>
            <Select
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
          <Quiz 
            hasNotChosen={contests.length === 0} 
            problem={problem} 
            submit={() => {}} 
            canSubmit={currentPlayer != null}
          />
        </AppShell.Main>
      </AppShell>
    </>
  )
}
