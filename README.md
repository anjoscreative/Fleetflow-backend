# 🚚 FleetFlow Logistics Backend (NestJS + Postgres + Redis)

### A full-scale logistics & fintech backend system built to demonstrate production-level skills in NestJS, TypeORM, PostgreSQL, Redis, and cloud integration.

---

## 🧱 Tech Stack
- **Backend Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (Supabase)
- **Cache / Queue:** Redis (Upstash)
- **ORM:** TypeORM
- **Auth:** JWT + Role-based Guard
- **Integrations:**
  - Virtual Accounts & Webhooks
  - SMS / Email / WhatsApp APIs
  - Receipt Printers & Scanners
  - Face Recognition
- **Security:** Device API Keys + HMAC Signatures
- **Offline Mode:** Redis Queue Replay

---

## 📦 Features
- Multi-role Authentication (Admin, Driver, Operator)
- Shipment Management (Create, Update, Track)
- Vehicle & Driver Registry
- Virtual Account Simulation + Transaction Logs
- Real-time Notifications via SMS / WhatsApp
- Device Authentication (Printers, Scanners, Face Devices)
- Offline Sync + Replay via Redis Queue
- Secure APIs with signature-based validation

---

## 🛠 Setup

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/fleetflow-backend.git
cd fleetflow-backend
npm install
