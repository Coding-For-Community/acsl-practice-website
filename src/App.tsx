import { useRef, useState } from "react"
import {
  AppShell,
  Burger,
  Button,
  Chip,
  Divider,
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
import { Problem } from "./api/types"
import { randomProblem } from "./api/randomProblem"
import { Division } from "./api/types"
import { ALL_DIVISIONS } from "./api/constants/allDivisions"
import { Quiz, QuizError } from "./pages/Quiz"
import { useQuery } from "@tanstack/react-query"
import { allPlayers, fetchAllPlayerData, updatePoints } from "./api/api"
import { AnswerFeedback } from "./pages/AnswerFeedback"
import { Topic } from "./api/types"
import {
  ALL_CONTEST_TOPICS,
  CONTEST_TO_TOPIC_MAP,
  NON_JUNIOR_DIV_TOPICS,
} from "./api/constants/topicData"
import { Leaderboard } from "./pages/Leaderboard"
import { UserStatistics } from "./pages/UserStatistics"
import { ANON_PLAYER_NAME } from "./api/constants/otherConstants"
import { computePoints } from "./api/computePoints"
import { logDebug } from "./api/logDebug"
import { ChatbotChat, ChatMsg } from "./pages/ChatbotChat"

const TOPIC_SELECT_DATA = [1, 2, 3, 4].map(contestNum => ({
  group: `Contest ${contestNum}`,
  items: CONTEST_TO_TOPIC_MAP[contestNum],
}))
const JV_TOPIC_SELECT_DATA = [1, 2, 3, 4].map(contestNum => ({
  group: `Contest ${contestNum}`,
  items: CONTEST_TO_TOPIC_MAP[contestNum].filter(
    topic => !NON_JUNIOR_DIV_TOPICS.includes(topic),
  ),
}))

export function App() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [division, setDivision] = useState<Division>("Junior")
  const [problem, setProblem] = useState<Problem | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [latestPoints, setLatestPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [pointsCache, setPointsCache] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const timeRef = useRef(0)
  const sheetsDataQ = useQuery({
    queryKey: ["googleSheetsData"],
    queryFn: fetchAllPlayerData,
    staleTime: Infinity, // this data will not refetch unless if .refetch() is called
  })

  if (!sheetsDataQ.isSuccess) {
    if (sheetsDataQ.isError) {
      console.log(sheetsDataQ.error.message)
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
          collapsed: { mobile: !sidebarOpen },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group mt={rem(15)} mx={rem(15)} gap={rem(10)}>
            <Burger
              hiddenFrom="sm"
              size="sm"
              opened={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <Image src="ca-icon.png" alt="logo" h={rem(30)} w={rem(30)} />
            <Title order={3} visibleFrom="xs">
              CA ACSL practice website
            </Title>
            <Text ml="auto" c="blue" fw="bold" fz="lg">
              Coins:{" "}
              {(playerData == null
                ? 0
                : playerData.totalCoins + pointsCache
              ).toFixed(1)}
            </Text>
            <Divider orientation="vertical" size="sm" />
            <Text c="yellow" fw="bold" fz="lg">
              Streak: {streak}
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
                if (value == null) return
                setAnswer(null)
                setStreak(0)
                timeRef.current = 0
                setCurrentPlayer(value)
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
                  setProblem(randomProblem(topics, value as Division))
                }
              }}
            />
            <MultiSelect
              mb={rem(10)}
              label="Choose topics to practice"
              data={
                division === "Junior" ? JV_TOPIC_SELECT_DATA : TOPIC_SELECT_DATA
              }
              value={topics}
              clearable
              onChange={values => {
                setAnswer(null)
                setTopics(values as Topic[])
                setProblem(randomProblem(values as Topic[], division))
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
                  setProblem(randomProblem(ALL_CONTEST_TOPICS, division))
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
            <Button color="yellow" onClick={() => setLeaderboardOpen(true)}>
              Leaderboard
            </Button>
          </Group>
        </AppShell.Navbar>

        <AppShell.Main>
          {answer == null || problem == null ? (
            <Quiz
              error={error}
              problem={problem}
              timeRef={timeRef}
              onSubmit={answer => {
                setAnswer(answer)
                if (playerData == null || problem == null) return
                const points = computePoints(
                  answer,
                  problem,
                  timeRef.current,
                  streak,
                  setStreak,
                )
                setLatestPoints(points)
                // pointsCache basically allows the user to see point updates immediately
                // even when a backend call is being made
                setPointsCache(prevValue => prevValue + points)
                updatePoints(playerData, problem.topic, points)
                  .then(() => sheetsDataQ.refetch())
                  .then(() => {
                    logDebug("[computePoints] Points added successfully.")
                    setPointsCache(prevValue => prevValue - points)
                  })
              }}
            />
          ) : (
            <AnswerFeedback
              problem={problem}
              userAnswer={answer}
              points={latestPoints}
              onContinue={() => {
                setAnswer(null)
                setProblem(randomProblem(topics, division))
                setMessages([])
              }}
            />
          )}
        </AppShell.Main>
      </AppShell>

      <ChatbotChat
        problem={problem}
        userAnswer={answer}
        messages={messages}
        setMessages={setMessages}
      />

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
