# PrimeTrade Backend API Documentation

## Auth Endpoints
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user & get token
- `GET /api/v1/users/profile` - Get user profile (Requires JWT)

## Task Endpoints
- `GET /api/v1/tasks` - Get user tasks (Requires JWT)
- `POST /api/v1/tasks` - Create a task (Requires JWT)
- `PUT /api/v1/tasks/:id` - Update a task (Requires JWT)
- `DELETE /api/v1/tasks/:id` - Delete a task (Requires JWT)
- `GET /api/v1/tasks/admin` - View all tasks from all users (Requires JWT + Admin role)

## Security
- JWT Authentication
- Password Hashing (bcrypt)
- RBAC (User/Admin)
- Security Headers (Helmet)
- CORS enabled
