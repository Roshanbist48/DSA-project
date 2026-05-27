from typing import List, Optional, Literal
from pydantic import BaseModel

class PlayerStats(BaseModel):
    runs: int
    balls: int
    fours: int
    sixes: int
    dismissal: str

class PlayerBowlingStats(BaseModel):
    runs: int
    balls: int
    overs: int
    wickets: int
    maidens: int

class PlayerCreate(BaseModel):
    name: str
    role: str
    team: str
    battingStats: PlayerStats
    bowlingStats: PlayerBowlingStats

class MatchStartRequest(BaseModel):
    team1: str
    team2: str
    tossWinner: str
    battingFirst: str
    overs: int

class MatchState(BaseModel):
    team1: str
    team2: str
    tossWinner: str
    battingFirst: str
    totalOvers: int
    score: dict
    extras: dict
    firstInningsScore: dict
    players: List[PlayerCreate]

class MatchUpdateRequest(BaseModel):
    match_data: MatchState

class AuthRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str
    provider: Literal['local', 'facebook', 'google', 'discord'] = 'local'
    provider_id: Optional[str] = None

class SocialAuthRequest(BaseModel):
    provider: Literal['facebook', 'google', 'discord']
    provider_id: str
    email: Optional[str] = None
