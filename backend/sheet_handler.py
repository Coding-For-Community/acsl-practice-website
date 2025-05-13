import os
from aiogoogle import Aiogoogle

class SheetHandler:
  def __init__(self, aiogoogle: Aiogoogle, sheets_api, sheet_name: str = "Main"):
    self.aiogoogle = aiogoogle
    self.sheets_api = sheets_api
    self.sheet_name = sheet_name

  async def get_values(self, range: str) -> list[list[str]]:
    response = await self.aiogoogle.as_service_account(
      self.sheets_api.spreadsheets.values.get(
        spreadsheetId=os.environ["SHEET_ID"],
        range=self.sheet_name + "!" + range
      )
    )
    return response["values"]

  async def get_value(self, target: str) -> str:
    return (await self.get_values(target + ":" + target))[0][0]

  async def set_value(self, target: str, value: any):
    range = self.sheet_name + "!" + target + ":" + target
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