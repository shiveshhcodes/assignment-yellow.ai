# Architecture & Design

## Overview

This is a full-stack chatbot platform where users can create and manage AI chatbots. I built it with React on the frontend, Node.js/Fastify for the backend, and PostgreSQL for data storage. The goal was to keep things simple but scalable.

## Architecture

```
Frontend (React) <--> Backend (Node.js) <--> Database (PostgreSQL)
                            |
                            v
                      AI APIs (Gemini)
```

Pretty straightforward - the React app talks to my Node.js API, which handles data in PostgreSQL and makes calls to AI providers when users chat with their bots.

## Frontend

I used React 18 with TypeScript because I wanted type safety and modern hooks. The file structure is pretty standard:

```
src/
├── components/ui/     # UI components from shadcn/ui
├── pages/            # Different pages (login, dashboard, chat, etc)
├── hooks/            # Custom hooks
└── lib/              # Utils and configs
```

**Tech choices:**
- Vite for fast dev builds
- Tailwind for styling (way faster than writing CSS)
- Shadcn/ui for nice looking components out of the box
- React Router for navigation
- React Query for API calls and caching

**State management:** 
- Local component state with useState
- Server state with React Query (handles caching automatically)
- Auth token in localStorage (simple but works)
- Forms with React Hook Form + Zod validation

## Backend

I went with Node.js + Fastify instead of Express because it's faster and has better TypeScript support. The structure is pretty clean:

```
src/
├── routes/        # API endpoints (/auth, /projects, /chat, etc)
├── services/      # Business logic (where the real work happens)
├── middleware/    # Auth checks, error handling
├── utils/         # JWT, validation, crypto stuff
└── db/            # Prisma client setup
```

**Why these choices:**
- Fastify over Express (better performance, native TypeScript)
- Prisma ORM (type-safe database queries, great dev experience)
- JWT for auth (stateless, works great with serverless)
- Bcrypt for password hashing (industry standard)
- Zod for input validation (catches bad data early)

The flow is: Routes → Services → Database. Keeps things organized and testable.

## Database

I kept the database schema pretty simple. Here's how the data relates:

```
Users → Projects → Prompts/Messages/Files
```

**Main tables:**
- **Users**: Basic auth stuff (email, password hash, name)
- **Projects**: Each user can have multiple chatbot projects
- **Prompts**: Custom instructions for each project's AI personality
- **Messages**: Chat history (user messages + AI responses)
- **Files**: File uploads associated with projects

I'm using CUIDs for IDs (better than UUIDs for databases) and PostgreSQL because it's reliable and Prisma works great with it. The relationships are straightforward foreign keys - a user owns projects, projects contain prompts/messages/files.

## AI Integration

I built this to support multiple AI providers, but currently I'm using Google Gemini (free tier is generous). The adapter pattern makes it easy to add OpenAI or others later:

```typescript
interface ProviderAdapter {
  createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse>
}
```

When a user chats:
1. I grab all the project's custom prompts and combine them into system context
2. Add recent conversation history 
3. Send it all to the AI provider
4. Save the response and return it

The tricky part was handling token limits - I truncate older messages when the context gets too long.

## Security

I tried to cover the basics without over-engineering:

**Authentication:**
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for stateless auth (good for serverless)
- Middleware checks auth on protected routes

**Other security stuff:**
- Zod validates all inputs (prevents weird data from breaking things)
- Prisma prevents SQL injection automatically
- React handles XSS protection
- CORS configured properly
- Rate limiting on API endpoints (TODO: need to implement this)

## Performance & Scaling

Since I built this to run on Vercel's serverless functions, scaling happens automatically. Some decisions that help:

- JWT auth (no server sessions to worry about)
- Prisma connection pooling (handles DB connections efficiently)
- React Query caching (reduces API calls)
- Vite code splitting (only loads what's needed)

The biggest bottleneck will probably be the AI API calls, but those are external so not much I can do there. Database queries are optimized and I've got proper indexes on foreign keys.

## Deployment

I'm using Vercel for everything:

- **Frontend**: Static React build served from their CDN
- **Backend**: Serverless functions (each API route becomes a lambda)
- **Database**: Hosted PostgreSQL (using Prisma's free tier)
- **CI/CD**: Auto-deploys when I push to main branch

The `vercel.json` config was a bit tricky to get right - had to make sure both frontend and backend dependencies install correctly during build.

## How It Works

**User signup/login:**
1. User enters email/password
2. Backend hashes password and stores user
3. Returns JWT token
4. Frontend stores token for future requests

**Creating a chatbot:**
1. User creates a project (gives it a name/description)
2. Adds custom prompts to define the bot's personality
3. Starts chatting

**Chat flow:**
1. User types message in chat UI
2. Frontend sends to `/api/projects/:id/chat` with auth token
3. Backend grabs all project prompts + recent messages
4. Calls AI API with combined context
5. Saves response to database
6. Returns AI response to frontend
7. Chat UI updates in real-time

## Error Handling

I tried to handle errors gracefully:

**Frontend:**
- React Query retries failed requests automatically
- Form validation with helpful error messages
- If auth token expires, redirect to login
- Error boundaries catch crashes and show fallback UI

**Backend:**
- Global error handler catches everything
- Zod validation gives specific error messages
- Database errors are mapped to user-friendly responses
- If AI API fails, return a helpful error message

Could probably add more sophisticated error tracking (like Sentry) but this covers the basics.

## What's Next

Some ideas for future improvements:

**Features I want to add:**
- Analytics dashboard (see how people use their bots)
- Team collaboration (share projects with others)
- More AI providers (OpenAI, Anthropic, etc.)
- Better file handling (PDFs, images)
- Mobile app (React Native probably)
- Webhooks for integrations

**Technical debt to fix:**
- Add proper rate limiting
- Better error tracking (Sentry or similar)
- Automated testing (I know, I know...)
- Better caching strategy
- Database migrations in production

The architecture is flexible enough that most of these should be straightforward to add. The adapter pattern for AI providers makes adding new ones easy, and the clean separation of frontend/backend means I can work on them independently.
