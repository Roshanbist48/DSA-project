from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(128), nullable=False, default='')
    auth_provider = Column(String(50), nullable=False, default='local')
    provider_id = Column(String(255), nullable=True)

class Match(Base):
    __tablename__ = 'matches'

    id = Column(String(36), primary_key=True, index=True)
    team1 = Column(String(120), nullable=False)
    team2 = Column(String(120), nullable=False)
    toss_winner = Column(String(120), nullable=False)
    batting_first = Column(String(120), nullable=False)
    total_overs = Column(Integer, nullable=False)

    score_runs = Column(Integer, default=0)
    score_wickets = Column(Integer, default=0)
    score_overs = Column(Integer, default=0)
    score_balls = Column(Integer, default=0)

    first_innings_runs = Column(Integer, default=0)
    first_innings_wickets = Column(Integer, default=0)
    first_innings_overs = Column(Integer, default=0)
    first_innings_balls = Column(Integer, default=0)

    extras_wide = Column(Integer, default=0)
    extras_noball = Column(Integer, default=0)
    extras_byes = Column(Integer, default=0)
    extras_legbyes = Column(Integer, default=0)

    players = relationship('Player', back_populates='match', cascade='all, delete-orphan')

class Player(Base):
    __tablename__ = 'players'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    match_id = Column(String(36), ForeignKey('matches.id', ondelete='CASCADE'))
    name = Column(String(120), nullable=False)
    role = Column(String(50), nullable=False, default='bat')
    team = Column(String(120), nullable=False)

    batting_runs = Column(Integer, default=0)
    batting_balls = Column(Integer, default=0)
    batting_fours = Column(Integer, default=0)
    batting_sixes = Column(Integer, default=0)
    batting_dismissal = Column(String(80), default='')

    bowling_runs = Column(Integer, default=0)
    bowling_balls = Column(Integer, default=0)
    bowling_overs = Column(Integer, default=0)
    bowling_wickets = Column(Integer, default=0)
    bowling_maidens = Column(Integer, default=0)

    match = relationship('Match', back_populates='players')
