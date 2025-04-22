import { Divider, Drawer, Group, HoverCard, rem, Switch, Text, Title } from "@mantine/core"
import { PlayerData } from "../api/api"
import { ALL_CONTEST_TOPICS } from "../api/Topic"
import { TopicScore } from "../components/TopicScore"
import { useState } from "react"

export interface UserStatisticsArgs {
    open: boolean
    close: () => void
    playerData: PlayerData | null
}

export function UserStatistics(args: UserStatisticsArgs) {
    const data = args.playerData
    if (data == null) return <></>
    const [viewAsPercent, setViewAsPercent] = useState(false)

    return (
        <Drawer 
            opened={args.open} 
            onClose={args.close}  
            padding={rem(15)} 
            title={<Title order={2} c="blue">Your Statistics</Title>}
            size="md"
            position="right"
        >
            <Group gap={rem(5)}>
                <Title order={4} mb={rem(3)}>Topic Scores</Title>
                <HoverCard>
                    <HoverCard.Target><Text mb={rem(3)} c="blue">[?]</Text></HoverCard.Target>
                    <HoverCard.Dropdown fz="sm" w={rem(250)} p="sm">
                        Your correctness rate for all topics you practiced. 
                        Can be displayed as a fraction(# correct/# attempts)
                        or as a correctness percentage. 
                    </HoverCard.Dropdown>
                </HoverCard>
                <Text fz="xs" ml="auto">View as Percent</Text>
                <Switch size="sm" checked={viewAsPercent} onChange={() => setViewAsPercent(!viewAsPercent)} />
            </Group>
            <Divider />
            {
                data.totalCoins === 0
                    ? <Text>Start practicing to see your results here.</Text> 
                    : ALL_CONTEST_TOPICS.map(topic => 
                        <TopicScore 
                            userData={data}
                            topic={topic}
                            viewAsPercent={viewAsPercent}
                        />
                    )
            }
            <Title order={4} mb={rem(3)} mt={rem(30)}>Achievements</Title>
            <Divider /> 
            <Text>Not implemented yet - see you soon!</Text>
        </Drawer>
    )
}