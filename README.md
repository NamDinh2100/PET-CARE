# PetCareUS - Pet Care Management System

PetCareUS is a role-based web application for managing pet care operations, including customer booking, veterinarian treatment workflows, and admin-side service, medicine, invoice, and analytics management.

## Project Overview

This project is built with Node.js, Express, Handlebars, and PostgreSQL (via Knex). The system supports three main roles:

- Customer: manage pets, book appointments, view treatment/invoice details, and pay invoices.
- Veterinarian: view assigned appointments, record medical data, prescribe medicines, and complete appointments.
- Admin: manage customers, employees, appointments, services, medicines, invoices, and service-based revenue statistics.

The app uses server-side rendered views and session-based authentication/authorization.

## Features

- Authentication and account management
- Customer sign up, sign in, sign out
- Forgot-password flow with generated password sent via email
- Profile update and password change
- Role-based authorization
- Route guards for customer, veterinarian, and admin roles
- Customer workflows
- Pet profile management
- Appointment booking with multiple services
- Appointment filtering (all, upcoming, past)
- Cancel scheduled appointments
- View invoice details and pay invoices
- View medicine records by appointment
- Veterinarian workflows
- View assigned schedule and appointment list
- Create medical records and prescriptions
- Attach medicines to prescriptions
- Update appointment status to completed
- Auto-generate invoice after treatment completion
- Admin workflows
- Manage customers and employees
- Create/edit services and medicines
- Confirm and assign appointments
- Manage invoice payment status, payment method, and discount
- Revenue analytics dashboard (pie/bar charts) with CSV export
- Search, filter, and pagination
- Search support across key admin modules
- Paged listing in management screens

## Tech Stack

- Backend
- Node.js (ES Modules)
- Express 5
- Express Session
- BcryptJS
- Dotenv
- Database
- PostgreSQL
- Knex query builder
- pg driver
- Templating and UI
- Express Handlebars
- express-handlebars-sections
- Bootstrap 5
- Bootstrap Icons
- Font Awesome
- SweetAlert2
- Chart.js
- Email
- Nodemailer (Gmail transporter)
- Development tooling
- Nodemon

## Installation

### Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL database
- A Gmail account with App Password for email notifications

### 1. Clone and enter the project

```bash
git clone <your-repository-url>
cd PET-CARE/src
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (`src/`) with the following keys:

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=replace-with-a-long-random-secret

# Option 1 (recommended for cloud):
DATABASE_URL=postgres://user:password@host:5432/database
DB_SSL=true

# Option 2:
DB_CLIENT=pg
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

EMAIL_USER=your-gmail-address
EMAIL_PASS=your-gmail-app-password
```

### 4. Prepare database schema

This repository currently does not include migration files. Create/seed your PostgreSQL schema before running the app.

Expected core tables:

- users
- pets
- services
- medicines
- appointments
- appointment_services
- medical_records
- prescription
- prescription_medicine
- invoices

### 5. Run the application

```bash
# development
npm run dev

# production-like
npm start
```

Open: `http://localhost:3000`

## Dynamic Deployment (Render)

This project is a dynamic Node.js app and should be deployed to a Node hosting platform (not GitHub Pages).

### Quick deploy using `render.yaml`

1. Push code to your GitHub repository.
2. Open Render and choose **New + > Blueprint**.
3. Select your repository.
4. Render will detect `render.yaml` and create the web service.
5. In Render environment variables, set:
- `DATABASE_URL`
- `EMAIL_USER`
- `EMAIL_PASS`
6. Deploy.

### Important production notes

- `SESSION_SECRET` is required in production.
- Use a managed PostgreSQL database (Render Postgres, Supabase, Neon, etc.).
- Do not commit `.env` to Git.

## Usage

### Role entry points

- Public: `/`
- Profile: `/profile`
- Customer pages: `/pets`, `/appointments`
- Veterinarian pages: `/vet/schedule`, `/vet/appointment`
- Admin pages: `/admin/customers`, `/admin/employees`, `/admin/appointments`, `/admin/services`, `/admin/medicines`, `/admin/invoices`, `/admin/statistics`

### Suggested local test flow

1. Create a customer account via `/signup`.
2. Seed at least one veterinarian/admin user directly in `users` table.
3. Add services and medicines as admin.
4. Book appointment as customer.
5. Assign/confirm appointment as admin.
6. Complete treatment and prescription as veterinarian.
7. Review/pay invoice as customer.

## Folder Structure

```text
src/
|-- app.js
|-- package.json
|-- config/
|   |-- database.js
|   `-- email.js
|-- helpers/
|-- middlewares/
|   `-- auth.mdw.js
|-- models/
|   |-- appointment.model.js
|   |-- customer.model.js
|   |-- email.model.js
|   |-- employee.model.js
|   |-- invoice.model.js
|   |-- medicine.model.js
|   |-- pet.model.js
|   |-- prescription.model.js
|   |-- service.model.js
|   |-- statistical.model.js
|   `-- user.model.js
|-- routes/
|   |-- commonRoute/
|   |-- customerRoute/
|   |-- vetRoute/
|   `-- adminRoute/
|-- static/
|   |-- *.css
|   `-- images/
`-- views/
    |-- layouts/
    |-- vwAccounts/
    |-- vwCustomer/
    |-- vwVeterinarian/
    `-- vwAdmin/
```

## Contribution Guide

1. Fork the repository and create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

2. Keep changes scoped and aligned with existing module boundaries (`routes/`, `models/`, `views/`).
3. Follow current coding style (ES modules, async/await, service-style model functions).
4. Verify manually before opening PR:
- Authentication and role authorization flow
- CRUD behavior for affected modules
- UI rendering for modified views
5. Commit with clear messages.

```bash
git commit -m "feat: add appointment assignment validation"
```

6. Open a Pull Request with:
- Purpose and scope
- Screenshots (if UI changed)
- Database impact notes (schema/seed changes)
- Manual test steps

## Notes

- Do not commit real credentials in `.env`.
- There is currently no automated test suite configured (`npm test` is a placeholder).
