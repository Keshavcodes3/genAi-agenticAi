# 📖 StoryBook.ai - Complete Documentation

💻 Frontend: https://story-book-ai-eta.vercel.app
<br/>
<br/>
⚙️ Backend: https://storybook-ai-bgyd.onrender.com


A beautiful, distraction-free digital workspace built for authors and poets. It combines an intelligent AI co-author with simple writing tools so you can focus entirely on your words, characters, and verses without the headache of sorting through endless files.

---

## Table of Contents

1. [The Backstory](#-the-backstory-why-i-built-this)
2. [What the Platform Does](#-what-the-platform-does)
3. [Tech Stack](#-the-tech-stack)
4. [AI Brain (LLM)](#-the-ai-brain-llm)
5. [Getting Started](#-getting-started)
6. [Project Structure](#-project-structure)
7. [Features Guide](#-features-guide)
8. [API Documentation](#-api-documentation)
9. [Development Setup](#-development-setup)
10. [Deployment](#-deployment)
11. [Contributing](#-contributing)
12. [Troubleshooting](#-troubleshooting)
13. [FAQs](#-faqs)

---

## 🚀 The Backstory: Why I Built This

I have always had a deep love for writing. Getting lost in building new worlds, mapping out plot lines, and playing with the rhythm of poetry was incredibly fulfilling. But as my projects grew, the software I was using started getting in the way.

Traditional text editors treat your writing like flat text on a blank spreadsheet. Before long, I found myself overwhelmed by the administrative clutter of creativity. I was spending more time managing separate documents for character profiles, tracking lore consistency across different chapters, and trying to keep tabs on poetic syllable counts than actually writing. The software felt clunky, rigid, and frustrating. It completely killed my creative momentum, and out of pure frustration, I quit writing altogether.

But as a developer, I couldn't just walk away from the problem. I realized that I didn't want to stop writing; I just needed a tool that could move at the absolute speed of thought. So, I decided to build it myself. StoryBook.ai was born out of a personal need to eliminate the friction between a blank page and a human mind.

---

## ✨ What the Platform Does

### 📖 The Story Forge
A clean, spacious canvas designed for long-form writing. It comes with a built-in AI assistant that acts as your creative partner. It keeps track of your overarching plot, remembers your character details, and helps you keep your world-building organized so you never get lost in your own timeline.

**Key Features:**
- Rich text editor with minimal distractions
- AI-powered contextual suggestions
- Character and plot tracking
- Real-time word count and statistics
- Version history and auto-save

### ✍️ The Poetry Metric Studio
A specialized, minimal text environment tailored specifically for writing verse. It offers a smooth, lightweight typing experience that lets you focus on tone, style, and structure without distracting menus getting in your way.

**Key Features:**
- Syllable and line tracking
- Rhyme scheme suggestions
- Meter and rhythm analysis
- Clean, distraction-free interface
- Quick formatting tools

### 🎯 The Creative Dashboard
A clean and modern light-themed home page that keeps you inspired. It welcomes you every day, shows you a daily writing prompt to beat writer's block, logs your recent projects so you can jump right back in, and visualizes your daily writing streaks to help you build a consistent habit.

**Key Features:**
- Daily writing prompts
- Writing streak tracking
- Recent projects overview
- Quick statistics
- Achievement badges
- Motivational quotes

### 🎨 Premium Feel UI/UX
The entire interface feels like a fluid desktop app rather than a static website. It features a beautiful, collapsible navigation sidebar that smoothly glides open or closed with a single click, completely changing shapes without any jarring jumps or laggy movements.

**Design Elements:**
- Smooth animations and transitions
- Responsive design for all devices
- Dark/Light theme support
- Intuitive navigation
- Real-time feedback

---

## 🛠️ The Tech Stack

### Frontend Architecture

The frontend is built with modern web technologies focused on performance and user experience:

| Technology | Purpose |
|-----------|---------|
| **React 18+** | UI library for building interactive components |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS for responsive design |
| **Redux Toolkit** | State management for user data and app state |
| **Framer Motion** | Advanced animations and smooth transitions |
| **Axios** | HTTP client for API communication |

### Backend Architecture

The backend provides a robust, scalable server infrastructure:

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework and router |
| **MongoDB** | NoSQL database for flexible data storage |
| **Mongoose** | ODM for MongoDB with schema validation |
| **JWT** | Secure authentication tokens |
| **Bcrypt** | Password hashing and encryption |

### AI Integration

| Component | Purpose |
|-----------|---------|
| **LLM API** | Large Language Model for intelligent suggestions |
| **Context Engine** | Maintains conversation and document context |
| **Memory Service** | Stores character and plot information |

---

## 🧠 The AI Brain (LLM)

Instead of a basic text box that just guesses the next word like a phone keyboard, the Large Language Model (LLM) integration runs quietly in the background as a true context-aware writing companion:

### Contextual Memory for Stories

When you are working on long narratives, the AI reads through your previous chapters. It makes sure that a character's background traits, personality quirks, eye colors, or unique ways of speaking stay completely consistent from Chapter 1 all the way to Chapter 20. It points out accidental mistakes or pacing delays, helping you polish your story effortlessly.

**Capabilities:**
- Character consistency checking
- Plot timeline verification
- Dialogue and voice consistency
- Pacing analysis
- World-building coherence
- Automatic continuity alerts

### Structural Guidance for Poetry

When you switch over to writing poetry, the AI adapts to look at rhythm, lines, and syllable structures. It can help suggest structural alternatives or find words that fit a specific rhyming pattern, acting as a supportive guide while making sure the core human emotion and voice belong entirely to you.

**Capabilities:**
- Syllable counting and tracking
- Rhyme scheme suggestions
- Meter and rhythm analysis
- Metaphor and imagery enhancement
- Poetic form guidance (Sonnet, Haiku, etc.)
- Flow and readability feedback

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (v4.4 or higher) - Local or Atlas connection
- **Git** for version control

### Quick Start (5 Minutes)

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/storybook-ai.git
cd storybook-ai
```

#### 2. Set Up Environment Variables

**Backend (.env file)**
```
MONGODB_URI=mongodb://localhost:27017/storybook
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
LLM_API_KEY=your_llm_api_key
```

**Frontend (.env.local file)**
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=StoryBook.ai
```

#### 3. Install Backend Dependencies
```bash
cd Backend
npm install
```

#### 4. Start MongoDB
```bash
mongod
```

#### 5. Start the Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

#### 6. Install Frontend Dependencies (in a new terminal)
```bash
cd Frontend
npm install
```

#### 7. Start the Frontend Development Server
```bash
npm run dev
# Application opens at http://localhost:5173
```

That's it! You now have StoryBook.ai running locally.

---


## 📖 Features Guide

### 1. User Authentication

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Register
```
POST /api/auth/register
Body: { name, email, password, confirmPassword }
Response: { token, user }
```

### 2. Story Management

#### Create a Story
1. Navigate to Dashboard
2. Click "Create New Story"
3. Enter story title and description
4. Click "Start Writing"

#### Edit a Story
1. Open the story from your library
2. Use the Story Forge editor
3. Changes are auto-saved
4. Use AI assistant for suggestions

#### Share a Story
1. Open story settings
2. Click "Generate Share Link"
3. Share the link with others

### 3. Poetry Studio

#### Create a Poem
1. Navigate to Poems section
2. Click "New Poem"
3. Choose a poetry form (Free verse, Sonnet, Haiku, etc.)
4. Start typing with real-time syllable tracking

#### Use Rhyme Suggestions
1. Type your poem
2. AI automatically suggests rhyming words
3. Click suggestions to insert
4. Review and modify as needed

### 4. AI Chat Assistant

#### Start a Conversation
1. Open Story Forge or Poetry Studio
2. Click "Ask Muse" button
3. Ask questions about your writing
4. Get contextual suggestions

#### Examples of Prompts
- "Help me develop this character"
- "What should happen next?"
- "Check my poem for rhythm"
- "Is this consistent with Chapter 3?"

### 5. Dashboard & Analytics

#### Writing Streaks
- Automatic tracking of daily writing
- Visual calendar heatmap
- Streak notifications

#### Statistics
- Total words written
- Stories completed
- Average words per session
- Time spent writing

#### Achievements
- First story milestone
- Streak milestones
- Collection achievements
- Community badges

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "confirmPassword": "secure_password"
}

Response (201):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login user
```json
Request:
{
  "email": "john@example.com",
  "password": "secure_password"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### POST `/api/auth/logout`
Logout user (requires authentication)
```
Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Story Endpoints

#### GET `/api/stories`
Get all user stories (requires authentication)
```
Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "story_id",
      "title": "My Epic",
      "content": "Once upon a time...",
      "wordCount": 5000,
      "createdAt": "2024-01-01",
      "updatedAt": "2024-01-15"
    }
  ]
}
```

#### POST `/api/stories`
Create a new story
```json
Request:
{
  "title": "My New Story",
  "description": "A tale of adventure",
  "category": "fantasy"
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

#### GET `/api/stories/:id`
Get a specific story
```
Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### PUT `/api/stories/:id`
Update a story
```json
Request:
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "science-fiction"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### DELETE `/api/stories/:id`
Delete a story
```
Response (200):
{
  "success": true,
  "message": "Story deleted"
}
```

### Chat (AI) Endpoints

#### POST `/api/chat/send`
Send a message to AI (requires authentication)
```json
Request:
{
  "message": "Help me with this character",
  "storyId": "story_id",
  "context": "previous_messages"
}

Response (200):
{
  "success": true,
  "data": {
    "response": "AI generated response...",
    "suggestions": ["suggestion1", "suggestion2"]
  }
}
```

#### GET `/api/chat/history/:storyId`
Get chat history for a story
```
Response (200):
{
  "success": true,
  "data": [
    {
      "role": "user",
      "message": "...",
      "timestamp": "..."
    },
    {
      "role": "assistant",
      "message": "...",
      "timestamp": "..."
    }
  ]
}
```

### User Profile Endpoints

#### GET `/api/users/profile`
Get current user profile (requires authentication)
```
Response (200):
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "An avid writer",
    "avatar": "url",
    "writingStreak": 5,
    "totalWords": 50000
  }
}
```

#### PUT `/api/users/profile`
Update user profile
```json
Request:
{
  "name": "Jane Doe",
  "bio": "Updated bio",
  "avatar": "new_avatar_url"
}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

---

## 💻 Development Setup

### Backend Development

#### 1. Install Dependencies
```bash
cd Backend
npm install
```

#### 2. Create `.env` File
```
MONGODB_URI=mongodb://localhost:27017/storybook-dev
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

#### 3. Database Setup
```bash
# MongoDB should be running
mongod

# In another terminal, start the backend
npm start
```

#### 4. Backend Folder Structure
- `Modules/` - Feature modules
  - Each module has: controller, model, routes
- `Middlewares/` - Reusable middleware
- `config/` - Configuration files
- `Common/` - Shared utilities

#### 5. Creating a New API Endpoint

**Step 1: Create Model** (`Modules/Feature/feature.model.js`)
```javascript
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feature', featureSchema);
```

**Step 2: Create Controller** (`Modules/Feature/feature.controller.js`)
```javascript
const Feature = require('./feature.model');

exports.createFeature = async (req, res) => {
  try {
    const feature = new Feature({
      ...req.body,
      userId: req.user.id
    });
    await feature.save();
    res.status(201).json({ success: true, data: feature });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
```

**Step 3: Create Routes** (`Modules/Feature/feature.routes.js`)
```javascript
const express = require('express');
const { protect } = require('../../Middlewares/protect');
const { createFeature } = require('./feature.controller');

const router = express.Router();
router.post('/', protect, createFeature);

module.exports = router;
```

**Step 4: Register Routes** (in `src/App.js`)
```javascript
const featureRoutes = require('./Modules/Feature/feature.routes');
app.use('/api/features', featureRoutes);
```

### Frontend Development

#### 1. Install Dependencies
```bash
cd Frontend
npm install
```

#### 2. Create `.env.local` File
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=StoryBook.ai
```

#### 3. Start Development Server
```bash
npm run dev
# Opens at http://localhost:5173
```

#### 4. Creating a New Feature

**Step 1: Create Feature Folder**
```
Features/NewFeature/
├── Components/
├── Hooks/
├── Pages/
├── Redux/
└── Service/
```

**Step 2: Create Redux Slice** (`Features/NewFeature/Redux/feature.slice.js`)
```javascript
import { createSlice } from '@reduxjs/toolkit';

const featureSlice = createSlice({
  name: 'feature',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setData } = featureSlice.actions;
export default featureSlice.reducer;
```

**Step 3: Create Service** (`Features/NewFeature/Service/featureService.js`)
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const featureService = {
  getAll: async () => {
    return axios.get(`${API_URL}/api/features`);
  },
  
  create: async (data) => {
    return axios.post(`${API_URL}/api/features`, data);
  }
};
```

**Step 4: Create Component** (`Features/NewFeature/Components/FeatureItem.jsx`)
```jsx
import React from 'react';

const FeatureItem = ({ item }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{item.name}</h3>
    </div>
  );
};

export default FeatureItem;
```

**Step 5: Create Page** (`Features/NewFeature/Pages/FeaturePage.jsx`)
```jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featureService } from '../Service/featureService';

const FeaturePage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.feature);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await featureService.getAll();
        // dispatch(setData(response.data));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Feature Content</p>}
    </div>
  );
};

export default FeaturePage;
```

#### 5. Styling with Tailwind CSS

```jsx
// Example component with Tailwind
<div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
  <h2 className="text-2xl font-bold text-white">Story Title</h2>
  <button className="px-4 py-2 bg-white text-purple-500 rounded-full font-semibold hover:bg-gray-100 transition-colors">
    Edit
  </button>
</div>
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### 1. Build for Production
```bash
cd Frontend
npm run build
```

#### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

#### 3. Set Environment Variables
- Go to Vercel Dashboard
- Project Settings → Environment Variables
- Add `VITE_API_URL` pointing to your backend

### Backend Deployment (Heroku/Railway/Render)

#### Using Heroku:

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

#### Using Railway.app:

1. Push code to GitHub
2. Connect GitHub repository to Railway
3. Add services (Node.js, MongoDB)
4. Set environment variables
5. Deploy automatically

#### Database Deployment (MongoDB Atlas)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` environment variable
5. Whitelist IP addresses

---

## 👥 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/storybook-ai.git
cd storybook-ai
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes

### 4. Commit Your Changes
```bash
git commit -m "feat: add new feature description"
```

**Commit Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Go to the main repository
- Click "New Pull Request"
- Describe your changes
- Wait for review

### Contribution Guidelines

- Follow the existing code structure
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Be respectful and collaborative

---

## 🔧 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
mongod  # Start MongoDB
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or use a different port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### JWT Token Expired
```
Error: jwt expired
```
**Solution:** User needs to log in again. Token is automatically refreshed on valid routes.

### Frontend Issues

#### Vite Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### API Connection Error
**Check:**
1. Backend is running on correct port
2. `.env.local` has correct `VITE_API_URL`
3. CORS is properly configured in backend

#### Redux Store Not Updating
**Solution:** Check Redux Toolkit slice configuration and middleware

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Missing package | Run `npm install` |
| `CORS error` | Backend CORS misconfigured | Update CORS settings in Express |
| `Blank page` | React component error | Check browser console for errors |
| `API timeout` | Slow response | Increase timeout, check database |

---

## ❓ FAQs

### General Questions

**Q: Is StoryBook.ai free?**
A: The application includes both free and premium features. Core writing features are free, with premium features available for enhanced AI assistance.

**Q: Can I export my stories?**
A: Yes! Stories can be exported as:
- PDF documents
- Markdown files
- Plain text
- DOCX format (coming soon)

**Q: How secure is my data?**
A: We use:
- JWT tokens for authentication
- Bcrypt password hashing
- HTTPS encryption
- MongoDB Atlas with security controls
- Regular backups

### Writing Features

**Q: Can AI rewrite my content?**
A: No. The AI provides suggestions only. You always control the final content. The AI respects your voice and creative vision.

**Q: How does the AI remember my characters?**
A: The AI reads through your story content and maintains a character memory index, tracking:
- Physical descriptions
- Personality traits
- Speech patterns
- Relationships
- Background information

**Q: Can I use poetry forms I don't see?**
A: Yes! Use "Free Verse" for any custom structure. The AI will still provide feedback on rhythm and flow.

### Technical Questions

**Q: What are the system requirements?**
A: 
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 100MB storage
- Stable internet connection
- Node.js v16+ (for development)

**Q: Can I self-host StoryBook.ai?**
A: Yes! Follow the deployment section to self-host on:
- Railway.app
- Heroku
- AWS
- DigitalOcean
- Any Node.js compatible server

**Q: How do I backup my stories?**
A: Automatic backups occur:
- Every 30 seconds while writing
- When you manually save
- Daily at 2 AM UTC
- Export anytime from settings

**Q: Can multiple users collaborate?**
A: Currently, collaboration features are in development. Watch this space!

### Account & Profile

**Q: How do I reset my password?**
A: On login page:
1. Click "Forgot Password"
2. Enter your email
3. Check your email for reset link
4. Follow the link and set new password

**Q: Can I delete my account?**
A: Yes, from Settings → Privacy:
1. Click "Delete Account"
2. Confirm deletion
3. All data is permanently removed (after 30-day grace period)

**Q: How many stories can I create?**
A: Unlimited! Create as many as you want.

### Performance

**Q: Why is the app slow?**
A: Check:
1. Internet connection speed
2. Browser cache (try clearing)
3. Number of open tabs
4. Device RAM availability
5. Backend server status

**Q: What if I lose internet connection while writing?**
A: Don't worry! Your work is:
- Auto-saved every 30 seconds
- Stored in browser cache
- Synced when connection returns
- Never lost due to internet issues

### AI Questions

**Q: How does the AI know about my story?**
A: Each time you interact with the AI, it:
- Reads the current content
- Checks previous chapters
- Analyzes character profiles
- Reviews chat history
- Builds a context window

**Q: Can I turn off AI suggestions?**
A: Yes! Go to Settings → AI Preferences and adjust:
- Suggestion frequency
- Suggestion type (Story, Poetry, Both)
- Auto-complete
- Character tracking

---

## 📞 Support & Community

- **Documentation:** This README and inline code comments
- **GitHub Issues:** Report bugs or request features
- **Email Support:** support@storybook.ai (coming soon)
- **Community Forum:** Discord server (coming soon)
- **Twitter:** @StorybookAI for updates

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with passion for writers and poets
- Inspired by the struggles of creative professionals
- Thanks to the open-source community for amazing tools

---

**Happy Writing! 📝✨**

Last Updated: May 23, 2026
