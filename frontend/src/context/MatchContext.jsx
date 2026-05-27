import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MatchContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

export const MatchProvider = ({ children }) => {
  const [matchId, setMatchId] = useState(localStorage.getItem('matchId') || null);
  const [match, setMatch] = useState(null);
  
  useEffect(() => {
    if (matchId && !match) {
        fetchMatch(matchId);
    }
  }, [matchId]);

  const fetchMatch = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/match/${id}`);
      setMatch(response.data);
    } catch (error) {
      console.error("Error fetching match data:", error);
      if (error.response?.status === 404) {
          localStorage.removeItem("matchId");
          setMatchId(null);
      }
    }
  };

  const startMatchSession = async (matchDetails) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/match/`, matchDetails);
      const newMatchId = response.data.match_id;
      setMatchId(newMatchId);
      setMatch(response.data.match);
      localStorage.setItem('matchId', newMatchId);
    } catch (error) {
      console.error("Error starting match:", error);
    }
  };

  const updateMatchState = async (updatedData) => {
    if (!matchId) return;
    try {
      const response = await axios.put(`${API_BASE_URL}/match/${matchId}`, {
        match_data: updatedData
      });
      setMatch(response.data.match);
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  return (
    <MatchContext.Provider value={{
      matchId,
      match,
      setMatch,
      startMatchSession,
      updateMatchState,
      fetchMatch
    }}>
      {children}
    </MatchContext.Provider>
  );
};
