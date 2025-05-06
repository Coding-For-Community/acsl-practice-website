import "./App.css"
import { useState } from "react"
import {
  AppShell,
  Burger,
  Button,
  Chip,
  Group,
  Image,
  Loader,
  MultiSelect,
  rem,
  ScrollArea,
  Select,
  Text,
  Title,
} from "@mantine/core"
import { getRandomProblem, isCorrect, Problem } from "./api/Problem"
import { ALL_DIVISIONS, Division } from "./api/Division"
import { Quiz, QuizError } from "./pages/Quiz"
import { useQuery } from "@tanstack/react-query"
import { allPlayers, fetchAllPlayerData, updatePoints } from "./api/api"
import { AnswerFeedback } from "./pages/AnswerFeedback"
import {
  ALL_CONTEST_TOPICS,
  DIVISION_SELECT_SCHEMA,
  JUNIOR_DIVISION_SELECT_SCHEMA,
  Topic,
} from "./api/Topic"
import { Leaderboard } from "./pages/Leaderboard"
import { UserStatistics } from "./pages/UserStatistics"

const ANON_PLAYER_NAME = "ANONYMOUS PLAYER" // testing

export function App() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [division, setDivision] = useState<Division>("Junior")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  const sheetsDataQ = useQuery({
    queryKey: ["googleSheetsData"],
    queryFn: fetchAllPlayerData,
    staleTime: Infinity,
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

  const playerData =
    currentPlayer == null || currentPlayer === ANON_PLAYER_NAME
      ? null
      : sheetsDataQ.data[currentPlayer]
  const allTopicsChosen = topics.length === ALL_CONTEST_TOPICS.length
  let error: QuizError = "ok"
  if (currentPlayer == null) {
    error = "no user"
  } else if (topics.length === 0) {
    error = "no topic"
  } else if (problem == null) {
    error = "no questions"
  }

  return (
    <div>
      <AppShell
        header={{ height: rem(60) }}
        navbar={{
          width: rem(325),
          breakpoint: "sm",
          collapsed: { mobile: !sidebarOpen }
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group mt={rem(15)} ml={rem(14)} gap={rem(10)}>
            <Burger 
              hiddenFrom="sm" 
              size="sm"
              opened={sidebarOpen} 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <Image src="ca-icon.png" alt="logo" h={rem(30)} w={rem(30)} />
            <Title order={3}>CA ACSL practice website</Title>
            <Text ml="auto" mr={rem(14)} c="blue" fw="bold" fz="lg">
              {playerData?.totalCoins ?? 0} Coins
            </Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <ScrollArea type="auto" px={rem(15)}>
            <Select
              mt={rem(15)}
              searchable
              label="Who are you?"
              labelProps={{ c: "blue", fz: "lg" }}
              data={[ANON_PLAYER_NAME].concat(allPlayers(sheetsDataQ.data))}
              value={currentPlayer}
              onChange={value => {
                if (value != null) {
                  setAnswer(null)
                  setCurrentPlayer(value)
                }
              }}
            />
            <Text size="xs" c="gray" mb={rem(15)}>
              Dont see your name? Choose "ANONYMOUS PLAYER".
            </Text>
            <Select
              mb={rem(15)}
              label="Choose division"
              data={ALL_DIVISIONS}
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
              data={
                division === "Junior"
                  ? JUNIOR_DIVISION_SELECT_SCHEMA
                  : DIVISION_SELECT_SCHEMA
              }
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
                setAnswer(null)
                if (allTopicsChosen) {
                  setTopics([])
                  setProblem(null)
                } else {
                  setTopics(ALL_CONTEST_TOPICS)
                  setProblem(getRandomProblem(ALL_CONTEST_TOPICS, division))
                }
              }}
              checked={allTopicsChosen}
              mb={rem(70)}
            >
              Practice Everything
            </Chip>
          </ScrollArea>
          <Group
            gap={rem(15)}
            style={{ position: "absolute", bottom: rem(15), left: rem(15) }}
          >
            <Button onClick={() => setStatsOpen(true)}>Your Statistics</Button>
            <Button
              color="yellow"
              onClick={() => {
                setLeaderboardOpen(true)
                console.log("Leaderboard OPEN: " + leaderboardOpen)
              }}
            >
              Leaderboard
            </Button>
          </Group>
        </AppShell.Navbar>

        <AppShell.Main>
          {answer == null || problem == null ? (
            <Quiz
              error={error}
              problem={problem}
              onSubmit={answer => {
                setAnswer(answer)
                if (playerData == null) return
                updatePoints(
                  playerData,
                  problem!!.topic,
                  isCorrect(answer, problem!!),
                )
                  .then(() => sheetsDataQ.refetch())
                  .then(() => console.log("Points added successfully."))
              }}
            />
          ) : (
            <AnswerFeedback
              problem={problem}
              userAnswer={answer}
              onContinue={() => {
                setAnswer(null)
                setProblem(getRandomProblem(topics, division))
              }}
            />
          )}
        </AppShell.Main>
      </AppShell>

      <UserStatistics
        open={statsOpen}
        close={() => setStatsOpen(false)}
        playerData={playerData}
      />

      <Leaderboard
        open={leaderboardOpen}
        close={() => setLeaderboardOpen(false)}
        allPlayersData={sheetsDataQ.data}
        currentPlayer={currentPlayer}
      />
    </div>
  )
}
