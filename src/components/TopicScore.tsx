import { Group, Progress, rem, Text } from "@mantine/core"
import { PlayerData } from "../api/api"
import { memo } from "react"
import { Topic } from "../api/Topic"

export const TopicScore = memo(TopicScoreImpl)

function TopicScoreImpl(args: {
  userData: PlayerData
  topic: Topic
  viewAsPercent?: boolean
}) {
  const scoreAsStr = args.userData.statistics[args.topic]
  if (scoreAsStr == null) return null
  let evaluatedScore: number = eval(scoreAsStr)
  if (evaluatedScore == null) return null
  const label = args.viewAsPercent
    ? Math.round(evaluatedScore * 100) + "%"
    : scoreAsStr
  let color = "darkgreen"
  if (evaluatedScore < 0.5) {
    color = "red"
  } else if (evaluatedScore < 0.7) {
    color = "yellow.4"
  } else if (evaluatedScore < 0.95) {
    color = "green"
  }

  return (
    <Group mt={rem(8)} mb={rem(2)}>
      <Text fz="sm">{args.topic}</Text>
      <Progress.Root size="xl" h={rem(20)} w={rem(200)} ml="auto">
        <Progress.Section value={Math.max(evaluatedScore * 100, 15)} color={color}>
          <Progress.Label>{label}</Progress.Label>
        </Progress.Section>
      </Progress.Root>
    </Group>
  )
}
