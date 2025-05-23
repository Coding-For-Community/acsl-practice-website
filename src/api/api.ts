import { Topic } from "./types"
import { ALL_CONTEST_TOPICS } from "./constants/topicData"
import { logDebug } from "./logDebug"
import { BACKEND_URL } from "./constants/otherConstants"

export type AllPlayersData = Record<string, PlayerData>
export interface PlayerData {
  readonly totalCoins: number
  readonly statistics: Record<Topic, string>
  readonly id: number
}

export async function fetchAllPlayerData(): Promise<AllPlayersData> {
  const resp = await fetch(BACKEND_URL + "/points", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const json = await resp.json()
  const values: string[][] = json["values"]
  const finalData: AllPlayersData = {}
  let playerIdx = 0
  for (const row of values) {
    const playerName = row[0]
    const coins = row[1] == null ? 0 : parseFloat(row[1])
    const statistics: Partial<Record<Topic, string>> = {}
    for (let i = 0; i < ALL_CONTEST_TOPICS.length; i++) {
      const fraction = row[i + 2]
      if (fraction == null || fraction === "") {
        continue
      }
      statistics[ALL_CONTEST_TOPICS[i]] = fraction
    }
    finalData[playerName] = {
      id: playerIdx,
      totalCoins: coins,
      statistics: statistics as Record<Topic, string>, // cast is safe since we use every single enum value available
    }
    playerIdx++
  }
  return finalData
}

export function allPlayers(data: AllPlayersData): string[] {
  return Object.keys(data)
}

// Uses an app script endpoint over the API due to OAuth restrictions on the API
export async function updatePoints(
  playerData: PlayerData,
  topic: Topic,
  points: number,
) {
  const body = JSON.stringify({
    playerIndex: playerData.id,
    topicIndex: ALL_CONTEST_TOPICS.indexOf(topic),
    points: points,
  })
  logDebug("[updatePoints] body: " + body)
  await fetch(BACKEND_URL + "/update-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  })
}
