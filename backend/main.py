import hashlib
import os
import sys
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Ensure repository root is on sys.path when running from backend/ directly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.database import SessionLocal, engine
from backend.models import Base, Match, Player, User
from backend.schemas import (
    AuthRequest,
    MatchStartRequest,
    MatchUpdateRequest,
    SignupRequest,
    SocialAuthRequest,
)

app = FastAPI(title='Cricket Score API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

Base.metadata.create_all(bind=engine)

FRONTEND_DIST = Path(__file__).resolve().parent.parent / 'frontend' / 'dist'

def player_to_dict(player: Player) -> dict:
    return {
        'name': player.name,
        'role': player.role,
        'team': player.team,
        'battingStats': {
            'runs': player.batting_runs,
            'balls': player.batting_balls,
            'fours': player.batting_fours,
            'sixes': player.batting_sixes,
            'dismissal': player.batting_dismissal,
        },
        'bowlingStats': {
            'runs': player.bowling_runs,
            'balls': player.bowling_balls,
            'overs': player.bowling_overs,
            'wickets': player.bowling_wickets,
            'maidens': player.bowling_maidens,
        },
    }

def match_to_dict(match: Match) -> dict:
    return {
        'id': match.id,
        'team1': match.team1,
        'team2': match.team2,
        'tossWinner': match.toss_winner,
        'battingFirst': match.batting_first,
        'totalOvers': match.total_overs,
        'score': {
            'runs': match.score_runs,
            'wickets': match.score_wickets,
            'overs': match.score_overs,
            'balls': match.score_balls,
        },
        'extras': {
            'wide': match.extras_wide,
            'noBall': match.extras_noball,
            'byes': match.extras_byes,
            'legByes': match.extras_legbyes,
        },
        'firstInningsScore': {
            'runs': match.first_innings_runs,
            'wickets': match.first_innings_wickets,
            'overs': match.first_innings_overs,
            'balls': match.first_innings_balls,
        },
        'team1Players': [player_to_dict(p) for p in match.players if p.team == match.team1],
        'team2Players': [player_to_dict(p) for p in match.players if p.team == match.team2],
        'players': [player_to_dict(p) for p in match.players],
    }

@app.post('/match/')
def start_match(req: MatchStartRequest):
    session = SessionLocal()
    try:
        match_id = str(uuid.uuid4())
        match = Match(
            id=match_id,
            team1=req.team1,
            team2=req.team2,
            toss_winner=req.tossWinner,
            batting_first=req.battingFirst,
            total_overs=req.overs,
        )
        session.add(match)
        session.commit()
        session.refresh(match)
        return {
            'message': 'Match started',
            'match_id': match_id,
            'match': match_to_dict(match),
        }
    finally:
        session.close()

@app.get('/match/{match_id}')
def get_match(match_id: str):
    session = SessionLocal()
    try:
        match = session.query(Match).filter(Match.id == match_id).first()
        if not match:
            raise HTTPException(status_code=404, detail='Match not found')
        return match_to_dict(match)
    finally:
        session.close()

@app.put('/match/{match_id}')
def update_match(match_id: str, req: MatchUpdateRequest):
    session = SessionLocal()
    try:
        match = session.query(Match).filter(Match.id == match_id).first()
        if not match:
            raise HTTPException(status_code=404, detail='Match not found')

        data = req.match_data
        match.team1 = data.team1
        match.team2 = data.team2
        match.toss_winner = data.tossWinner
        match.batting_first = data.battingFirst
        match.total_overs = data.totalOvers

        match.score_runs = data.score.get('runs', 0)
        match.score_wickets = data.score.get('wickets', 0)
        match.score_overs = data.score.get('overs', 0)
        match.score_balls = data.score.get('balls', 0)

        match.first_innings_runs = data.firstInningsScore.get('runs', 0)
        match.first_innings_wickets = data.firstInningsScore.get('wickets', 0)
        match.first_innings_overs = data.firstInningsScore.get('overs', 0)
        match.first_innings_balls = data.firstInningsScore.get('balls', 0)

        match.extras_wide = data.extras.get('wide', 0)
        match.extras_noball = data.extras.get('noBall', 0)
        match.extras_byes = data.extras.get('byes', 0)
        match.extras_legbyes = data.extras.get('legByes', 0)

        session.query(Player).filter(Player.match_id == match_id).delete()
        for player_data in data.players:
            player = Player(
                match_id=match_id,
                name=player_data.name,
                role=player_data.role,
                team=player_data.team,
                batting_runs=player_data.battingStats.runs,
                batting_balls=player_data.battingStats.balls,
                batting_fours=player_data.battingStats.fours,
                batting_sixes=player_data.battingStats.sixes,
                batting_dismissal=player_data.battingStats.dismissal,
                bowling_runs=player_data.bowlingStats.runs,
                bowling_balls=player_data.bowlingStats.balls,
                bowling_overs=player_data.bowlingStats.overs,
                bowling_wickets=player_data.bowlingStats.wickets,
                bowling_maidens=player_data.bowlingStats.maidens,
            )
            session.add(player)

        session.commit()
        session.refresh(match)
        return {'message': 'Match updated successfully', 'match': match_to_dict(match)}
    finally:
        session.close()

@app.delete('/match/{match_id}')
def end_match(match_id: str):
    session = SessionLocal()
    try:
        match = session.query(Match).filter(Match.id == match_id).first()
        if not match:
            raise HTTPException(status_code=404, detail='Match not found')
        session.delete(match)
        session.commit()
        return {'message': 'Match removed'}
    finally:
        session.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

@app.post('/auth/signup')
def signup(req: SignupRequest):
    session = SessionLocal()
    try:
        username = req.username.strip().lower()
        if not username:
            raise HTTPException(status_code=400, detail='Username is required')
        if req.provider not in {'local', 'facebook', 'google', 'discord'}:
            raise HTTPException(status_code=400, detail='Unsupported provider')

        existing_user = session.query(User).filter(User.username == username).first()
        if existing_user:
            raise HTTPException(status_code=409, detail='Username already exists')

        password_hash = hash_password(req.password) if req.provider == 'local' else ''
        user = User(
            username=username,
            password_hash=password_hash,
            auth_provider=req.provider,
            provider_id=req.provider_id,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return {'message': 'Signup successful', 'username': user.username, 'provider': user.auth_provider}
    finally:
        session.close()

@app.post('/auth/login')
def login(req: AuthRequest):
    session = SessionLocal()
    try:
        username = req.username.strip().lower()
        user = session.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail='Invalid username or password')
        if user.auth_provider != 'local':
            raise HTTPException(status_code=400, detail=f'Use {user.auth_provider} sign in')
        if user.password_hash != hash_password(req.password):
            raise HTTPException(status_code=401, detail='Invalid username or password')
        return {'message': 'Login successful', 'username': user.username}
    finally:
        session.close()

@app.post('/auth/social')
def social_auth(req: SocialAuthRequest):
    session = SessionLocal()
    try:
        provider = req.provider.lower()
        if provider not in {'facebook', 'google', 'discord'}:
            raise HTTPException(status_code=400, detail='Unsupported social provider')
        user = session.query(User).filter(User.auth_provider == provider, User.provider_id == req.provider_id).first()
        if not user:
            user = User(
                username=(req.email or f'{provider}_user').strip().lower(),
                password_hash='',
                auth_provider=provider,
                provider_id=req.provider_id,
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        return {
            'message': 'Social login successful',
            'username': user.username,
            'provider': user.auth_provider,
        }
    finally:
        session.close()

@app.get('/')
def serve_root():
    index_path = FRONTEND_DIST / 'index.html'
    if not index_path.exists():
        raise HTTPException(status_code=404, detail='Frontend build not found')
    return FileResponse(index_path)

@app.get('/{full_path:path}')
def serve_frontend(full_path: str):
    target_file = FRONTEND_DIST / full_path
    if target_file.exists() and target_file.is_file():
        return FileResponse(target_file)
    index_path = FRONTEND_DIST / 'index.html'
    if not index_path.exists():
        raise HTTPException(status_code=404, detail='Frontend build not found')
    return FileResponse(index_path)
