import { ALL_CONTEST_TOPICS, Topic } from "./Topic"

export type AllPlayersData = Record<string, PlayerData>
export interface PlayerData {
    readonly totalCoins: number,
    readonly statistics: Record<Topic, string>,
    readonly id: number
}

export async function fetchAllPlayerData(): Promise<AllPlayersData> {
    const resp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SHEET_ID}/values/Main!A1:M100?key=${import.meta.env.VITE_SHEETS_API_KEY}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    if (resp.status != 200) {
        console.error("")
        console.error(resp.text)
    }
    const json = await resp.json()
    const values: string[][] = json["values"]
    values.shift() // remove header row
    const finalData: AllPlayersData = {}
    let playerIdx = 0
    for (const row of values) {
        const playerName = row[0]
        const coins = parseInt(row[1])
        const statistics: Partial<Record<Topic, string>> = {}
        for (let i = 0; i < ALL_CONTEST_TOPICS.length; i++) {
            statistics[ALL_CONTEST_TOPICS[i]] = row[i + 2]
        }
        finalData[playerName] = {
            id: playerIdx,
            totalCoins: coins,
            statistics: statistics as Record<Topic, string> // cast is safe since we use every single enum value available
        }
        playerIdx++
    }
    console.log("final data: " + JSON.stringify(finalData))
    return finalData
}

export function allPlayers(data: AllPlayersData): string[] {
    return Object.keys(data)
}

// Uses an app script endpoint over the API due to OAuth restrictions on the API
export async function updatePoints(playerData: PlayerData, topic: Topic, correct: boolean) {
    try {
        console.log("Correct: " + correct)
        await fetch(import.meta.env.VITE_SHEET_UPDATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `playerIndex=${playerData.id}&topicIndex=${ALL_CONTEST_TOPICS.indexOf(topic)}&correct=${correct}`
        })
    } catch (err) {
        if (err instanceof TypeError) {
            console.log("Cors error might appear; doesn't matter because we don't need the response")
        } else {
            throw err
        }
    }
}