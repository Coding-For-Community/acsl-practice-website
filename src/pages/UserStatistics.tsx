import {
  Divider,
  Group,
  HoverCard,
  rem,
  Switch,
  Text,
  Title,
} from "@mantine/core"
import { PlayerData } from "../api/api"
import { ALL_CONTEST_TOPICS } from "../api/constants/topicSchema"
import { TopicScore } from "../components/TopicScore"
import { memo, useState } from "react"
import { CustomDrawer } from "../components/CustomDrawer"
import { SmallCircle } from "../components/SmallCircle"

export const UserStatistics = memo(UserStatisticsImpl)

export interface UserStatisticsArgs {
  open: boolean
  close: () => void
  playerData: PlayerData | null
}

function UserStatisticsImpl(args: UserStatisticsArgs) {
  const data = args.playerData
  if (data == null) return <></>
  const [viewAsPercent, setViewAsPercent] = useState(false)
  let numCorrect = 0
  let numTotal = 0
  for (let value of Object.values(data.statistics)) {
    if (value == null) continue
    const slashIdx = value.indexOf("/")
    if (slashIdx === -1) continue
    numCorrect += parseInt(value.substring(0, slashIdx))
    numTotal += parseInt(value.substring(slashIdx + 1))
  }

  return (
    <CustomDrawer
      opened={args.open}
      onClose={args.close}
      title="Your Statistics"
    >
      <Title order={4} mb={rem(3)}>
        Overall
      </Title>
      <Divider />

      <Group mt={rem(5)}>
        <Text fz="md">Coins</Text>
        <SmallCircle bg="yellow">{Math.round(data.totalCoins)}</SmallCircle>
      </Group>
      <Group mt={rem(5)}>
        <Text fz="md">Total Correct</Text>
        <SmallCircle bg="green">{numCorrect}</SmallCircle>
      </Group>
      <Group mt={rem(5)}>
        <Text fz="md">Total Attempts</Text>
        <SmallCircle bg="blue" fz="sm">
          {numTotal}
        </SmallCircle>
      </Group>

      <Group gap={rem(5)} mt={rem(20)}>
        <Title order={4} mb={rem(3)}>
          Scores by Topic
        </Title>
        <HoverCard>
          <HoverCard.Target>
            <Text mb={rem(3)} c="blue">
              [?]
            </Text>
          </HoverCard.Target>
          <HoverCard.Dropdown fz="sm" w={rem(250)} p="sm">
            Your correctness rate for all topics you practiced. Can be displayed
            as a fraction(# correct/# attempts) or as a correctness percentage.
          </HoverCard.Dropdown>
        </HoverCard>
        <Text fz="xs" ml="auto">
          View as Percent
        </Text>
        <Switch
          size="sm"
          checked={viewAsPercent}
          onChange={() => setViewAsPercent(!viewAsPercent)}
        />
      </Group>
      <Divider />
      {data.totalCoins === 0 ? (
        <Text>Start practicing to see your results here.</Text>
      ) : (
        ALL_CONTEST_TOPICS.map((topic, idx) => (
          <TopicScore
            userData={data}
            topic={topic}
            viewAsPercent={viewAsPercent}
            key={idx}
          />
        ))
      )}

      <Title order={4} mb={rem(3)} mt={rem(25)}>
        Achievements
      </Title>
      <Divider />
      <Text>Not implemented yet - see you soon!</Text>
    </CustomDrawer>
  )
}
