# PET-CARE Demo Guide

## 1. Demo Overview

### 1.1 Mục tiêu Demo
Demo các luồng nghiệp vụ chính của hệ thống PET-CARE, bao gồm:
- Luồng quản lý của Admin
- Luồng làm việc của Bác sĩ thú y
- Luồng sử dụng của Khách hàng

### 1.2 Môi trường Demo

| Thành phần | Chi tiết |
|------------|----------|
| URL | `http://localhost:3000` |
| Browser | Chrome/Edge (recommended) |
| Database | PostgreSQL với sample data |

## 2. Demo Accounts

| Vai trò | Email | Password |
|---------|-------|----------|
| Admin | admin@petcare.com | admin123 |
| Veterinarian | vet@petcare.com | vet123 |
| Customer | customer@petcare.com | customer123 |

## 3. Key Scenarios

### Scenario 1: Admin - Quản lý nhân viên

**Mục tiêu**: Demo CRUD operations cho quản lý nhân viên

**Các bước thực hiện**:

1. **Đăng nhập Admin**
   - Truy cập: `/account/login`
   - Nhập credentials admin
   - ✅ Verify: Redirect đến admin dashboard

2. **Xem danh sách nhân viên**
   - Navigate: `/admin/employees`
   - ✅ Verify: Hiển thị danh sách nhân viên

3. **Thêm nhân viên mới**
   - Click button "Thêm nhân viên"
   - Điền form thông tin
   - Submit form
   - ✅ Verify: Nhân viên mới xuất hiện trong danh sách

4. **Sửa thông tin nhân viên**
   - Click button "Sửa" trên một nhân viên
   - Cập nhật thông tin
   - Submit form
   - ✅ Verify: Thông tin được cập nhật

5. **Xóa nhân viên**
   - Click button "Xóa" trên một nhân viên
   - Xác nhận xóa
   - ✅ Verify: Nhân viên bị xóa khỏi danh sách

---

### Scenario 2: Admin - Quản lý dịch vụ

**Mục tiêu**: Demo quản lý danh mục dịch vụ

**Các bước thực hiện**:

1. **Xem danh sách dịch vụ**
   - Navigate: `/admin/services`
   - ✅ Verify: Hiển thị các dịch vụ (Khám bệnh, Tiêm phòng, Spa...)

2. **Thêm dịch vụ mới**
   - Nhập: Tên dịch vụ, giá, mô tả
   - ✅ Verify: Dịch vụ được thêm vào danh sách

3. **Cập nhật giá dịch vụ**
   - Sửa thông tin giá
   - ✅ Verify: Giá được cập nhật

---

### Scenario 3: Admin - Quản lý thuốc

**Mục tiêu**: Demo quản lý kho thuốc

**Các bước thực hiện**:

1. **Xem danh sách thuốc**
   - Navigate: `/admin/medicines`
   - ✅ Verify: Hiển thị danh sách thuốc

2. **Thêm thuốc mới**
   - Nhập thông tin thuốc
   - ✅ Verify: Thuốc được thêm

3. **Cập nhật số lượng tồn kho**
   - Sửa quantity
   - ✅ Verify: Số lượng được cập nhật

---

### Scenario 4: Admin - Xem thống kê

**Mục tiêu**: Demo dashboard thống kê

**Các bước thực hiện**:

1. **Truy cập thống kê**
   - Navigate: `/admin/statistical`
   
2. **Xem các metrics**
   - ✅ Verify: Hiển thị số liệu:
     - Tổng số lịch hẹn
     - Doanh thu
     - Số khách hàng
     - Charts/Graphs

---

### Scenario 5: Khách hàng - Đặt lịch hẹn

**Mục tiêu**: Demo luồng đặt lịch từ phía khách hàng

**Các bước thực hiện**:

1. **Đăng ký tài khoản** (nếu chưa có)
   - Truy cập: `/account/register`
   - Điền thông tin
   - ✅ Verify: Đăng ký thành công

2. **Đăng nhập**
   - Truy cập: `/account/login`
   - ✅ Verify: Đăng nhập thành công

3. **Xem dịch vụ**
   - Xem danh sách dịch vụ có sẵn
   
4. **Đặt lịch hẹn**
   - Chọn dịch vụ
   - Chọn ngày giờ
   - Submit
   - ✅ Verify: Lịch hẹn được tạo

5. **Xem lịch hẹn của tôi**
   - ✅ Verify: Hiển thị lịch hẹn vừa đặt

---

## 4. Demo Script

### 4.1 Chuẩn bị trước Demo

```bash
# 1. Start database (PostgreSQL)
# Đảm bảo PostgreSQL đang chạy

# 2. Setup environment
cd src
npm install

# 3. Run migrations/seeds (nếu cần)
# npx knex migrate:latest
# npx knex seed:run

# 4. Start server
npm run dev
```

### 4.2 Checklist trước Demo

- [ ] Database đã có sample data
- [ ] Server đang chạy tại `localhost:3000`
- [ ] Tài khoản demo đã được tạo
- [ ] Clear browser cache/cookies
- [ ] Tắt notifications trên máy
- [ ] Chuẩn bị ghi màn hình (nếu cần)

## 5. Screenshots

<!-- 
Thêm screenshots cho từng bước demo:
![Login Page](./images/login.png)
![Admin Dashboard](./images/admin-dashboard.png)
![Employee List](./images/employee-list.png)
-->

## 6. Video Demo

<!-- 
Link đến video demo đã ghi:
- [Demo Full Application](link-to-video)
- [Demo Admin Features](link-to-video)
-->

## 7. Known Issues

| Issue | Workaround |
|-------|------------|
| - | - |

---
*Tài liệu demo cho PET-CARE - Cập nhật [Ngày]*
