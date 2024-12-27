from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .matching import find_best_matching_providers


app = FastAPI()

# we're opening up CORs for demo purposes as otherwise we'd have to set up a reverse proxy for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FindProviderRequest(BaseModel):
    areas_of_concern: List[str] = []
    preferred_treatment_modality: List[str] = []
    therapist_preferences: List[str] = []
    locations: List[str] = []
    payment_methods: List[str] = []
    languages: List[str] = []


class Provider(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    ethnic_identity: Optional[str] = None
    gender_identity: Optional[str] = None
    language: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    treatment_modality: Optional[str] = None
    areas_of_concern: Optional[str] = None


@app.post("/providers/search")
async def find_provider(request: FindProviderRequest) -> List[Provider]:
    try:
        return [
            Provider(
                first_name=provider["First Name"],
                last_name=provider["Last Name"],
                ethnic_identity=provider["Ethnic Identity"],
                gender_identity=provider["Gender Identity"],
                language=provider["Language"],
                location=provider["Location"],
                bio=provider["Bio"],
                treatment_modality=provider["Treatment Modality"],
                areas_of_concern=provider["Areas of Specialization"]
            )
            for _, provider
            in find_best_matching_providers(
                areas_of_concern=request.areas_of_concern,
                preferred_treatment_modality=request.preferred_treatment_modality,
                languages=request.languages,
                payment_method=request.payment_methods,
                therapist_preferences=request.therapist_preferences,
                locations=request.locations
            ).iterrows()
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An error occurred when finding a matching provider"
        ) from e
