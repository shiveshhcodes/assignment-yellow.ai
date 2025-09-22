# Chatbot Platform Backend

A minimal yet production-ready backend for a chatbot platform built with TypeScript, Fastify, Prisma, and PostgreSQL.

## Features

- 🔐 **Authentication**: JWT-based auth with registration and login
- 👤 **User Management**: User profiles and account management
- 📁 **Project Management**: Create and organize chatbot projects
- 📝 **Prompt Management**: Store and manage system prompts
- 💬 **Chat Interface**: Real-time chat with OpenAI/OpenRouter integration
- 📄 **File Upload**: Optional file upload with OpenAI Files API integration
- 🔒 **Security**: Password hashing, JWT tokens, input validation
- 🚀 **Scalable**: Multi-user support with proper data isolation

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas
- **AI Providers**: OpenAI GPT-3.5-turbo (default) or OpenRouter

## Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- OpenAI API key (or OpenRouter API key)

### Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

3. **Database setup**
   ```bash
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

### Environment Variables

Copy `env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅* |
| `OPENROUTER_API_KEY` | OpenRouter API key | ✅* |
| `AI_PROVIDER` | AI provider (`openai` or `openrouter`) | ❌ (default: `openai`) |
| `PORT` | Server port | ❌ (default: `3000`) |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ |

*Either `OPENAI_API_KEY` or `OPENROUTER_API_KEY` is required depending on `AI_PROVIDER`

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy
```

### Manual Docker Build

```bash
# Build image
docker build -t chatbot-backend .

# Run with external database
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e OPENAI_API_KEY="your-api-key" \
  chatbot-backend
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/me` - Get current user profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details

### Prompts
- `POST /api/projects/:projectId/prompts` - Add prompt to project
- `GET /api/projects/:projectId/prompts` - List project prompts

### Chat
- `POST /api/projects/:projectId/chat` - Send chat message
- `GET /api/projects/:projectId/messages` - Get chat history

### Files (Optional)
- `POST /api/projects/:projectId/files` - Upload file
- `GET /api/projects/:projectId/files` - List project files
- `DELETE /api/files/:fileId` - Delete file

### Health Check
- `GET /health` - Health check endpoint

## Development

### Database Operations

```bash
# Create and apply new migration
npx prisma migrate dev --name migration-name

# Reset database (development only)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Building for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Architecture

See [architecture.md](./architecture.md) for detailed information about the system design, data models, and request flow.

## Security Considerations

- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens are used for authentication
- API keys are never exposed to the frontend
- Input validation on all endpoints
- CORS protection
- SQL injection protection via Prisma

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Verify `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Check database credentials

2. **AI provider errors**
   - Verify API key is correct
   - Check API provider status
   - Ensure sufficient API credits

3. **File upload issues**
   - Check file size limits (10MB default)
   - Verify OpenAI API key for Files API
   - Check disk space

### Logs

The application uses structured logging. Set `LOG_LEVEL` environment variable to control verbosity:
- `error` - Only errors
- `warn` - Warnings and errors
- `info` - General information (default)
- `debug` - Detailed debugging

## License

ISC
