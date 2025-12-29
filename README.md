# Frontend Web – Next.js Application

## 📌 Overview

This project is a **frontend web application** built with **Next.js** and **React**.
It consumes a backend API via **HTTP (Axios)** and is designed to be deployed using
standard CI/CD pipelines without Docker.

---

## 🧱 Technical Stack

- Next.js
- React
- TypeScript
- Axios
- Tailwind CSS
- Radix UI

---

## 📋 System Requirements

- Node.js >= 20.x
- npm >= 9.x
- Git

---

## 🌍 Environment Variables

Required environment variables:

NEXT_PUBLIC_API_URL=https://api.example.com

> Variables are injected at build time. Any change requires rebuilding the app.

---

## 📁 Setup & Build

Clone the repository:

git clone <repository-url>
cd <project-folder>

Install dependencies:

npm ci

Build the application:

npm run build

Start the application:

npm run start

Default URL: http://localhost:3000

---

## 🚀 CI/CD Commands

npm ci
NEXT_PUBLIC_API_URL=https://api.example.com npm run build
npm run start

---

## 🔐 Authentication & Multi-Tenancy

All API requests include:
- Authorization: Bearer <JWT>
- X-Tenant: <tenant-id>

Headers are injected automatically using Axios interceptors.

---

## ⚠️ Notes

- No Docker required
- Rebuild required for config changes
- Use a process manager in production (PM2, systemd, etc.)

---

## ✅ Ready for Production

This README is generic, OS-independent, and CI/CD friendly.
