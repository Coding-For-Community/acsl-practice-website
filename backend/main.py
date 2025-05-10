from fastapi import FastAPI
from openai import AsyncOpenAI
import uvicorn

app = FastAPI()
openai = AsyncOpenAI()

@app.get("/")
async def home():
  return "Hello there."

if __name__ == "__main__":
  uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)



