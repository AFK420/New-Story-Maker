from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Universal Story Creation Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== CHARACTER MODELS ====================

class CharacterPsychology(BaseModel):
    core_belief_self: str = ""
    core_belief_world: str = ""
    desire_vs_need: str = ""
    primary_coping_mechanism: str = ""
    emotional_blind_spot: str = ""
    trigger_points: str = ""
    emotional_armor: str = ""

class CharacterConflicts(BaseModel):
    internal_conflict: str = ""
    external_conflict: str = ""
    moral_dilemma: str = ""
    unconscious_fear: str = ""
    biggest_regret: str = ""
    source_of_shame: str = ""
    self_sabotaging_behavior: str = ""

class CharacterBackground(BaseModel):
    defining_childhood_moment: str = ""
    first_major_betrayal: str = ""
    past_love_or_loss: str = ""
    family_role_dynamic: str = ""
    education_street_smarts: str = ""
    criminal_record_secret: str = ""

class CharacterMoral(BaseModel):
    line_never_cross: str = ""
    worst_thing_done: str = ""
    justification_wrongdoing: str = ""
    villain_origin: str = ""
    self_destruction_path: str = ""

class CharacterSocial(BaseModel):
    public_vs_private_self: str = ""
    group_role: str = ""
    love_language_attachment: str = ""
    treatment_of_weak: str = ""
    jealousy_triggers: str = ""
    loyalty_level: str = ""

class CharacterQuirks(BaseModel):
    weird_habits: str = ""
    physical_tics: str = ""
    obsessions_hobbies: str = ""
    voice_speech_pattern: str = ""
    what_makes_laugh: str = ""
    what_makes_cry: str = ""

class CharacterNarrative(BaseModel):
    symbol_color_motif: str = ""
    character_arc_word: str = ""
    theme_connection: str = ""
    peak_collapse_timing: str = ""
    ending_feeling: str = ""

