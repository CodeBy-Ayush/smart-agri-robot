# 🌱 Smart Agricultural Robot Automation Systems

A full-stack web application that automates agricultural missions using robotics and AI.  
Farmers can plan missions, admins approve them, robots execute tasks, and AI recommends crops.

------------------------------------------------------------------------------------------------

## 🚀 Features:-

### 👨‍🌾 Farmer Modules
- Create missions (Planting, Weeding, Surveying)
- Select field zones and priority
- View active robot missions
- Track mission progress in real-time

### 🧑‍💼 Admin Modules
- View all submitted missions
- Approve or reject missions
- Auto-assign idle robots
- Monitor system statistics

### 🤖 Robot Simulations
- Grid-based robot movement
- Battery consumption
- Task execution (weeding/planting)
- Live telemetry logs
- Automatic mission completion

### 🌾 AI Crop Recommendation
- Uses Google Gemini AI
- Soil-based crop prediction
- Yield estimation
- Fertilizer & water advice
- Risk analysis

---------------------------------------------------------------------------------------------

## 🛠️ Tech Stacks

### Frontend
- React.js
- Tailwind CSS
- Axios
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentications

### AI
- Google Gemini API (gemini-2.5-flash)

---

## 📂 Project Structures

backend/
├── models/
├── routes/
├── middleware/
└── server.js

frontend/
├── src/
├── public/
└── package.json

--------------------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 1️⃣ Clones the repository
```bash
git clone https://github.com/your-username/smart-agri-robot.git
cd smart-agri-robot
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
cp .env.example .env
npm start
3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
🔐 Environment Variables
Set these in backend/.env:

makefile
Copy code
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
