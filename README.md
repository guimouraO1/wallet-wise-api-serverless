# Wallet Wise API

Wallet Wise API is a RESTful backend solution for personal finance management. With this project, you can create users, authenticate via JWT, manage accounts, record transactions, handle bills (payable/receivable), and much more.

---

## 📚 Technologies

* **Node.js v20**
* **TypeScript**
* **Fastify** for high-performance web framework
* **Prisma** ORM for PostgreSQL
* **Zod** for schema validation and type-safe parsing
* **Luxon** for date and time handling
* **Winston + Daily Rotate File** for application logging
* **JWT (RS256)** for authentication and refresh tokens
* **Vercel** for serverless deployment

---

## 🚀 Getting Started

### Prerequisites

* Node.js v20
* PostgreSQL (running and accessible)
* Git

### Installation

```bash
# Clone the repository
git clone https://github.com/guimouraO1/wallet-wise-api.git
cd wallet-wise-api

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# General
NODE_ENV=dev         # dev | production | test
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT (RS256)
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----..."
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
JWT_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
JWT_ALGORITHM=RS256

# Cookie & Refresh Token
REFRESH_TOKEN_NAME=refreshToken
COOKIE_SECRET=your_cookie_secret
```

> ⚠️ **Important**: Generate RSA 2048+ key pairs for `JWT_PUBLIC_KEY` and `JWT_PRIVATE_KEY`.

### Prisma Setup and Migrations

After setting `DATABASE_URL`, run:

```bash
# Generate Prisma client
npx prisma generate

# Apply existing migrations
npx prisma migrate deploy
```

---

## 🛠️ Useful Scripts

| Command                | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Run in development mode with watch (tsx)              |
| `npm run build`        | Bundle project (tsup)                                 |
| `npm start`            | Start server in production (dist)                     |
| `npm test`             | Run unit tests (Vitest)                               |
| `npm run vercel-build` | Production pipeline (`prisma migrate deploy` + build) |

---

---

## 📑 Main Endpoints

Full documentation available at: [https://wallet-wise-api-vercel.vercel.app/docs](https://wallet-wise-api-vercel.vercel.app/docs)

---

## 🧪 Testing

This project uses **Vitest** for unit testing. To run tests:

```bash
npm test
```

Coverage reports and test logs will be displayed in the console.

---

## 📦 Deployment

The project is configured for **Vercel** deployment using `vercel-build`.


## 📝 License

This project is licensed under the **ISC License**.

---

## 👤 Author

Guilherme de Moura Oliveira - 2026
