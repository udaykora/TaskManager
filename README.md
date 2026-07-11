# Task Manager

A full-stack task management application built as a take-home assignment.

## About This Project

This application was built to demonstrate a complete full-stack development workflow — from authentication and database design to REST API architecture and AI integration. The goal was to build something functional, clean, and well-structured within a short development window, while prioritizing code quality and a polished user experience.

## Core Features

- Full CRUD task management — create, read, update, and delete tasks
- Each task includes title, description, due date, priority, and status
- Filter tasks by status and priority
- Secure signup and login with Firebase Authentication
- Session persistence via HTTP-only cookies
- AI-powered task suggestions using Google Gemini
- Responsive design across mobile and desktop

## Tech Stack

Every technology below was chosen deliberately based on project requirements — developer velocity, type safety, and a smooth path from prototype to deployment.

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Ant Design, React Router

**Backend:** Node.js, Express.js, Cookie-based session auth

**Database:** Firebase Firestore

**Authentication:** Firebase Authentication, Firebase Admin SDK

**AI Integration:** Google Gemini API (gemini-2.5-flash)

**Deployment:** Firebase Hosting (Frontend), Render (Backend)

## Authentication & Security

User authentication is handled through Firebase Authentication, with passwords never touching the backend directly — verification happens client-side via the Firebase SDK, and the resulting ID token is verified server-side using the Firebase Admin SDK. Sessions are maintained through HTTP-only, secure cookies rather than storing tokens in browser storage, reducing exposure to XSS-based token theft.

## AI Integration

The task creation form includes an AI Suggest feature powered by Google's Gemini API. Given a rough task title, the model generates a clear description and a sensible priority level, which the user can accept or edit before saving. The API key is kept strictly on the backend and is never exposed to the client.

---

Built as part of a Full Stack Developer take-home assignment.
