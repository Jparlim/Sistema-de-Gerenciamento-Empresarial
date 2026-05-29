# Enterprise Management System - Backend

## About

Enterprise Management System is a backend application focused on business management and CRM automation.

The system was developed to help companies manage inventory, customers, financial information, and AI-assisted communication in a centralized platform.

One of the main features of the project is the customizable AI integration, allowing businesses to configure how the AI interacts with customers and collects important information during conversations.

The backend is responsible for:
- Inventory management
- Customer filtering and organization
- Financial data processing
- AI communication workflows
- WhatsApp integration
- Authentication and security
- Scheduling and visit management

---

## Main Features

### CRM Management
- Customer organization
- Contact history
- Business status tracking
- Filters by:
  - Day
  - Week
  - Month
  - Semester

### Inventory Control
- Product stock management
- Purchase price tracking
- Supplier management

### Financial System
- Company cash flow
- Monthly income and expenses
- Profit calculation

### AI Integration
- Configurable AI assistant
- Customer data capture during conversations
- Redis memory integration for AI context persistence

### Scheduling System
- Calendar-based visit management
- Daily appointments visualization

### WhatsApp Integration
- Twilio integration for WhatsApp communication testing

---

## Tech Stack

### Backend
- TypeScript
- Node.js
- Fastify

### Database
- PostgreSQL
- Prisma ORM

### Infrastructure
- Docker
- Redis

### External Services
- Twilio
- Gemini AI
- Ngrok

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open Prisma Studio:

```bash
npm run studio
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

JWT_SECRET=
JWT_REFRESH_SECRET=

GEMINI_API_KEY=

DATABASE_URL=

COOKIE_SECRET=
```

---

## Database

The project uses:
- PostgreSQL as the main database
- Redis for AI memory persistence
- Docker for database containerization

---

## API

Currently, the backend uses Ngrok to expose the localhost server publicly during development and testing.

Production API routes are still under development.

---

## Current Status

The project is currently focused on completing the CRM structure and core business functionalities.

---

## Domain

Official domain:

https://quantyum.com.br

---

## License

Private project.
