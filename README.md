[official website](https://wisp-three.vercel.app/)

![Project Structure](https://github.com/user-attachments/assets/d4d761d4-cf74-4fe6-ad90-d611aa5e645b)

![성능측정](https://github.com/user-attachments/assets/92b2ac31-adfe-4e0e-819d-7e7bab638057)

## 🤖 AI Autocomplete (Devstral via Ollama) (Local Only: EC2 Testing)
- ⚠️ Disabled on EC2 due to high GPU instance costs (local only for development/testing)
- Lightweight Copilot-style autocomplete using Devstral-Small-2505
- Deployed locally via Ollama (runs entirely on your machine)
- FastAPI service proxies prompt requests to Ollama on http://host.docker.internal:11434
- Integrated with Tiptap editor for seamless inline suggestions
- Automatically removed when editing resumes or input changes

## 🛠️ Tech Stack
- **Frontend**: Remix(React router v7), React, TailwindCSS, ShadCN/UI
- **Backend**: Django>5.0,<5.2, djangorestframework==3.15.0,<3.15.2
- **Auth**: Supabase Auth (email link, GitHub, Kakao)
- **Database**: PostgreSQL (Docker)
- **Infra**: Docker, Nginx (prod), AWS EC2 (backend), Vercel (frontend)

---

## 🔐 Authentication Flow
- Supabase handles OAuth/email login
- Supabase JWT is passed to Django
- Django class custom Authenticate validates JWT and handles user auto-creation
- User profile is created upon first login

---

## 📝 Features
- Markdown-based note editor with Tiptap
- Folder + nested note management (like Obsidian)
- rash system with restore/delete
- Private, shared, public note access modes
- Analytics: seen count, likes, comments
- Soft delete & auto-expiration logic (30-day retention)

---
