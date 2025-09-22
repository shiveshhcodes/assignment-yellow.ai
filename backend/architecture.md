# Architecture Overview

This document provides a comprehensive overview of the chatbot platform backend architecture, design decisions, and data flow.

## System Design

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │    Backend      │    │   Database      │
│   (Not impl.)   │◄──►│   Fastify API   │◄──►│  PostgreSQL     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │  AI Providers   │
                       │ OpenAI/OpenRouter│
                       └─────────────────┘
```

### Core Components

1. **API Layer** (Fastify + Routes)
   - RESTful endpoints
   - Request validation (Zod)
   - Authentication middleware
   - Error handling

2. **Service Layer** (Business Logic)
   - User management
   - Project operations
   - Chat orchestration
   - File handling

3. **Data Layer** (Prisma + PostgreSQL)
   - ORM abstraction
   - Type-safe database operations
   - Migration management

4. **External Integrations**
   - AI provider adapters
   - File storage (OpenAI Files API)

## Data Model

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────►│   Project   │────►│   Prompt    │
│             │ 1:N │             │ 1:N │             │
│ id          │     │ id          │     │ id          │
│ email       │     │ userId (FK) │     │ projectId   │
│ passwordHash│     │ name        │     │ title       │
│ name        │     │ description │     │ content     │
│ createdAt   │     │ createdAt   │     │ createdAt   │
└─────────────┘     └─────────────┘     └─────────────┘
                            │
                            │ 1:N
                            ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Message   │     │    File     │
                    │             │     │             │
                    │ id          │     │ id          │
                    │ projectId   │◄────│ projectId   │
                    │ role        │ 1:N │ filename    │
                    │ content     │     │ storageUrl  │
                    │ createdAt   │     │ providerId  │
                    └─────────────┘     │ createdAt   │
                                        └─────────────┘
```

### Database Schema Details

#### Users Table
- **Purpose**: Store user accounts and authentication data
- **Key Fields**: 
  - `email` (unique) - User identification
  - `passwordHash` - bcrypt-hashed password
  - `name` - Display name

#### Projects Table
- **Purpose**: Organize chatbots/agents under users
- **Key Fields**:
  - `userId` (FK) - Owner reference
  - `name` - Project identifier
  - `description` - Optional project details

#### Prompts Table
- **Purpose**: Store system prompts that define agent behavior
- **Key Fields**:
  - `projectId` (FK) - Project association
  - `title` - Prompt identifier
  - `content` - System prompt text

#### Messages Table
- **Purpose**: Store conversation history
- **Key Fields**:
  - `projectId` (FK) - Conversation context
  - `role` - Message sender (user/assistant/system)
  - `content` - Message text

#### Files Table (Optional)
- **Purpose**: Track uploaded files and AI provider references
- **Key Fields**:
  - `projectId` (FK) - File association
  - `storageUrl` - File location
  - `providerFileId` - OpenAI Files API reference

## Request Flow

### Authentication Flow

```
1. User Registration/Login
   ┌─────────┐    ┌──────────────┐    ┌─────────────┐
   │ Client  │───►│ AuthService  │───►│ Database    │
   └─────────┘    └──────────────┘    └─────────────┘
        │               │                     │
        │               ▼                     │
        │         Hash Password               │
        │               │                     │
        │               ▼                     ▼
        │         Generate JWT          Store User
        │               │                     │
        │◄──────────────┘                     │
        │                                     │
        │          Return Token               │
        └─────────────────────────────────────┘

2. Authenticated Requests
   ┌─────────┐    ┌─────────────────┐    ┌──────────┐
   │ Client  │───►│ AuthMiddleware  │───►│ Route    │
   │(+Bearer)│    │                 │    │ Handler  │
   └─────────┘    └─────────────────┘    └──────────┘
                           │
                           ▼
                    Verify JWT Token
                           │
                           ▼
                   Extract User Context
```

### Chat Flow

