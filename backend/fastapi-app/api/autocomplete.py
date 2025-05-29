from fastapi import APIRouter
from pydantic import BaseModel
from services.autocomplete_service import generate_autocomplete

router = APIRouter()

class AutoCompleteRequest(BaseModel):
    text: str

@router.post("/")
async def autocomplete(request: AutoCompleteRequest):
    print("autocomplete 진입")
    result = generate_autocomplete(request.text)
    print(result)
    return {"suggestion": result}
