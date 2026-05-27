# DSA-project

## Stack
- Frontend: React.js + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Database: MySQL (recommended) or SQLite fallback for local development
- Deployment target: Render

## Setup

### Backend
1. Create a Python virtual environment.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Create a `.env` file in `backend/` with:
   ```env
   DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE
   ```
4. Start the backend from the repository root:
   ```bash
   uvicorn backend.main:app --reload
   ```
   If you are inside `backend/`, use:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Change into frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Production Build
1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Start backend (serves built React app):
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000
   ```

## Auth
- Login and signup are handled by the backend API.
- Local signup uses `POST /auth/signup` and login uses `POST /auth/login`.
- Social sign-in placeholders are available for Facebook, Google, and Discord using `POST /auth/social`.

## Deployment on Render
1. Push this repository to GitHub.
2. Create a new Render Web Service and connect it to the `main` branch.
3. Use this build command:
   ```bash
   pip install -r backend/requirements.txt && cd frontend && npm install && npm run build
   ```
4. Use this start command:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```
5. Add a Render environment variable:
   - `DATABASE_URL`: `mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE`
6. Confirm the service name is set and deploy.

If you want, I can also help you create the Render service from the Render dashboard and tell you what values to enter. 
