from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from .routes import chat

load_dotenv(dotenv_path=".env")

app = FastAPI(title="OpenAI Streaming Chatbot API")

origins = os.getenv("CORS_ORIGINS", "")
if origins:
    origins = [origin.strip() for origin in origins.split(",")]
else:
    origins = []

print(f"CORS origins allowed: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Welcome to OpenAI Streaming Chatbot API"}
