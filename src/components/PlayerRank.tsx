import { Group, Paper, rem, Text, Title } from "@mantine/core";
import { NumberedTrophy } from "./icons/NumberedTrophy";
import { Star } from "./icons/Star";

export interface PlayerRankArgs {
    name: string
    rank: number
    coins: number
    isSelf: boolean
}

export function PlayerRank(args: PlayerRankArgs) {
    let icon = <></>
    let color = ""
    switch (args.rank) {
        case 1:
            color = "var(--mantine-color-yellow-7)" 
            icon = <NumberedTrophy num={1} color={color} />
            break
        case 2: 
            color = "var(--mantine-color-gray-5)"
            icon = <NumberedTrophy num={2} color={color} />
            break
        case 3: 
            color = "rgb(192, 114, 41)"
            icon = <NumberedTrophy num={3} color={color} />
            break
        default:
            icon = 
                <Star style={{ 
                    width: rem(25), 
                    height: rem(25), 
                    marginTop: rem(8), 
                    marginBottom: rem(8), 
                    marginLeft: rem(6), 
                    marginRight: rem(4)
                }} />
            color = "var(--mantine-color-black)"
    }

    return (
        <Paper 
            radius={rem(10)} 
            withBorder 
            shadow="md" 
            style={{ borderColor: color }}
            mb={rem(10)}
        >
            <Group ml={rem(5)} mr={rem(8)} gap={rem(10)}>
                {icon}
                <Title order={5}>{args.name + (args.isSelf ? " (You)" : "")}</Title>
                <Text ml="auto">{args.coins} coins</Text>
            </Group>
        </Paper>
    )
}