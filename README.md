# Role-Based Assignment and Submission Management System

A full-stack MERN application for managing assignments, student submissions, grading, and role-based access for **Admin**, **Teacher**, and **Student** users.

The project was developed as part of the **Assistant Software Engineer Recruitment Project** for OnnoRokom Projukti Limited.

---

## Features

### Authentication and Authorization

- JWT-based authentication
- Password hashing with bcrypt
- Persistent frontend authentication using local storage
- Role-based route protection on the frontend
- Role-based authorization enforced by the backend

### Admin

Administrators can:

- Create users
- View all users
- Edit users
- Delete users
- View all assignments
- Edit assignments
- Publish draft assignments
- Delete assignments
- View all submissions

### Teacher

Teachers can:

- Create assignments
- View their own assignments
- Edit their own assignments
- Publish assignments
- Delete their own assignments
- View submissions for their own assignments
- Assign marks
- Provide feedback

### Student

Students can:

- View published assignments for their own course
- Submit answers before the deadline
- Update their own submission before the deadline
- View their existing submissions
- View marks
- View teacher feedback

---

## Important Business Rules

The backend enforces the application's important rules rather than relying only on frontend restrictions.

Examples include:

- Students only see published assignments for their own course.
- Students cannot submit to assignments belonging to another course.
- Students cannot submit to unpublished assignments.
- Students cannot create more than one submission for the same assignment.
- Students cannot create or update submissions after the assignment deadline.
- Students can only update their own submissions.
- Teachers can only manage assignments they created.
- Teachers can only view and grade submissions belonging to their own assignments.
- Marks must be between `0` and the assignment's maximum marks.
- Admin-only operations are protected by backend role authorization.

---

## Technology Stack

### Frontend

- React
- React Router
- Zustand
- Axios
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv
- CORS

---

## Project Structure

```text
Role_Based_Assigment_and_Submission_Management_System/
│
├── Backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB

You may use either:

- a local MongoDB instance, or
- MongoDB Atlas

---

## Environment Variables

Create a `.env` file for the backend.

### `Backend/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a `.env` file for the frontend.

### `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Do **not** commit real database credentials or JWT secrets to the repository.

---

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/arko1995/Role_Based_Assigment_and_Submission_Management_System.git
cd Role_Based_Assigment_and_Submission_Management_System
```

### 1. Install Backend Dependencies

```bash
cd Backend
npm install
```

Create the backend `.env` file using the environment variables described above.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

unless another `PORT` is configured.

---

### 2. Install Frontend Dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

Create the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL displayed by Vite in the terminal.

---

## Production Build

To verify that the frontend builds successfully:

```bash
cd Frontend
npm run build
```

The frontend has been verified to compile successfully with the Vite production build.

---

## Demo Credentials

The following credentials are intended only for evaluating the application.

> **Replace the placeholders below with the final demo accounts before submission. Use dedicated demo passwords that are not reused anywhere else.**

| Role | Email | Password |
|---|---|---|
| Admin | `ADMIN_EMAIL_HERE` | `ADMIN_PASSWORD_HERE` |
| Teacher | `TEACHER_EMAIL_HERE` | `TEACHER_PASSWORD_HERE` |
| Student | `STUDENT_EMAIL_HERE` | `STUDENT_PASSWORD_HERE` |

### Important

The accounts listed above must actually exist in the MongoDB database used to evaluate the project.

For a fully reproducible fresh setup, a database seed script should be provided that creates these demo users automatically. Do not place a real MongoDB connection string or other private credentials in this README.

---

## API Overview

The backend API is organized under the following routes:

```text
/api/auth
/api/users
/api/assignment
/api/submissions
```

### Authentication

```text
POST /api/auth/login
```

### Users

Admin-only user management:

```text
GET    /api/users
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Assignments

Assignment operations include:

- listing assignments according to the logged-in user's role
- creating assignments
- updating assignments
- publishing assignments
- deleting assignments

Authorization and ownership rules are enforced on the backend.

### Submissions

Submission operations include:

- student submission creation
- student submission updates
- viewing a student's own submissions
- viewing submissions for a teacher's assignment
- grading and feedback
- admin view of all submissions

---

## Frontend State Management

Zustand is used for shared application and server state.

The main stores are:

```text
authStore
assignmentStore
submissionStore
userStore
```

Local React state is used for page-specific UI state such as forms, editing state, selected assignments, marks, feedback, and status messages.

---

## Authorization Design

Frontend protected routes are used to improve user experience, but they are **not treated as the security boundary**.

Actual authorization is enforced by the Express backend using JWT authentication, role checks, resource ownership checks, course validation, and deadline validation.

This means manually navigating to another role's frontend route does not grant permission to protected backend resources.

---

## Data Model Overview

### User

Important fields include:

```text
name
email
password
role
course
```

The available roles are:

```text
admin
teacher
student
```

A course is required for students.

### Assignment

Important fields include:

```text
title
description
course
subject
deadline
maxMarks
status
createdBy
```

Assignment status can be:

```text
draft
published
```

### Submission

Important fields include:

```text
assignment
student
answer
marks
feedback
```

A unique database index prevents a student from creating multiple submissions for the same assignment.

---

## Design Decisions

### Course and Subject Representation

For this implementation, courses and subjects are represented directly as values on users and assignments instead of introducing separate Course and Subject collections.

This keeps the project focused on the core assignment/submission workflow while still supporting course-based filtering and assignment subject information.

### Teacher Ownership

Assignments store the teacher who created them through `createdBy`.

Teachers can manage and grade only assignments that they own.

### Shared State

Separate role-specific frontend stores were intentionally avoided. Shared resources use resource-oriented Zustand stores instead:

```text
authStore
assignmentStore
submissionStore
userStore
```

---

## Testing

The application has been manually exercised during development, and the frontend production build can be verified using:

```bash
cd Frontend
npm run build
```

Automated backend tests are **not yet included in the current repository**.

Before final submission, automated tests should be added for the most important backend rules, particularly:

- role-based authorization
- course-based submission restrictions
- duplicate submission prevention
- assignment deadline enforcement
- submission ownership
- teacher assignment ownership
- grading limits

Once the test suite is added, this section should be updated with the exact command for running it.

---

## Known Limitations / Scope Decisions

The application focuses on the core workflow requested by the assignment.

Current scope decisions include:

- Courses and subjects are stored directly rather than managed through separate CRUD modules.
- Teacher-to-class/subject assignment is represented through assignment ownership rather than a separate allocation system.
- Submission state is derived from submission/grading data rather than a separate persisted submission-status field.
- No pagination is implemented.
- No notification system is implemented.
- No Docker configuration is included.
- No live deployment is included.
- Automated backend tests are planned but are not yet included.

These choices keep the application focused on authentication, authorization, assignment management, submissions, deadlines, grading, and feedback.

---

## Security Notes

- Passwords are hashed using bcrypt.
- JWT is used for authenticated API access.
- Protected backend routes require a valid Bearer token.
- Role checks are enforced server-side.
- Resource ownership is checked for teacher and student operations.
- Environment secrets are kept outside source code using `.env`.
- Real `.env` files should never be committed.

---

## Submission Notes

Before submitting the repository:

1. Replace the demo credential placeholders with real demo accounts.
2. Ensure those accounts exist in the database available to the evaluator.
3. Add `.env.example` files for the frontend and backend.
4. Add and run the required automated backend tests.
5. Run the frontend production build:

```bash
cd Frontend
npm run build
```

6. Perform a final login check for Admin, Teacher, and Student roles.

---

## Author

**Shahriar Sohel Arko**

GitHub: `arko1995`
