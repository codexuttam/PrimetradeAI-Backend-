# PrimeTrade AI - Scalable REST API & Dashboard

A professional-grade full-stack application featuring a Scalable REST API with Authentication, Role-Based Access Control (RBAC), and a premium React dashboard.

## Features
- **Backend**: Node.js/Express, MongoDB/Mongoose, JWT Auth, bcrypt, Helmet, CORS.
- **Frontend**: React (Vite), Glassmorphism UI, Lucide Icons, Context API/Hooks.
- **Security**: Password hashing, protected routes, input validation, RBAC (User/Admin).
- **Secondary Entity**: Task management (CRUD) with owner protection and admin overview.

## Getting Started

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` (already provided in this workspace)
4. `npm run dev` (Requires MongoDB running locally or a remote URI)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Scalability Note
To scale this application for production:
1. **Microservices**: Decouple Auth and Task modules into separate services communicating via RabbitMQ/Kafka.
2. **Caching**: Implement Redis for JWT blacklisting and frequently accessed tasks.
3. **Database Optimization**: Use indexing (already added on email), read replicas, and horizontal scaling (Sharding).
4. **Load Balancing**: Deploy behind Nginx or AWS ALB to distribute traffic across multiple instances.
5. **Containerization**: Use Docker and Kubernetes for orchestration and auto-scaling.
6. **Logging**: Integrate Winston or ELK stack for centralized logging and monitoring.
