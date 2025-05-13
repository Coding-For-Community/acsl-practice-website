from pydantic import BaseModel

class ScoreSchema(BaseModel):
  playerIndex: int
  topicIndex: int
  points: float

class Problem(BaseModel):
  imageName: str
  solutions: list[str]
  topic: str
  division: str

class Message(BaseModel):
  isAi: bool
  content: str

class AiPromptSchema(BaseModel):
  messages: list[Message]
  userAnswer: str
  problem: Problem