import os
import asyncio
from openai import AsyncOpenAI
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from aiogoogle import Aiogoogle
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from aiogoogle.auth.creds import ServiceAccountCreds 
from dotenv import load_dotenv

from schema import AiPromptSchema, ScoreSchema
from sheet_handler import SheetHandler

local_dir = os.path.dirname(os.path.realpath(__file__))
try:
  load_dotenv(local_dir + "/.env.local")
except FileNotFoundError:
  pass
with open(os.path.join(local_dir, "client_secret.json"), "r") as f:
  service_account_info = eval(f.read()) # Convert JSON string to dictionary
g_acc_creds = ServiceAccountCreds(
  scopes=["https://www.googleapis.com/auth/spreadsheets"],
  **service_account_info
)   

openai = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
ai_system_prompt = {
  "type": "input_text",
  "text": """
    You are an assistant for a practice website for ACSL.
    The user needs clarification on a problem they just solved. 
    They have a specific question about the problem; answer that, and nothing else.
    The first image attached is a screenshot of the problem,
    and the second image attached is a screenshot of the solution.
  """
}

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=False,
  allow_methods=["*"],
  allow_headers=["*"]
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
async def home():
  return "Hello there."

@app.get("/points")
@limiter.limit("30/minute")
async def points(request: Request):
  try:
    async with Aiogoogle(service_account_creds=g_acc_creds) as aiogoogle:
      handler = SheetHandler(aiogoogle, await aiogoogle.discover("sheets", "v4"))
      return {
        "values": await handler.get_values("A2:N50")
      }
  except Exception as e:
    return "ERROR: " + str(e)

@app.post("/update-score")
async def update_score(schema: ScoreSchema):
  try:
    await asyncio.gather(
      update_points(schema.playerIndex, schema.points),
      update_topic_score(schema.topicIndex, schema.playerIndex, schema.points),
    )
    return { "result": "Success!" }
  except Exception as e:
    return "ERROR: " + str(e)

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

@app.post("/ai-prompt")
@limiter.limit("10/minute")
async def prompt_ai(request: Request, schema: AiPromptSchema):
  img_path = schema.problem.imageName.replace(" ", "%20")
  problem_img_url = "https://coding-for-community.github.io/acsl-practice-website/contest-problems/" + img_path
  solution_img_url = "https://coding-for-community.github.io/acsl-practice-website/contest-solutions/" + img_path
  print(problem_img_url)
  response_inputs = [
    {
      "role": "developer",
      "content": [
        ai_system_prompt,
        { 
          "type": "input_text", 
          "text": f"""
            Here is the appropriate wiki page for more info: https://www.categories.acsl.org/wiki/index.php?title={schema.problem.topic.replace(" ", "_")}
            The user's problem is in the ${schema.problem.topic} topic of ACSL.
            Correct solutions include: ${schema.problem.solutions}
          """
        }
      ]
    },
    {
      "role": "user",
      "content": [
        { "type": "input_image", "image_url": problem_img_url },
        { "type": "input_image", "image_url": solution_img_url },
      ]
    }
  ]
  for prompt in schema.messages:
    response_inputs.append({
      "role": "assistant" if prompt.isAi else "user",
      "content": [
        { 
          "type": "output_text" if prompt.isAi else "input_text", 
          "text": prompt.content 
        }
      ]
    })
  response = await openai.responses.create(
    model="gpt-4o-mini",
    input=response_inputs,
  )
  print("OUTPUT: " + response.output_text)
  return { "response": response.output_text }

if __name__ == "__main__":
  uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
