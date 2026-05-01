# 🚀 Smart Team — AI-Powered Task Manager

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel_%26_Railway-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  <b>A full-stack team task management platform with AI assistance, built with React + Spring Boot.</b>
</p>

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🌐 **Frontend** | [smart-team-frontend.vercel.app](https://smart-team-frontend.vercel.app) |
| ⚙️ **Backend API** | [web-production-f51b5.up.railway.app](https://web-production-f51b5.up.railway.app/api/auth/health) |
| 📚 **Swagger Docs** | [/swagger-ui/index.html](https://web-production-f51b5.up.railway.app/swagger-ui/index.html) |

---

## 📌 GitHub Repositories

| Repo | Link |
|---|---|
| 🖥️ **Frontend** | [github.com/12Mithun/smart-team-frontend](https://github.com/12Mithun/smart-team-frontend) |
| ⚙️ **Backend** | [github.com/12Mithun/smart-team-backend](https://github.com/12Mithun/smart-team-backend) |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup, login & token-based auth
- 📋 **Project Management** — Create and manage multiple projects
- ✅ **Task Tracking** — Assign tasks with priority, status & due dates
- 📊 **Dashboard** — Real-time stats and progress charts (Chart.js)
- 🤖 **AI Assistant** — Integrated AI chat for task suggestions
- 📱 **Responsive Design** — Works on desktop and mobile
- 🎨 **Sky Blue Theme** — Clean, modern UI with Times New Roman typography

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite 8 | Build Tool |
| React Router v7 | Client-side Routing |
| Axios | HTTP Client |
| Chart.js | Data Visualization |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Tech | Purpose |
|---|---|
| Spring Boot 3.2 | REST API Framework |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | ORM / Database Layer |
| MySQL | Relational Database |
| JWT (jjwt 0.11.5) | Token-based Auth |
| Lombok | Code Generation |
| SpringDoc OpenAPI | Swagger UI / API Docs |

### Deployment
| Service | Platform |
|---|---|
| Frontend | Vercel (Free Hobby) |
| Backend | Railway (Nixpacks) |
| Database | Railway MySQL Plugin |

---

## 🏗️ Architecture

```
[User Browser]
      │
      ▼
[Vercel — React/Vite Frontend]
      │  HTTPS API calls (VITE_API_URL)
      ▼
[Railway — Spring Boot Backend :8080]
      │  JDBC
      ▼
[Railway MySQL Database]
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8 running locally

### 1. Clone the repos

```bash
git clone https://github.com/12Mithun/smart-team-backend.git
git clone https://github.com/12Mithun/smart-team-frontend.git
```

### 2. Run the Backend

```bash
cd smart-team-backend
# Create a local MySQL database named 'tasknova'
# Then run:
mvn spring-boot:run
# Backend starts at http://localhost:8080
```

### 3. Run the Frontend

```bash
cd smart-team-frontend
npm install
npm run dev
# Frontend starts at http://localhost:5173
```

> The Vite dev server proxies `/api` → `http://localhost:8080` automatically.

---

## 🔑 Environment Variables

### Backend (Railway)
| Variable | Description |
|---|---|
| `MYSQL_URL` | JDBC MySQL connection URL |
| `MYSQLUSER` | MySQL username |
| `MYSQLPASSWORD` | MySQL password |
| `JWT_SECRET` | Secret key for JWT signing |
| `OPENAI_API_KEY` | OpenAI key (or `mock`) |
| `PORT` | Server port (auto-set by Railway) |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Full backend URL (e.g. `https://your-backend.up.railway.app/api`) |

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/auth/health` | Health check | Public |
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login & get JWT | Public |
| GET | `/api/projects` | List all projects | 🔒 JWT |
| POST | `/api/projects` | Create project | 🔒 JWT |
| GET | `/api/tasks` | List all tasks | 🔒 JWT |
| POST | `/api/tasks` | Create task | 🔒 JWT |
| PUT | `/api/tasks/{id}` | Update task | 🔒 JWT |
| DELETE | `/api/tasks/{id}` | Delete task | 🔒 JWT |
| GET | `/api/dashboard/stats` | Dashboard stats | 🔒 JWT |
| POST | `/api/ai/chat` | AI assistant | 🔒 JWT |

Full Swagger docs at: `https://web-production-f51b5.up.railway.app/swagger-ui/index.html`

---

## 📁 Project Structure

```
smart-team-frontend/
├── src/
│   ├── api/          # Axios instance & interceptors
│   ├── components/   # Reusable UI components (Layout, Navbar)
│   ├── pages/        # Login, Dashboard, Tasks, Projects, AIAssistant
│   ├── App.jsx       # Routes
│   └── main.jsx      # Entry point
├── vercel.json       # SPA rewrite rules
└── vite.config.js    # Dev proxy config

smart-team-backend/
├── src/main/java/com/tasknova/
│   ├── controller/   # REST controllers (Auth, Task, Project, Dashboard, AI)
│   ├── service/      # Business logic
│   ├── entity/       # JPA entities (User, Task, Project)
│   ├── dto/          # Request/Response DTOs
│   ├── repository/   # Spring Data JPA repos
│   ├── security/     # JWT filter, SecurityConfig
│   └── config/       # App config
├── railway.toml      # Railway deployment config
└── Procfile          # Heroku-style process file
```

---

## 👨‍💻 Author

**Mithun** — [@12Mithun](https://github.com/12Mithun)

---

## 📄 License

This project is for educational/placement purposes.
