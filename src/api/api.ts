import { Topic } from "./types"
import { ALL_CONTEST_TOPICS } from "./constants/topicSchema"
import { logDebug } from "./logDebug"

export type AllPlayersData = Record<string, PlayerData>
export interface PlayerData {
  readonly totalCoins: number
  readonly statistics: Record<Topic, string>
  readonly id: number
}

export async function fetchAllPlayerData(): Promise<AllPlayersData> {
  const resp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SHEET_ID}/values/Main!A1:N100?key=${import.meta.env.VITE_SHEETS_API_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  if (resp.status != 200) {
    console.error(resp.text)
  }
  const json = await resp.json()
  const values: string[][] = json["values"]
  values.shift() // remove header row
  const finalData: AllPlayersData = {}
  let playerIdx = 0
  for (const row of values) {
    const playerName = row[0]
    const coins = row[1] == null ? 0 : parseFloat(row[1])
    const statistics: Partial<Record<Topic, string>> = {}
    for (let i = 0; i < ALL_CONTEST_TOPICS.length; i++) {
      statistics[ALL_CONTEST_TOPICS[i]] = row[i + 2]
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
  const body = `playerIndex=${playerData.id}&topicIndex=${ALL_CONTEST_TOPICS.indexOf(topic)}&points=${points}`
  logDebug("[updatePoints] body: " + body)
  await fetch(import.meta.env.VITE_SHEET_UPDATE_URL, {
    mode: "no-cors",
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  })
}
