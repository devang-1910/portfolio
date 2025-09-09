from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
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
from bson import ObjectId
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI(title="Portfolio API", description="Backend API for Devang Shah's Portfolio")

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, (dict, list)):
                doc[key] = serialize_doc(value)
    return doc

# Pydantic Models
class Profile(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: str
    tagline: str
    about: str
    location: str
    github: str
    linkedin: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    tagline: Optional[str] = None
    about: Optional[str] = None
    location: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None

class Skill(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    category: str
    name: str
    level: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SkillCreate(BaseModel):
    category: str
    name: str
    level: Optional[str] = None

class ProjectLinks(BaseModel):
    repo: Optional[str] = None
    live: Optional[str] = None
    case: Optional[str] = None

class ProjectDetails(BaseModel):
    problem: str
    approach: str
    result: str
    features: List[str]

class Project(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    title: str
    summary: str
    description: str
    period: str
    stack: List[str]
    tags: List[str]
    category: str
    cover: Optional[str] = None
    links: ProjectLinks
    details: ProjectDetails
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    summary: str
    description: str
    period: str
    stack: List[str]
    tags: List[str]
    category: str
    cover: Optional[str] = None
    links: ProjectLinks
    details: ProjectDetails
    featured: bool = False

class Experience(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    company: str
    title: str
    period: str
    location: str
    achievements: List[str]
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExperienceCreate(BaseModel):
    company: str
    title: str
    period: str
    location: str
    achievements: List[str]
    order: int = 0

class Education(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    degree: str
    school: str
    period: str
    location: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EducationCreate(BaseModel):
    degree: str
    school: str
    period: str
    location: str

class Contact(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    email: str
    subject: str
    message: str
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running", "status": "healthy"}

# Import and setup API routes
from api_routes import router as api_routes_router, init_routes

# Initialize routes with dependencies
init_routes(db, serialize_doc, UPLOAD_DIR)

# Include the routers
api_router.include_router(api_routes_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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
