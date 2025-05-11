# Note to self: make sure to set the SHEET_ID variable by
# cd backend
# npx vercel env add SHEET_ID 
import os
import asyncio
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# from google-auth package
from aiogoogle import Aiogoogle
from aiogoogle.auth.creds import ServiceAccountCreds 
from pydantic import BaseModel
from dotenv import load_dotenv

class ScoreSchema(BaseModel):
  playerIndex: int
  topicIndex: int
  points: float

class SheetHandler:
  def __init__(self, aiogoogle: Aiogoogle, sheets_api):
    self.aiogoogle = aiogoogle
    self.sheets_api = sheets_api

  async def get_values(self, range: str, sheet: str = "Main") -> list[list[str]]:
    response = await self.aiogoogle.as_service_account(
      self.sheets_api.spreadsheets.values.get(
        spreadsheetId=os.environ["SHEET_ID"],
        range=sheet + "!" + range
      )
    )
    return response["values"]

  async def get_value(self, target: str, sheet: str = "Main"):
    return (await self.get_values(target + ":" + target, sheet))[0][0]

  async def set_value(self, target: str, value: any, sheet: str = "Main"):
    range = sheet + "!" + target + ":" + target
    body = { 
      "values": [[str(value)]] 
    }
    await self.aiogoogle.as_service_account(
      self.sheets_api.spreadsheets.values.update(
        spreadsheetId=os.environ["SHEET_ID"],
        range=range,
        valueInputOption="USER_ENTERED",
        json=body
      )
    )

async def update_points(player_idx: int, new_points: float):
  if new_points > 0.01:
    identifier = f"R{player_idx + 2}C2"
    async with Aiogoogle(service_account_creds=g_acc_creds) as aiogoogle:
      handler = SheetHandler(aiogoogle, await aiogoogle.discover("sheets", "v4"))
      points = await handler.get_value(identifier)
      points = float(points) + new_points
      await handler.set_value(identifier, points)

async def update_topic_score(topic_idx: int, player_idx: int, new_points: float):
  increment = 1 if new_points > 0.9 else 0
  identifier = f"R{player_idx + 2}C{topic_idx + 3}"
  async with Aiogoogle(service_account_creds=g_acc_creds) as aiogoogle:
    handler = SheetHandler(aiogoogle, await aiogoogle.discover("sheets", "v4"))
    topic_score: str = await handler.get_value(identifier)
    if topic_score is None:
      topic_score = f"{increment}/1" 
    else:
      slash_idx = topic_score.find("/")
      total_correct = int(topic_score[:slash_idx]) + increment
      total_attempts = int(topic_score[slash_idx + 1:]) + 1
      topic_score = f"{total_correct}/{total_attempts}"
    await handler.set_value(identifier, topic_score)


local_dir = os.path.dirname(os.path.realpath(__file__))
try:
  load_dotenv(local_dir + "/.env.local")
except FileNotFoundError:
  pass
# Load credentials from service account JSON
with open(os.path.join(local_dir, "client_secret.json"), "r") as f:
  service_account_info = eval(f.read()) # Convert JSON string to dictionary
# Define service account credentials
g_acc_creds = ServiceAccountCreds(
  scopes=["https://www.googleapis.com/auth/spreadsheets"],
  **service_account_info
)   

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=False,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get("/")
async def home(request: Request):
  return "Hello there. I have been updated"

@app.get("/points")
async def points():
  try:
    async with Aiogoogle(service_account_creds=g_acc_creds) as aiogoogle:
      handler = SheetHandler(aiogoogle, await aiogoogle.discover("sheets", "v4"))
      return {
        "values": await handler.get_values("A1:N50")
      }
  except Exception as e:
    return "ERROR: " + str(e)

@app.get("/update-score-test/{playerIndex}")
async def update_score_test(playerIndex: int):
  return await update_score(
    ScoreSchema(
      playerIndex=playerIndex,
      topicIndex=0,
      points=1.0
    )
  )

@app.post("/update-score")
async def update_score(schema: ScoreSchema):
  try:
    await asyncio.gather(
      update_points(schema.playerIndex, schema.points),
      update_topic_score(schema.topicIndex, schema.playerIndex, schema.points)
    )
    return { "result": "Success!" }
  except Exception as e:
    return "ERROR: " + str(e)

if __name__ == "__main__":
  uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
