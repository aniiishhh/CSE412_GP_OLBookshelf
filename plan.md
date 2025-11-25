# 📘 Online Bookshelf Web App — Implementation & Deployment Guide

A structured roadmap for developing, testing, and deploying the **Online Bookshelf** full-stack project using **FastAPI**, **PostgreSQL**, and **React + Tailwind**.
The guide is designed for incremental execution—one phase at a time—with built-in verification steps.

---

## 🧱 Tech Stack Overview

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| **Backend**    | Python 3 + FastAPI (SQLAlchemy / Pydantic / Uvicorn)          |
| **Database**   | PostgreSQL (local or hosted)                                  |
| **Frontend**   | React (Vite) + Tailwind CSS                                   |
| **Testing**    | Pytest (backend APIs)                                         |
| **Deployment** | Render / Railway (Postgres + API) Vercel / Netlify (frontend) |

---

## ⚙️ Phase 1 — Backend Foundation (FastAPI Setup)

### 🎯 Goal

Establish a working FastAPI backend connected to your PostgreSQL instance.

### 🪜 Steps

#### 1️⃣ FastAPI App Initialization

- In `main.py`, create a minimal FastAPI app with a root route `/` returning `"API running"`.
- Confirm `uvicorn main:app --reload` runs without errors.

**Test →** Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) → should display `"API running"`.

---

#### 2️⃣ Database Configuration

- Add `config.py` containing connection details (host, port, user, password, dbname).
- Keep credentials inside a `.env` file and load via `python-dotenv`.
- Connect using SQLAlchemy engine or psycopg2.

**Test →** Execute a quick `SELECT 1;` query; expect success.

---

#### 3️⃣ Define ORM Models

- Create `models.py` mirroring tables: `user`, `book`, `author`, `genre`, `bookauthor`, `bookgenre`, `readinglist`.
- Use SQLAlchemy for ORM models + Pydantic for schemas.

**Test →** Run a count query on `book` table ≈ 70 000 records.

---

#### 4️⃣ Router & CRUD Setup

Inside `routers/` directory create files:

- `users.py`, `books.py`, `authors.py`, `genres.py`, `readinglist.py`.
- Each router handles its own CRUD endpoints and is included in `main.py`.

**Test →** Call `/books` endpoint; returns JSON data from DB.

---

#### 5️⃣ Error Handling

Add FastAPI exception handlers for 404 & 500 errors.

**Test →** Request a non-existent book ID → returns JSON error object.

---

## 🔐 Phase 2 — Authentication & User Features

### 🎯 Goal

Enable JWT-based auth and user-specific reading-list management.

### 🪜 Steps

#### 1️⃣ JWT Auth

- Implement `/register` and `/login` routes using `fastapi.security`.
- Hash passwords with `bcrypt`.
- Return JWT token on login.

**Test →** Register a user → row appears in `user` table; login returns token.

---

#### 2️⃣ Reading List CRUD

Endpoints:

- `POST /readinglist` → Add book
- `PATCH /readinglist/{bookid}` → Update progress/rating
- `DELETE /readinglist/{bookid}` → Remove book
- `GET /readinglist` → View user’s list

**Test →** Insert book then update status → DB reflects change.

---

## 🧮 Phase 3 — Frontend Integration (React + Tailwind)

### 🎯 Goal

Build a comprehensive UI to consume backend APIs with focus on book browsing, search, and reading list management.

### 🪜 Steps

#### 1️⃣ Project Setup & Configuration

- Initialize Vite React project with TypeScript
- Configure Tailwind CSS with custom theme colors
- Set up React Router for navigation
- Create folder structure (components, pages, hooks, services, types)
- Configure environment variables for API endpoints

**Test →** `npm run dev` → Basic app structure loads without errors

---

#### 2️⃣ Authentication Flow

- Create login and registration forms with validation
- Implement authentication context/provider for global state
- Set up JWT storage in localStorage with secure handling
- Add protected route wrapper components
- Create user profile dropdown component

**Test →** Register new account → Login → Verify persistent authentication

---

#### 3️⃣ Book Browsing & Search

