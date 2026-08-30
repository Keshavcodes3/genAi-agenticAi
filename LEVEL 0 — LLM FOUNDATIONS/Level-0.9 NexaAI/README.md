# ✨ NexaAI

NexaAI is a modern full-stack AI workspace built for seamless conversations, intelligent search, project organization, and productivity.

Inspired by tools like Perplexity and ChatGPT, NexaAI allows users to chat with AI, manage conversations, organize projects, and explore the web through an elegant and responsive interface.

Built using React, Redux Toolkit, Node.js, Express, MongoDB, and modern AI integrations.

---

# 🌐 Live Demo

### Frontend

https://nexa-ai-one-amber.vercel.app

### Backend

https://nexaai-tahr.onrender.com

---

# 🚀 Features

* 💬 AI-powered conversations
* 🧠 Persistent chat history
* 📂 Project & workspace management
* 🔍 Web search integration using Tavily
* 🔒 JWT Authentication & Protected Routes
* 👤 User account system
* 📊 Admin analytics dashboard
* ⚡ Redux Toolkit state management
* 🎨 Clean responsive UI with Tailwind CSS
* 🌐 Production deployment on Vercel + Render
* 🍪 Secure cookie-based authentication
* 📱 Mobile responsive experience

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios
* Lucide React
* Framer Motion

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cookie Parser
* CORS
* Morgan

## AI & Search

* OpenAI API
* Tavily Search API

---

# 📁 Project Structure

```bash
NexaAI/
│
├── Frontend/
│   ├── src/
│   │   ├── API/
│   │   ├── Components/
│   │   ├── Features/
│   │   ├── Hooks/
│   │   ├── Redux/
│   │   ├── Utils/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── vite.config.js
│   └── vercel.json
│
├── Backend/
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   ├── Utils/
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd NexaAI
```

---

# 💻 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ⚙️ Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:3000
```

---

# 🔑 Environment Variables

## Backend `.env`

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_api_key

TAVILY_API_KEY=your_tavily_api_key

NODE_ENV=development
```

---

## Frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

# 🔐 Authentication

NexaAI uses:

* JWT-based authentication
* HTTP-only cookies
* Protected frontend routes
* Secure backend middleware
* Persistent login sessions

---

# 📌 Core Functionalities

## 💬 AI Conversations

Users can:

* Start new chats
* Continue previous conversations
* Store conversation history
* Organize chats into projects

---

## 📂 Projects Workspace

Users can:

* Create projects
* Add conversations into projects
* Manage organized AI workflows

---

## 🔍 Web Search Integration

Integrated Tavily search enables:

* Real-time web results
* AI-enhanced search responses
* Smarter contextual answers

---

## 📊 Admin Dashboard

Admin panel includes:

* User analytics
* Conversation statistics
* Registration insights
* Platform overview

---

# 🎨 UI & Experience

Designed with a modern productivity-first interface:

* Responsive layout
* Sticky navigation
* Sidebar workspace
* Smooth UX
* Mobile support
* Clean typography
* Minimal aesthetic

---

# 🚀 Deployment

## Frontend Deployment

* Hosted on Vercel

## Backend Deployment

* Hosted on Render

---

# 🔮 Future Improvements

* Streaming AI responses
* Markdown rendering
* Code syntax highlighting
* File uploads
* Multi-model AI support
* Real-time collaboration
* Dark mode themes
* AI agents & workflows
* Voice interaction

---

# 👨‍💻 Author

Built by **Keshav Chetri**

---

# 📄 License

MIT License
