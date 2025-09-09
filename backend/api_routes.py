# API Routes for Portfolio Backend

from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional
import os
import shutil
from pathlib import Path
import uuid
from datetime import datetime

router = APIRouter()

# Will be imported from server.py at runtime
db = None
serialize_doc = None
UPLOAD_DIR = None

def init_routes(database, serializer, upload_dir):
    global db, serialize_doc, UPLOAD_DIR
    db = database
    serialize_doc = serializer
    UPLOAD_DIR = upload_dir

# Profile Endpoints
@router.get("/profile")
async def get_profile():
    """Get user profile information"""
    try:
        profile = await db.profiles.find_one()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return serialize_doc(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/profile")
async def update_profile(profile_update: dict):
    """Update user profile information"""
    try:
        # Get existing profile
        existing_profile = await db.profiles.find_one()
        if not existing_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Update only provided fields
        update_data = {k: v for k, v in profile_update.items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.profiles.update_one(
            {"_id": existing_profile["_id"]}, 
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Update failed")
        
        updated_profile = await db.profiles.find_one({"_id": existing_profile["_id"]})
        return serialize_doc(updated_profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Skills Endpoints
@router.get("/skills")
async def get_skills():
    """Get all skills grouped by category"""
    try:
        skills = await db.skills.find().to_list(1000)
        skills_by_category = {}
        
        for skill in skills:
            category = skill["category"]
            if category not in skills_by_category:
                skills_by_category[category] = []
            skills_by_category[category].append(skill["name"])
        
        return skills_by_category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/skills")
async def create_skill(skill: dict):
    """Add a new skill"""
    try:
        skill["created_at"] = datetime.utcnow()
        result = await db.skills.insert_one(skill)
        created_skill = await db.skills.find_one({"_id": result.inserted_id})
        return serialize_doc(created_skill)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/skills/{skill_id}")
async def delete_skill(skill_id: str):
    """Delete a skill"""
    try:
        if not ObjectId.is_valid(skill_id):
            raise HTTPException(status_code=400, detail="Invalid skill ID")
        
        result = await db.skills.delete_one({"_id": ObjectId(skill_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        return {"message": "Skill deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Projects Endpoints
@router.get("/projects")
async def get_projects(
    featured: Optional[bool] = None,
    category: Optional[str] = None,
    limit: Optional[int] = None
):
    """Get projects with optional filtering"""
    try:
        query = {}
        if featured is not None:
            query["featured"] = featured
        if category and category != "All":
            query["category"] = category
        
        cursor = db.projects.find(query).sort("created_at", -1)
        if limit:
            cursor = cursor.limit(limit)
        
        projects = await cursor.to_list(1000)
        return [serialize_doc(project) for project in projects]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get a single project by ID"""
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID")
        
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return serialize_doc(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/projects")
async def create_project(project: dict):
    """Create a new project"""
    try:
        project["created_at"] = datetime.utcnow()
        project["updated_at"] = datetime.utcnow()
        result = await db.projects.insert_one(project)
        created_project = await db.projects.find_one({"_id": result.inserted_id})
        return serialize_doc(created_project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Experience Endpoints
@router.get("/experience")
async def get_experience():
    """Get all experience entries"""
    try:
        experiences = await db.experience.find().sort("order", -1).to_list(1000)
        return [serialize_doc(exp) for exp in experiences]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/experience")
async def create_experience(experience: dict):
    """Add new experience"""
    try:
        experience["created_at"] = datetime.utcnow()
        result = await db.experience.insert_one(experience)
        created_exp = await db.experience.find_one({"_id": result.inserted_id})
        return serialize_doc(created_exp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Education Endpoints
@router.get("/education")
async def get_education():
    """Get all education entries"""
    try:
        # Sort by created_at descending (newest first), with fallback to _id if created_at is missing
        educations = await db.education.find().sort([
            ("created_at", -1),
            ("_id", -1)  # Fallback sorting by _id for entries without created_at
        ]).to_list(1000)
        return [serialize_doc(edu) for edu in educations]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/education")
async def create_education(education: dict):
    """Add new education"""
    try:
        education["created_at"] = datetime.utcnow()
        result = await db.education.insert_one(education)
        created_edu = await db.education.find_one({"_id": result.inserted_id})
        return serialize_doc(created_edu)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Research Papers Endpoints
@router.get("/papers")
async def get_papers():
    """Get all research papers"""
    try:
        papers = await db.papers.find().sort("created_at", -1).to_list(1000)
        return [serialize_doc(paper) for paper in papers]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/papers")
async def create_paper(paper: dict):
    """Add new research paper"""
    try:
        paper["created_at"] = datetime.utcnow()
        result = await db.papers.insert_one(paper)
        created_paper = await db.papers.find_one({"_id": result.inserted_id})
        return serialize_doc(created_paper)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Contact Endpoints
@router.post("/contact")
async def submit_contact(contact: dict):
    """Submit contact form"""
    try:
        contact["status"] = "new"
        contact["created_at"] = datetime.utcnow()
        
        result = await db.contacts.insert_one(contact)
        created_contact = await db.contacts.find_one({"_id": result.inserted_id})
        
        # Send email notifications
        try:
            from email_service import email_service
            
            # Send notification to Devang
            notification_sent = await email_service.send_contact_notification(contact)
            
            # Send auto-reply to sender
            auto_reply_sent = await email_service.send_auto_reply(contact)
            
            print(f"📧 Email notifications - Notification: {notification_sent}, Auto-reply: {auto_reply_sent}")
            
        except Exception as email_error:
            print(f"⚠️ Email sending failed but form saved: {str(email_error)}")
            # Don't fail the whole request if email fails
        
        return serialize_doc(created_contact)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contact/messages")
async def get_contact_messages():
    """Get all contact messages (admin endpoint)"""
    try:
        messages = await db.contacts.find().sort("created_at", -1).to_list(1000)
        return [serialize_doc(msg) for msg in messages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# File Upload Endpoint
@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file"""
    try:
        # Validate file type
        allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return file URL
        file_url = f"/uploads/{unique_filename}"
        return {"url": file_url, "filename": unique_filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))