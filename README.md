Wisp
A monorepo project combining a Django backend and a Remix frontend, with Supabase-based authentication.

🧱 Project Structure
/backend/ - Django 5.x API server with Supabase JWT authentication
/frontend/ - Remix app using Supabase Auth (magic link, OAuth, etc.)

🚀 Getting Started
Clone the repo
git clone https://github.com/oscar2272/wisp.git
cd wisp

Backend
cd backend
cp .env.example .env
docker-compose up --build

Django runs on localhost:8000

PostgreSQL + Supabase JWT middleware included

Frontend
cd frontend
cp .env.example .env
npm install
npm run dev

Remix runs on localhost:3000

🔐 Authentication
Supabase Auth (email magic link, GitHub, Kakao, etc.)

JWT verified by Django middleware

Automatic user/profile creation on login

🧪 Development Flow
Create a feature branch
git checkout -b feature/your-feature

Work, then commit
git add .
git commit -m "your commit message"

Push and open a Pull Request
git push origin feature/your-feature

🧼 Branch Strategy
main: production-ready code (includes both frontend/backend)

feature/\*: for isolated development
