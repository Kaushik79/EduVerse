# EduVerse 🎓

A full-stack college management platform with separate portals for **Students**, **Teachers**, **Admins**, and **Alumni** — with WhatsApp notifications powered by Twilio.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | MySQL + Sequelize ORM |
| Auth | JWT (JSON Web Tokens) |
| Messaging | Twilio WhatsApp API |

---

## Prerequisites

Make sure the following are installed on your machine before starting:

- **Node.js** v18 or higher → https://nodejs.org
- **MySQL** v8.0 or higher → https://dev.mysql.com/downloads/
- **npm** (comes with Node.js)
- **Git** → https://git-scm.com

---

## Project Structure

```
EduVerse/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── student/
│       │   ├── teacher/
│       │   ├── admin/
│       │   └── alumni/
│       └── components/
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── seeders/
│   │   └── seed.js  # Sample data seeder
│   └── index.js
└── README.md
```

---

## Installation & Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Kaushik79/EduVerse.git
cd EduVerse
```

---

### Step 2 — Set Up the Database

1. Open **MySQL Workbench** or any MySQL client and run:

```sql
CREATE DATABASE eduverse;
```

2. Make sure your MySQL server is running on **port 3306**.

---

### Step 3 — Configure Environment Variables

Navigate to the `server` folder and create a `.env` file:

```bash
cd server
```

Create a file named `.env` and paste the following (edit with your MySQL credentials):

```env
# Database
DB_NAME=eduverse
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Auth
JWT_SECRET=your_secret_key_here

# Twilio WhatsApp (optional — leave blank to disable)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

> **Note:** Twilio credentials are optional. The app works fully without them — WhatsApp messages will simply be skipped.

---

### Step 4 — Install Server Dependencies

Inside the `server` folder:

```bash
cd server
npm install
```

---

### Step 5 — Install Client Dependencies

Open a new terminal, then:

```bash
cd client
npm install
```

---

### Step 6 — Seed the Database

This creates all tables and populates sample data (users, courses, assignments, schedules, etc.):

```bash
cd server
npm run seed
```

You should see output like:
```
✓ Database synced
✓ Users seeded
✓ Courses seeded
✓ Schedules seeded
...
✓ Seeding complete!
```

---

### Step 7 — Run the Application

You need **two terminals** running simultaneously.

**Terminal 1 — Backend (runs on port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (runs on port 5173):**
```bash
cd client
npm run dev
```

Then open your browser and go to:

```
http://localhost:5173
```

---

## Default Login Credentials

Use these accounts to explore the different portals:

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| **Teacher** | anderson@eduverse.com | password123 | `/teacher/dashboard` |
| **Student** | alex@eduverse.com | password123 | `/student/dashboard` |
| **Admin** | admin@eduverse.com | password123 | `/admin/dashboard` |
| **Alumni** | jane@eduverse.com | password123 | `/alumni/profile` |

---

## Portal Features

### 🎓 Student Portal
- Dashboard (LeetCode progress, upcoming events, achievements)
- Courses, Assignments, Exams, Grades
- OD / Leave / Gate Pass applications
- Resources, Finances, Schedule, Settings

### 👩‍🏫 Teacher Portal
- Dashboard with **live OD/Leave approval** (approve/reject in one click)
- **Post Announcements** to students
- Classes, Assignments, Students directory
- **Fully editable Schedule** (add / edit / delete slots)

### 🛡️ Admin Portal
- Dashboard (system health, activity feed)
- Role Management, Academic Control
- Verification Queue, Support Center

### 🎓 Alumni Portal
- My Profile (personal info, education, job, skills, social links)
- Alumni Directory (search + connect)
- Jobs & Referrals (post and apply)
- Messaging (real-time chat UI)
- Events (register, create)
- Mentorship (request sessions with mentors)

---

## WhatsApp Notifications (Optional)

EduVerse can send automated WhatsApp reminders to students with late submissions.

### Setup Steps:
1. Create a free account at https://twilio.com
2. Go to **Messaging → Try it Out → Send a WhatsApp message**
3. Note your **Account SID**, **Auth Token**, and **WhatsApp sandbox number**
4. For each student phone number, send `join <sandbox-keyword>` to `+14155238886` on WhatsApp to opt in
5. Add your Twilio credentials to `server/.env`

> **Important:** Phone numbers must be in E.164 format (e.g., `+919876543210`).

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `SequelizeConnectionError` | Check MySQL is running and `.env` credentials are correct |
| Port 5000 already in use | Kill the process or change `PORT` in `server/index.js` |
| `Cannot find module` error | Run `npm install` again in the respective folder |
| Blank page on frontend | Open browser console (F12) and check for import errors |
| Twilio `Channel not found` error | Make sure you've joined the Twilio WhatsApp sandbox first |

---

## Re-seeding the Database

If you want to reset all data back to the defaults:

```bash
cd server
npm run seed
```

> ⚠️ This will **drop and recreate** all tables. All existing data will be lost.

---

## Scripts Reference

### Server (`cd server`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run seed` | Reset and seed the database |

### Client (`cd client`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## License

This project was built for the **EduVerse Tech Club**. All rights reserved.