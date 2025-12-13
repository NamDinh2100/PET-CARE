# PET-CARE Architecture Document

## 1. Tổng quan kiến trúc

Hệ thống PET-CARE được xây dựng theo **kiến trúc MVC (Model-View-Controller)** với Node.js và Express.js framework.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPRESS.JS SERVER                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   ROUTES     │───►│ CONTROLLERS  │───►│    MODELS    │          │
│  │  (Router)    │    │   (Logic)    │    │  (Database)  │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│         │                   │                    │                  │
│         │                   ▼                    │                  │
│         │           ┌──────────────┐             │                  │
│         └──────────►│    VIEWS     │◄────────────┘                  │
│                     │ (Handlebars) │                                │
│                     └──────────────┘                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL DATABASE                            │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack

### 2.1 Backend Technologies

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Node.js** | - | Runtime environment |
| **Express.js** | 5.1.0 | Web application framework |
| **Knex.js** | 3.1.0 | SQL query builder |
| **PostgreSQL** | - | Relational database |

### 2.2 Frontend Technologies

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Handlebars** | 8.0.3 | Template engine |
| **HTML/CSS** | - | Markup và styling |
| **JavaScript** | ES6+ | Client-side scripting |

### 2.3 Security & Authentication

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **bcryptjs** | 3.0.3 | Password hashing |
| **express-session** | 1.18.2 | Session management |

### 2.4 Utilities

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **dotenv** | 17.2.3 | Environment variables |
| **multer** | 2.0.2 | File upload handling |
| **nodemailer** | 7.0.11 | Email sending |

### 2.5 Development Tools

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **nodemon** | 3.1.11 | Auto-restart server |

## 3. MVC Architecture Details

### 3.1 Models (`/models`)

Chứa các file tương tác với database:

```
models/
├── user.model.js         # Quản lý người dùng (Customer, Employee)
├── service.model.js      # Quản lý dịch vụ
├── medicine.model.js     # Quản lý thuốc
├── appointment.js        # Quản lý lịch hẹn
├── email.model.js        # Gửi email
└── statistical.model.js  # Thống kê báo cáo
```

### 3.2 Views (`/views`)

Chứa các template Handlebars:

```
views/
├── layouts/              # Layout chung
│   └── main.handlebars
├── vwAccounts/          # Views cho tài khoản
├── vwAdmin/             # Views cho Admin
├── vwCustomer/          # Views cho khách hàng
└── vwVeterinarian/      # Views cho bác sĩ thú y
```

### 3.3 Routes/Controllers (`/routes`)

Xử lý routing và business logic:

```
routes/
├── account.route.js           # Đăng nhập, đăng ký
├── admin-employee.route.js    # Quản lý nhân viên
├── admin-service.route.js     # Quản lý dịch vụ
├── admin-medicine.route.js    # Quản lý thuốc
├── admin-appointment.route.js # Quản lý lịch hẹn
├── admin-customer.route.js    # Quản lý khách hàng
├── admin-statistical.route.js # Thống kê
└── appointment.route.js       # Lịch hẹn (Veterinarian)
```

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Users     │       │ Appointments │       │   Services   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │◄──────│ customer_id  │       │ id           │
│ email        │       │ service_id   │──────►│ name         │
│ password     │       │ date         │       │ price        │
│ role         │       │ status       │       │ description  │
│ ...          │       │ ...          │       │ ...          │
└──────────────┘       └──────────────┘       └──────────────┘
                              │
                              ▼
┌──────────────┐       ┌──────────────┐
│  Employees   │       │  Medicines   │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ name         │       │ name         │
│ position     │       │ quantity     │
│ ...          │       │ price        │
└──────────────┘       └──────────────┘
```

### 4.2 Các bảng chính

| Tên bảng | Mô tả |
|----------|-------|
| `users` | Thông tin người dùng (khách hàng) |
| `employees` | Thông tin nhân viên |
| `services` | Danh sách dịch vụ |
| `medicines` | Danh sách thuốc |
| `appointments` | Lịch hẹn khám |

## 5. Security Architecture

### 5.1 Authentication Flow

```
┌────────┐     ┌─────────────┐     ┌──────────┐     ┌──────────┐
│ Client │────►│ Login Form  │────►│ bcrypt   │────►│ Session  │
│        │     │             │     │ verify   │     │ create   │
└────────┘     └─────────────┘     └──────────┘     └──────────┘
```

### 5.2 Session Management

- Sử dụng `express-session` để quản lý session
- Session lưu trữ thông tin user đã đăng nhập
- Middleware kiểm tra authentication trước khi truy cập routes bảo vệ

## 6. Deployment Architecture

<!-- 
Mô tả cách deploy ứng dụng:
- Development environment
- Production environment
- CI/CD pipeline (nếu có)
-->

---
*Tài liệu được cập nhật từ PA2 và source code thực tế*
