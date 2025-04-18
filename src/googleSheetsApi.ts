export interface GoogleSheetsData {
    allPlayers: string[]
    pointValues: number[]
}

export async function getGoogleSheetsData(): Promise<GoogleSheetsData> {
    const resp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.VITE_SPREADSHEET_ID}/values/Sheet1!A1:B300?key=${import.meta.env.VITE_SHEETS_API_KEY}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
    if (resp.status != 200) {
        console.log(resp.text)
    }
    const json = await resp.json()
    let values: string[][] = json["values"]
    // transposes the array
    values = values[0].map((_, colIndex) => values.map(row => row[colIndex]))
    console.log(values)
    return {
        allPlayers: values[0].slice(1),
        pointValues: values[1].slice(1).map((str: string) => parseInt(str))
    }
}

export function getPointsOfPlayer(player: string, data: GoogleSheetsData): number | null {
    const idx = data.allPlayers.indexOf(player)
    if (idx === -1) {
        console.error("Unknown player.")
        return null
    }
    return data.pointValues[idx]
}

export async function addPointsToPlayer(player: string, points: number, data: GoogleSheetsData) {
    const idx = data.allPlayers.indexOf(player)
    if (idx === -1) {
        console.error("Unknown player.")
    }
    data.pointValues[idx] += points
    const result: any[] = []
    for (let pointValue of data.pointValues) {
        result.push([pointValue])
    }
    const resp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${import.meta.env.SPREADSHEET_ID}/values/Sheet1!B1:B300?` +
        `key=${import.meta.env.GOOGLE_API_KEY}&valueInputOption=RAW`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                range: `Sheet1!B1:B300`,
                majorDimension: "ROWS",
                values: result
            })
        }
    )
    if (resp.status != 200) {
        console.error("invalid response for adding points: " + resp.status)
    }
}