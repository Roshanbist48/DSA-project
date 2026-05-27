import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MatchProvider } from './context/MatchContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import ScoreSettings from './pages/ScoreSettings';
import PlayingXI from './pages/PlayingXI';
import ScoreSheet from './pages/ScoreSheet';
import Summary from './pages/Summary';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MatchProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/score" element={<ScoreSettings />} />
            <Route path="/playing11" element={<PlayingXI />} />
            <Route path="/sheet" element={<ScoreSheet />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </MatchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
