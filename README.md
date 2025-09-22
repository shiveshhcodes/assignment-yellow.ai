# AI Chatbot Platform

A full-stack chatbot platform for creating and managing AI-powered conversational agents.

**Repository:** https://github.com/shiveshhcodes/assignment-yellow.ai

**Features:**
- User authentication and project management
- Custom prompts for chatbot personalities 
- Real-time chat interface with AI
- Multi-AI provider support (Gemini, OpenAI, OpenRouter)
- Message history and file upload support

## Technologies Used

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui

**Backend:** Node.js, Fastify, TypeScript, Prisma ORM, PostgreSQL

**AI:** Google Gemini API

**Deployment:** Vercel

## Prerequisites

- Node.js 18+ - https://nodejs.org/
- Git - https://git-scm.com/
- Code editor (VS Code recommended)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/shiveshhcodes/assignment-yellow.ai.git
cd assignment-yellow.ai
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create your environment file:
```bash
cp env.example .env
```

Edit the `.env` file with these exact values:
```env
DATABASE_URL="postgres://ae832b5b2047e3088f79bbf2c076af9885a3ec01ca7f9feacde9d0dc4f1a0cee:sk_oezHJh3kExeXm-O5QNYGB@db.prisma.io:5432/postgres?sslmode=require"
JWT_SECRET="058b24e003c3e69ec886e3fead4233db388ae91f362b9be2b8a09d007b7adde8dd59d98ce2b37d10b95f885a42a6038952dddb9afdcc3429a643f3d6ef47b5dd"
JWT_EXPIRES_IN="7d"
AI_PROVIDER="gemini"
GEMINI_API_KEY="AIzaSyBkDmbTzos2Z1ebpaDFM_1eC_WaMFzJXFU"
PORT=3000
HOST="0.0.0.0"
NODE_ENV="development"
FRONTEND_URL="http://localhost:8080"
```

Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

The frontend will automatically connect to your backend running on port 3000.

## Running the Application

Start both servers in development mode:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Your application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/health

## How to Use

1. **Create Account** - Register with email and password
2. **Create Project** - Make a new chatbot project  
3. **Add Prompts** - Define your chatbot's personality and behavior
4. **Start Chatting** - Open the chat interface and talk to your AI
5. **Manage Projects** - Create multiple chatbots for different purposes

## Project Structure

```
assignment-yellow.ai/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
├── backend/           # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
└── vercel.json
```

## API Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project

### Prompts
- `GET /api/projects/:id/prompts` - List prompts
- `POST /api/projects/:id/prompts` - Create prompt
- `DELETE /api/prompts/:id` - Delete prompt

### Chat
- `POST /api/projects/:id/chat` - Send message
- `GET /api/projects/:id/messages` - Get history

## Deployment

For Vercel deployment:
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## License

MIT License
