![Project Structure](https://github.com/user-attachments/assets/d4d761d4-cf74-4fe6-ad90-d611aa5e645b)

[official website](https://wisp-three.vercel.app/)

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
