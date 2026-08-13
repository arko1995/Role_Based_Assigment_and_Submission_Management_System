# Role-Based Assignment and Submission Management System

## Demo Credentials

| Role    | Email                        | Password   |
| ------- | ---------------------------- | ---------- |
| Admin   | `testemail@gmail.com`        | `test1234` |
| Teacher | `testteacheremail@gmail.com` | `test1234` |
| Student | `teststudentemail@gmail.com` | `test1234` |

Student course: `testCourse`

## Overview

A MERN application for managing assignments, submissions, grading, feedback, and role-based access.

## Roles

### Admin

- Create, view, edit, and delete users
- View, edit, publish, and delete assignments
- View all submissions

### Teacher

- Create, edit, publish, and delete own assignments
- View submissions for own assignments
- Give marks and feedback

### Student

- View published assignments for own course
- Submit and update answers before the deadline
- View marks and feedback

## Tech Stack

Frontend:

- React
- React Router
- Zustand
- Axios
- Tailwind CSS
- Vite

Backend:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
.
├── Backend/
├── Frontend/
└── README.md
```

## Environment Variables

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Example files should also be included as:

```text
Backend/.env.example
Frontend/.env.example
```

## Run Locally

Clone the repository:

```bash
git clone https://github.com/arko1995/Role_Based_Assigment_and_Submission_Management_System.git
cd Role_Based_Assigment_and_Submission_Management_System
```

Start the backend:

```bash
cd Backend
npm install
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend
npm install
npm run dev
```

## Production Build

```bash
cd Frontend
npm run build
```

## Notes

- Backend authorization is enforced using JWT and role checks.
- Students can only access published assignments for their own course.
- Students cannot submit or update after the deadline.
- Duplicate submissions are prevented.
- Teachers can only manage and grade their own assignments.
- Courses and subjects are stored directly on users and assignments instead of separate collections.