```
1. User sends message
   ┌─────────┐    ┌─────────────┐    ┌──────────────┐
   │ Client  │───►│ ChatService │───►│ ProjectCheck │
   └─────────┘    └─────────────┘    └──────────────┘
                           │
                           ▼
2. Build conversation context
   ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
   │ Get Prompts  │───►│Get Messages │───►│Build Context │
   └──────────────┘    └─────────────┘    └──────────────┘
                                                   │
                                                   ▼
3. Call AI provider
   ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
   │ Save User    │◄───│ProviderAdapter  │───►│ OpenAI/      │
   │ Message      │    │                 │    │ OpenRouter   │
   └──────────────┘    └─────────────────┘    └──────────────┘
           │                    │
           ▼                    ▼
4. Save and return response
   ┌──────────────┐    ┌─────────────────┐
   │ Save AI      │───►│ Return Response │
   │ Response     │    │ to Client       │
   └──────────────┘    └─────────────────┘
```

## Security Design

### Authentication & Authorization

1. **Password Security**
   - bcrypt hashing with 12 salt rounds
   - No plaintext password storage
   - Password complexity handled by frontend

2. **JWT Tokens**
   - Stateless authentication
   - Configurable expiration (default: 7 days)
   - User context in payload (`userId`, `email`)

3. **Data Isolation**
   - Users can only access their own projects
   - Project ownership verification on all operations
   - No cross-user data leakage

### Input Validation

1. **Schema Validation** (Zod)
   - All request bodies validated
   - Type safety with TypeScript
   - Custom error messages

2. **Parameter Validation**
   - Route parameters validated
   - Query string validation
   - File upload restrictions

### Error Handling

1. **Centralized Error Handler**
   - Consistent error responses
   - Security-safe error messages
   - Detailed logging for debugging

2. **Error Types**
   - Validation errors (400)
   - Authentication errors (401)
   - Authorization errors (403)
   - Not found errors (404)
   - Conflict errors (409)
   - Server errors (500)

## Provider Adapter Pattern

### Design Goals
- Support multiple AI providers
- Easy provider switching
- Consistent interface
- Error handling abstraction

### Implementation
```typescript
interface ProviderAdapter {
  createChatCompletion(messages: ChatMessage[]): Promise<ChatCompletionResponse>
}

class OpenAIAdapter implements ProviderAdapter { ... }
class OpenRouterAdapter implements ProviderAdapter { ... }
```

### Provider Selection
- Environment variable `AI_PROVIDER` controls selection
- Factory pattern for instantiation
- Runtime provider switching capability

## Scalability Considerations

### Database Design
- Indexed foreign keys for query performance
- Cascading deletes for data consistency
- Pagination support in API endpoints

### Connection Management
- Prisma connection pooling
- Graceful shutdown handling
- Health check endpoints

### Caching Strategy (Future)
- User session caching
- Prompt caching for frequently used projects
- Message history caching

### Horizontal Scaling (Future)
- Stateless service design
- JWT tokens (no server-side sessions)
- Database connection pooling
- Load balancer ready

## Performance Optimizations

### Database Queries
- Selective field loading with Prisma `select`
- Efficient relationship loading with `include`
- Query result counting with `_count`

### API Response Times
- Minimal data transfer
- Efficient JSON serialization
- Request/response compression (Fastify default)

### AI Provider Calls
- Timeout configurations
- Retry mechanisms (future enhancement)
- Response streaming support (future enhancement)

## Monitoring & Observability

### Logging
- Structured logging with Fastify
- Configurable log levels
- Error stack traces
- Request/response logging

### Health Checks
- Database connectivity check
- Service health endpoint (`/health`)
- Docker health check support

### Metrics (Future Enhancements)
- Request/response times
- AI provider response times
- Database query performance
- Error rates

## Development Workflow

### Database Migrations
1. Schema changes in `schema.prisma`
2. Generate migration: `npx prisma migrate dev`
3. Apply to production: `npx prisma migrate deploy`

### Code Organization
- Routes: HTTP endpoint definitions
- Services: Business logic implementation
- Middleware: Cross-cutting concerns
- Utils: Shared utilities

### Testing Strategy (Future)
- Unit tests for services
- Integration tests for API endpoints
- Database testing with test containers
- AI provider mocking

## Deployment Strategy

### Environment Management
- Development: Local PostgreSQL + file env
- Staging: Docker Compose setup
- Production: Container orchestration (K8s/Docker Swarm)

### Container Design
- Multi-stage Docker build
- Minimal Alpine Linux base
- Health checks included
- Graceful shutdown support

### Database Management
- Migration-based schema updates
- Backup and restore procedures
- Connection pooling configuration
- Read replica support (future)

This architecture provides a solid foundation for a production chatbot platform while maintaining simplicity and extensibility for future enhancements.
