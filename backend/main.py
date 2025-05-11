# Note to self: make sure to set the SHEET_ID variable by
# cd backend
# npx vercel env add SHEET_ID 

from contextlib import asynccontextmanager
import os
import asyncio
from fastapi.responses import JSONResponse
import uvicorn
import nest_asyncio
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
# from google-auth package
from google.oauth2.service_account import Credentials 
from pydantic import BaseModel
from gspread_asyncio import AsyncioGspreadClientManager, AsyncioGspreadWorksheet
from dotenv import load_dotenv

nest_asyncio.apply()
local_dir = os.path.dirname(os.path.realpath(__file__))
loop = asyncio.get_event_loop()

try:
  load_dotenv(local_dir + "/.env.local")
except FileNotFoundError:
  pass

def get_creds():
  creds = Credentials.from_service_account_file(local_dir + "/client_secret.json")
  scoped = creds.with_scopes(["https://www.googleapis.com/auth/spreadsheets"])
  return scoped

async def get_worksheet():
  agc = await sheets_manager.authorize()
  spreadsheet = await agc.open_by_key(os.environ["SHEET_ID"])
  worksheet = await spreadsheet.get_worksheet(0)
  return worksheet

class ScoreSchema(BaseModel):
  playerIndex: int
  topicIndex: int
  points: float
  

@asynccontextmanager
async def lifespan(app: FastAPI):
  global loop
  global sheets_manager
  if loop.is_closed():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
  yield

app = FastAPI(lifespan=lifespan)
sheets_manager = AsyncioGspreadClientManager(get_creds)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.get("/")
async def home(request: Request):
  return "Hello there. I have been updated"

@app.get("/points")
async def points_data():
  worksheet = await get_worksheet()
  return {
    "values": await worksheet.get("A1:N100")
  }

@app.get("/update-score-test/{playerIndex}")
async def update_score_test(playerIndex: int):
  await update_score(ScoreSchema(
    playerIndex=playerIndex,
    topicIndex=0,
    points=1
  ))

@app.post("/update-score")
async def update_score(schema: ScoreSchema):
  worksheet = await get_worksheet()
  await asyncio.gather(
    update_points(worksheet, schema),
    update_topic_score(worksheet, schema)
  )
  return { "result": "Success!" }

async def update_points(worksheet: AsyncioGspreadWorksheet, schema: ScoreSchema):
  if schema.points > 0.01:
    points = (await worksheet.cell(schema.playerIndex + 2, 2)).value
    points = float(points) + schema.points
    await worksheet.update_cell(schema.playerIndex + 2, 2, points)

async def update_topic_score(worksheet: AsyncioGspreadWorksheet, schema: ScoreSchema):
  increment = 1 if schema.points > 0.9 else 0
  topic_score: str = (await worksheet.cell(schema.playerIndex + 2, schema.topicIndex + 3)).value
  if topic_score is None:
    topic_score = f"{increment}/1" 
  else:
    slash_idx = topic_score.find("/")
    total_correct = int(topic_score[:slash_idx]) + increment
    total_attempts = int(topic_score[slash_idx + 1:]) + 1
    topic_score = f"{total_correct}/{total_attempts}"
  await worksheet.update_cell(schema.playerIndex + 2, schema.topicIndex + 3, topic_score)

if __name__ == "__main__":
  uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