class Character(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: str = ""
    genre: str = ""
    role_in_story: str = ""
    
    # Physical Description
    physical_description: str = ""
    personal_symbol_object: str = ""
    
    # Core Psychology
    psychology: CharacterPsychology = Field(default_factory=CharacterPsychology)
    conflicts: CharacterConflicts = Field(default_factory=CharacterConflicts)
    background: CharacterBackground = Field(default_factory=CharacterBackground)
    moral_edges: CharacterMoral = Field(default_factory=CharacterMoral)
    social_dynamics: CharacterSocial = Field(default_factory=CharacterSocial)
    quirks: CharacterQuirks = Field(default_factory=CharacterQuirks)
    narrative: CharacterNarrative = Field(default_factory=CharacterNarrative)
    
    # Relationships
    relationships: str = ""  # Free-form relationship mapping
    
    # Story Connection
    story_id: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CharacterCreate(BaseModel):
    name: str
    age: str = ""
    genre: str = ""
    role_in_story: str = ""
    physical_description: str = ""
    personal_symbol_object: str = ""
    psychology: Optional[CharacterPsychology] = None
    conflicts: Optional[CharacterConflicts] = None
    background: Optional[CharacterBackground] = None
    moral_edges: Optional[CharacterMoral] = None
    social_dynamics: Optional[CharacterSocial] = None
    quirks: Optional[CharacterQuirks] = None
    narrative: Optional[CharacterNarrative] = None
    relationships: str = ""
    story_id: Optional[str] = None

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[str] = None
    genre: Optional[str] = None
    role_in_story: Optional[str] = None
    physical_description: Optional[str] = None
    personal_symbol_object: Optional[str] = None
    psychology: Optional[CharacterPsychology] = None
    conflicts: Optional[CharacterConflicts] = None
    background: Optional[CharacterBackground] = None
    moral_edges: Optional[CharacterMoral] = None
    social_dynamics: Optional[CharacterSocial] = None
    quirks: Optional[CharacterQuirks] = None
    narrative: Optional[CharacterNarrative] = None
    relationships: Optional[str] = None
    story_id: Optional[str] = None

# ==================== WORLD MODELS ====================

class WorldGeography(BaseModel):
    setting_type: str = ""  # urban, rural, fantasy, sci-fi, historical, etc.
    climate_weather: str = ""
    time_period: str = ""
    technology_level: str = ""
    magic_supernatural: str = ""
    physics_rules: str = ""

class WorldGovernance(BaseModel):
    political_system: str = ""
    laws_justice: str = ""
    economic_system: str = ""
    cultural_norms: str = ""
    religions_beliefs: str = ""
    festivals_rituals: str = ""
    social_hierarchies: str = ""
    languages_dialects: str = ""

class WorldConflict(BaseModel):
    major_conflict: str = ""
    faction_breakdown: str = ""
    hidden_powers: str = ""
    law_enforcement: str = ""
    weapons_combat: str = ""

class WorldCulture(BaseModel):
    view_of_death: str = ""
    view_of_time: str = ""
    honor_vs_survival: str = ""
    individual_vs_collective: str = ""
    emotion_expression: str = ""

class WorldModern(BaseModel):
    media_propaganda: str = ""
    surveillance_level: str = ""
    internet_info_access: str = ""
    popular_culture: str = ""

class WorldThemes(BaseModel):
    emotional_vibe: str = ""
    symbolic_motifs: str = ""
    historical_trauma: str = ""
    truth_power_holders: str = ""

class WorldDetails(BaseModel):
    architecture: str = ""
    fashion_trends: str = ""
    transportation: str = ""
    food_culture: str = ""
    street_sounds_smells: str = ""

class World(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    genre: str = ""
    world_type: str = ""  # realistic, fantasy, sci-fi, historical, etc.
    
    geography: WorldGeography = Field(default_factory=WorldGeography)
    governance: WorldGovernance = Field(default_factory=WorldGovernance)
    conflict: WorldConflict = Field(default_factory=WorldConflict)
    culture: WorldCulture = Field(default_factory=WorldCulture)
    modern_aspects: WorldModern = Field(default_factory=WorldModern)
    themes: WorldThemes = Field(default_factory=WorldThemes)
    details: WorldDetails = Field(default_factory=WorldDetails)
    
    # Story Connection
    story_id: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class WorldCreate(BaseModel):
    name: str
    genre: str = ""
    world_type: str = ""
    geography: Optional[WorldGeography] = None
    governance: Optional[WorldGovernance] = None
    conflict: Optional[WorldConflict] = None
    culture: Optional[WorldCulture] = None
    modern_aspects: Optional[WorldModern] = None
    themes: Optional[WorldThemes] = None
    details: Optional[WorldDetails] = None
    story_id: Optional[str] = None

class WorldUpdate(BaseModel):
    name: Optional[str] = None
    genre: Optional[str] = None
    world_type: Optional[str] = None
    geography: Optional[WorldGeography] = None
    governance: Optional[WorldGovernance] = None
    conflict: Optional[WorldConflict] = None
    culture: Optional[WorldCulture] = None
    modern_aspects: Optional[WorldModern] = None
    themes: Optional[WorldThemes] = None
    details: Optional[WorldDetails] = None
    story_id: Optional[str] = None

# ==================== STORY MODELS ====================

class StoryStructure(BaseModel):
    genre: str = ""  # Free-form genre description
    theme: str = ""
    tone: str = ""
    setting_overview: str = ""
    target_audience: str = ""
    
class StoryPlot(BaseModel):
    premise: str = ""
    inciting_incident: str = ""
    plot_points: str = ""  # Key story beats
    climax: str = ""
    resolution: str = ""
    
class Story(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    author: str = ""
    
    structure: StoryStructure = Field(default_factory=StoryStructure)
    plot: StoryPlot = Field(default_factory=StoryPlot)
    
    # Synopsis and Development
    synopsis: str = ""
    notes: str = ""
    
    # Connected Elements
    character_ids: List[str] = []
    world_id: Optional[str] = None
    
    # Status
    status: str = "planning"  # planning, writing, draft, complete
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StoryCreate(BaseModel):
    title: str
    author: str = ""
    structure: Optional[StoryStructure] = None
    plot: Optional[StoryPlot] = None
    synopsis: str = ""
    notes: str = ""
    character_ids: List[str] = []
    world_id: Optional[str] = None
    status: str = "planning"

class StoryUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    structure: Optional[StoryStructure] = None
    plot: Optional[StoryPlot] = None
    synopsis: Optional[str] = None
    notes: Optional[str] = None
    character_ids: Optional[List[str]] = None
    world_id: Optional[str] = None
    status: Optional[str] = None

# ==================== API ROUTES ====================

# Health Check
@api_router.get("/")
async def root():
    return {"message": "Universal Story Creation Platform API", "version": "1.0"}

# ==================== CHARACTER ROUTES ====================

@api_router.post("/characters", response_model=Character)
async def create_character(character_data: CharacterCreate):
    character_dict = character_data.dict()
    character = Character(**character_dict)
    result = await db.characters.insert_one(character.dict())
    if result.inserted_id:
        return character
    raise HTTPException(status_code=500, detail="Failed to create character")

@api_router.get("/characters", response_model=List[Character])
async def get_characters(story_id: Optional[str] = None):
    query = {}
    if story_id:
        query["story_id"] = story_id
    
    characters = await db.characters.find(query).to_list(1000)
    return [Character(**character) for character in characters]

@api_router.get("/characters/{character_id}", response_model=Character)
async def get_character(character_id: str):
    character = await db.characters.find_one({"id": character_id})
    if character:
        return Character(**character)
    raise HTTPException(status_code=404, detail="Character not found")

@api_router.put("/characters/{character_id}", response_model=Character)
async def update_character(character_id: str, update_data: CharacterUpdate):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await db.characters.update_one(
        {"id": character_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 1:
        updated_character = await db.characters.find_one({"id": character_id})
        return Character(**updated_character)
    raise HTTPException(status_code=404, detail="Character not found")

@api_router.delete("/characters/{character_id}")
async def delete_character(character_id: str):
    result = await db.characters.delete_one({"id": character_id})
    if result.deleted_count == 1:
        return {"message": "Character deleted successfully"}
    raise HTTPException(status_code=404, detail="Character not found")

# ==================== WORLD ROUTES ====================

@api_router.post("/worlds", response_model=World)
async def create_world(world_data: WorldCreate):
    world_dict = world_data.dict()
    world = World(**world_dict)
    result = await db.worlds.insert_one(world.dict())
    if result.inserted_id:
        return world
    raise HTTPException(status_code=500, detail="Failed to create world")

@api_router.get("/worlds", response_model=List[World])
async def get_worlds(story_id: Optional[str] = None):
    query = {}
    if story_id:
        query["story_id"] = story_id
    
    worlds = await db.worlds.find(query).to_list(1000)
    return [World(**world) for world in worlds]

@api_router.get("/worlds/{world_id}", response_model=World)
async def get_world(world_id: str):
    world = await db.worlds.find_one({"id": world_id})
    if world:
        return World(**world)
    raise HTTPException(status_code=404, detail="World not found")

@api_router.put("/worlds/{world_id}", response_model=World)
async def update_world(world_id: str, update_data: WorldUpdate):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await db.worlds.update_one(
        {"id": world_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 1:
        updated_world = await db.worlds.find_one({"id": world_id})
        return World(**updated_world)
    raise HTTPException(status_code=404, detail="World not found")

@api_router.delete("/worlds/{world_id}")
async def delete_world(world_id: str):
    result = await db.worlds.delete_one({"id": world_id})
    if result.deleted_count == 1:
        return {"message": "World deleted successfully"}
    raise HTTPException(status_code=404, detail="World not found")

# ==================== STORY ROUTES ====================

@api_router.post("/stories", response_model=Story)
async def create_story(story_data: StoryCreate):
    story_dict = story_data.dict()
    story = Story(**story_dict)
    result = await db.stories.insert_one(story.dict())
    if result.inserted_id:
        return story
    raise HTTPException(status_code=500, detail="Failed to create story")

@api_router.get("/stories", response_model=List[Story])
async def get_stories():
    stories = await db.stories.find().to_list(1000)
    return [Story(**story) for story in stories]

@api_router.get("/stories/{story_id}", response_model=Story)
async def get_story(story_id: str):
    story = await db.stories.find_one({"id": story_id})
    if story:
        return Story(**story)
    raise HTTPException(status_code=404, detail="Story not found")

@api_router.put("/stories/{story_id}", response_model=Story)
async def update_story(story_id: str, update_data: StoryUpdate):
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await db.stories.update_one(
        {"id": story_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 1:
        updated_story = await db.stories.find_one({"id": story_id})
        return Story(**updated_story)
    raise HTTPException(status_code=404, detail="Story not found")

@api_router.delete("/stories/{story_id}")
async def delete_story(story_id: str):
    result = await db.stories.delete_one({"id": story_id})
    if result.deleted_count == 1:
        return {"message": "Story deleted successfully"}
    raise HTTPException(status_code=404, detail="Story not found")

# ==================== STORY WITH DETAILS ROUTES ====================

@api_router.get("/stories/{story_id}/full", response_model=Dict[str, Any])
async def get_story_with_details(story_id: str):
    # Get story
    story = await db.stories.find_one({"id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # Get characters
    characters = await db.characters.find({"story_id": story_id}).to_list(1000)
    
    # Get world
    world = None
    if story.get("world_id"):
        world = await db.worlds.find_one({"id": story["world_id"]})
    
    return {
        "story": Story(**story),
        "characters": [Character(**char) for char in characters],
        "world": World(**world) if world else None
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()