- Develop responsive book card components
- Create paginated book list with filtering options
- Implement search functionality with debounce
- Add filter components for author, genre, and rating
- Create skeleton loaders for better UX during API calls

**Test →** Browse books → Apply filters → Search by title/author → UI updates correctly

---

#### 4️⃣ Book Details Page

- Design detailed book view layout
- Show complete book information (title, author, genre, description)
- Display ratings and page count
- Add external links to Goodreads
- Include related books section

**Test →** Click on book card → Details page loads with complete information

---

#### 5️⃣ Reading List Management

- Create reading list page with status tabs (Reading, Completed, Want to Read)
- Implement add/remove book functionality
- Add status update dropdown and progress tracking
- Create rating and notes components
- Design empty state illustrations

**Test →** Add book to list → Update status → Add rating → Verify persistence

---

#### 6️⃣ UI Polish & Responsive Design

- Ensure responsive layout for all screen sizes
- Add transitions and animations for better UX
- Implement dark/light mode toggle
- Create toast notifications for user actions
- Add loading states and error handling

**Test →** Verify UI works correctly on mobile, tablet, and desktop viewports

---

#### 7️⃣ Performance Optimization

- Implement lazy loading for images and routes
- Add caching for frequently accessed data
- Optimize bundle size with code splitting
- Add error boundaries for component-level error handling

**Test →** Measure and verify load times and interaction responsiveness

---

## ☁️ Phase 4 — Deployment (Backend + Frontend)

### 🎯 Goal

Deploy Postgres, FastAPI API, and React frontend on free tiers.

### 🪜 Steps

#### 1️⃣ Database Hosting

- Create free PostgreSQL instance on **Render** or **Railway**.
- Copy connection URI into `.env`.

**Test →** Connect locally to remote DB → `SELECT COUNT(*) FROM book;`.

---

#### 2️⃣ Backend Deployment

- Push repo to GitHub → link to Render Web Service.
- Add environment variables: `DATABASE_URL`, `JWT_SECRET`.
- Expose `/health` endpoint.

**Test →** Render URL returns `"OK"` from `/health`.

---

#### 3️⃣ Frontend Deployment

- Deploy React build to **Vercel** or **Netlify**.
- Configure `VITE_API_BASE_URL` → Render backend URL.

**Test →** Public link loads & fetches live book data.

---

## 🧪 Phase 5 — Testing & Validation

### 🎯 Goal

Verify stability and functionality through automated tests.

### 🪜 Steps

#### 1️⃣ Backend Unit Tests

- Inside `tests/`, write `test_books.py`, `test_users.py`.
- Use FastAPI’s `TestClient`.

**Test →** Run `pytest -v` → all tests green.

---

#### 2️⃣ Integration Checks

- Use Postman or browser to verify end-to-end flows: login → add book → update → delete.

---

#### 3️⃣ Performance Sanity

- Ensure book-list API responds < 1 s.
- Verify indexes on `bookid`, `authorid`, `genreid`.

---

## 🧾 Phase 6 — Documentation & Presentation

### 🪜 Steps

- Write README explaining project, setup, and deployment links.
- Include API reference (auto-docs at `/docs`).
- Add ER diagram + system architecture diagram.
- Record short demo video (show queries + live web app).

---

## ✅ Phase Completion Checklist

| Phase | Verification                                     |
| ----- | ------------------------------------------------ |
| **1** | FastAPI root accessible & DB connection verified |
| **2** | Auth + Reading-List CRUD work                    |
| **3** | React frontend consumes APIs                     |
| **4** | Backend + DB deployed and linked                 |
| **5** | All Pytests pass and queries perform well        |
| **6** | Documentation + demo complete                    |

---

## 🧩 Notes

- Database tables are pre-created and populated—only configure credentials.
- Keep `.env` out of version control.
- All test scripts should reside under `tests/`.
- Incrementally commit after each successful phase.

---

### 🎉 Final Deliverable

A fully functional, deployed, documented **Online Bookshelf Web App** with working database, REST APIs, and minimal responsive UI — ready for demo or resume showcase.
