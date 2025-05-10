import { PlayerRank } from "../components/PlayerRank"
import { AllPlayersData } from "../api/api"
import { memo } from "react"
import { CustomDrawer } from "../components/CustomDrawer"

// calling memo on LeaderboardImpl ensures that it only re-computes itself
// when data from LeaderboardArgs(particularly PlayerData) changes.
// This ensures that we aren't sorting stuff every time react re-renders.
export const Leaderboard = memo(LeaderboardImpl)

export interface LeaderboardArgs {
  open: boolean
  close: () => void
  allPlayersData: AllPlayersData
  currentPlayer: string | null
}

function LeaderboardImpl(args: LeaderboardArgs) {
  return (
    <CustomDrawer opened={args.open} onClose={args.close} title="Leaderboard">
      {Object.entries(args.allPlayersData)
        .sort((a, b) => -a[1].totalCoins + b[1].totalCoins) // sorts off points in descending order
        .map(([name, data], index) => (
          <PlayerRank
            name={name}
            rank={index + 1}
            coins={data.totalCoins}
            isSelf={name === args.currentPlayer}
            key={index}
          />
        ))}
    </CustomDrawer>
  )
}
