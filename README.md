# Ecommerce Backend — NestJS

REST API for the ecommerce platform, built with **NestJS** + **TypeScript** and **PostgreSQL** via **Prisma ORM**. Serves the [ecommerce-frontend-angular](https://github.com/yclicourt/ecommerce-frontend-angular) storefront (Angular 18).

## ✨ Features

- JWT authentication & user management
- Products & categories
- Cart & order flow
- PayPal payment integration
- Order confirmation emails (Nodemailer)
- Interactive API docs with Swagger
- Unit & e2e tests with Jest

## 🛠️ Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT
- **Payments:** PayPal REST API
- **Emails:** Nodemailer (Gmail SMTP)
- **API docs:** Swagger / OpenAPI
- **Testing:** Jest

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### Installation

```bash
git clone https://github.com/yclicourt/ecommerce-backend.git
cd ecommerce-backend
npm install
```

### Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="change-me"
PORT=4000
PAYPAL_API_CLIENT="your-paypal-client-id"
PAYPAL_API_SECRET="your-paypal-client-secret"
PAYPAL_API="https://api-m.sandbox.paypal.com"
ORIGIN_CLIENT="http://localhost:4200"
BRAND_NAME="My Store"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="you@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM_EMAIL="you@gmail.com"
```

### Database

```bash
npx prisma migrate dev
```

### Run locally

```bash
npm run start:dev   # watch mode -> http://localhost:4000
```

## 📖 API documentation

Swagger UI is available at `http://localhost:4000/api/v1/docs` once the server is running.

![Swagger API documentation](./uploads/doc_back_swagger.png)

## ✅ Tests

```bash
npm run test        # unit tests
npm run test:cov    # coverage report
npm run test:e2e    # e2e tests
```

## 🤝 Related repositories

- [ecommerce-frontend-angular](https://github.com/yclicourt/ecommerce-frontend-angular) — Angular 18 storefront for this API

## 📄 License

MIT
