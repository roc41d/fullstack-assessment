# Todo App with Angular & Express
## Project Setup
- Prerequisites
- Docker
- Docker Compose
- Node.js (for development)

## Development Mode
- Start services: docker-compose -f docker-compose.dev.yml up
- Access:
  - Frontend: http://localhost:4200
  - Backend: http://localhost:3000

## Project Structure
```
root/
├── todo-backend/    # Express API (TypeScript)
├── todo-frontend/   # Angular application
└── docker-compose.dev.yml
```

## Environment Variables
 - Backend: Set in todo-backend/.env
- rontend: Configure in todo-frontend/src/environments/