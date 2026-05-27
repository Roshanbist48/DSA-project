import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, signup, socialLogin } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      await login(username, password);
      alert('Login successful!');
      setShowLogin(false);
      navigate('/score');
    } catch (error) {
      const message = error?.response?.data?.detail || error.message || 'Login failed';
      alert(message);
    }
  };

  const handleSignup = async () => {
    if (!username.trim() || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      await signup(username, password);
      alert('Signup successful! Please log in.');
      setShowSignup(false);
      setShowLogin(true);
    } catch (error) {
      const message = error?.response?.data?.detail || error.message || 'Signup failed';
      alert(message);
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      const providerId = `${provider.toLowerCase()}_${Date.now()}`;
      const email = `${username.trim().toLowerCase() || provider.toLowerCase()}@example.com`;
      await socialLogin(provider, providerId, email);
      alert(`${provider} login successful!`);
      setShowLogin(false);
      setShowSignup(false);
      navigate('/score');
    } catch (error) {
      const message = error?.response?.data?.detail || error.message || `${provider} sign-in failed`;
      alert(message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      showSignup ? handleSignup() : handleLogin();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,114,0,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(2,132,199,0.22),transparent_35%)]" />
      <div className="relative z-10">
        <Navbar onLogin={() => setShowLogin(true)} />

        <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 sm:px-10">
          <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <span className="mb-5 inline-block rounded-full bg-brand-orange px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-950">
              Cricket Scorecard System
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              Cricket Scorecard <span className="text-brand-orange">Management</span> System
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Cricket is not just a game; it's an emotion that unites millions. Our platform helps you
              manage every ball, every player, and every score with modern ease.
            </p>
          </section>

          <section id="services" className="mx-auto mt-16 max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">SERVICES</h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <FeatureCard
                title="Real-Time Updates"
                description="Update match data live and track every ball as the score grows."
              />
              <FeatureCard
                title="Customizable Scorecard"
                description="Create lineups, assign roles, and manage batting and bowling stats."
              />
              <FeatureCard
                title="Auto Score Calculation"
                description="Runs, overs, and strike rates are computed automatically as you score."
              />
              <FeatureCard
                title="Easy to Use"
                description="A clean interface that lets you focus on the match, not the tools."
              />
            </div>
          </section>

          <section id="about" className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40">
            <h2 className="mb-5 text-3xl font-bold text-white">ABOUT</h2>
            <p className="text-slate-300">Our cricket score manager offers real-time updates, player performance summaries, and an easy flow from match setup through scorecard and summary screens.</p>
          </section>

          <section id="contact" className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40">
            <h2 className="mb-5 text-3xl font-bold text-white">CONTACT</h2>
            <p className="text-slate-300">For inquiries, email <span className="text-brand-orange">supastrikers48@gmail.com</span> or call <span className="text-brand-orange">+977-9898989898</span>.</p>
          </section>
        </main>
      </div>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-8">
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
                setShowSignup(false);
              }}
              className="absolute right-5 top-5 text-2xl text-slate-300 transition hover:text-brand-orange"
            >
              ×
            </button>
            <h2 className="mb-6 text-center text-3xl font-bold text-white">
              {showSignup ? 'Create Account' : 'Login'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Username"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Password"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
              />
              <button
                type="button"
                onClick={showSignup ? handleSignup : handleLogin}
                className="w-full rounded-full bg-brand-orange px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-orange-500"
              >
                {showSignup ? 'Sign Up' : 'Login'}
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-slate-400">
              {showSignup ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowSignup(false)}
                    className="font-semibold text-brand-orange hover:text-orange-300"
                  >
                    Login
                  </button>
                </p>
              ) : (
                <p>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="font-semibold text-brand-orange hover:text-orange-300"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
            <div className="mt-8 text-center text-sm text-slate-400">
              <p className="mb-2">Continue with</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Facebook')}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-brand-orange"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-brand-orange"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Discord')}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-brand-orange"
                >
                  Discord
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
