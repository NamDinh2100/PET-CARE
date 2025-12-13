# PET-CARE Testing Document

## 1. Test Environment (Môi trường kiểm thử)

### 1.1 Development Environment

| Thành phần | Chi tiết |
|------------|----------|
| **OS** | Windows 10/11 |
| **Node.js** | v18+ |
| **Database** | PostgreSQL (local) |
| **Browser** | Chrome, Firefox, Edge |
| **Tools** | VS Code, Postman |

### 1.2 Test Environment Setup

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
cd src
npm install

# Setup environment
cp .env.example .env
# Cấu hình database connection trong .env

# Run development server
npm run dev
```

## 2. Test Plan (Kế hoạch kiểm thử)

### 2.1 Test Strategy

| Loại test | Mô tả | Công cụ |
|-----------|-------|---------|
| **Unit Test** | Test các function riêng lẻ | Jest/Mocha |
| **Integration Test** | Test kết nối giữa các module | Supertest |
| **Manual Test** | Test giao diện và luồng người dùng | Browser |
| **API Test** | Test các endpoints | Postman |

### 2.2 Test Coverage Goals

| Module | Coverage mục tiêu |
|--------|-------------------|
| Models | 80% |
| Routes | 70% |
| Authentication | 90% |

## 3. Test Cases

### 3.1 Authentication Module

| TC-ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-A01 | Đăng ký thành công | Email, password hợp lệ | Tạo account thành công | ⬜ |
| TC-A02 | Đăng ký email trùng | Email đã tồn tại | Hiển thị lỗi | ⬜ |
| TC-A03 | Đăng nhập thành công | Email, password đúng | Redirect đến dashboard | ⬜ |
| TC-A04 | Đăng nhập sai mật khẩu | Password sai | Hiển thị lỗi | ⬜ |
| TC-A05 | Đăng xuất | Click logout | Clear session, redirect login | ⬜ |

### 3.2 Employee Management (Admin)

| TC-ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-E01 | Xem danh sách nhân viên | - | Hiển thị danh sách | ⬜ |
| TC-E02 | Thêm nhân viên mới | Thông tin nhân viên | Thêm thành công | ⬜ |
| TC-E03 | Sửa thông tin nhân viên | Thông tin cập nhật | Cập nhật thành công | ⬜ |
| TC-E04 | Xóa nhân viên | ID nhân viên | Xóa thành công | ⬜ |

### 3.3 Service Management (Admin)

| TC-ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-S01 | Xem danh sách dịch vụ | - | Hiển thị danh sách | ⬜ |
| TC-S02 | Thêm dịch vụ mới | Thông tin dịch vụ | Thêm thành công | ⬜ |
| TC-S03 | Sửa thông tin dịch vụ | Thông tin cập nhật | Cập nhật thành công | ⬜ |
| TC-S04 | Xóa dịch vụ | ID dịch vụ | Xóa thành công | ⬜ |

### 3.4 Medicine Management (Admin)

| TC-ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-M01 | Xem danh sách thuốc | - | Hiển thị danh sách | ⬜ |
| TC-M02 | Thêm thuốc mới | Thông tin thuốc | Thêm thành công | ⬜ |
| TC-M03 | Sửa thông tin thuốc | Thông tin cập nhật | Cập nhật thành công | ⬜ |
| TC-M04 | Xóa thuốc | ID thuốc | Xóa thành công | ⬜ |

### 3.5 Appointment Management

| TC-ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-AP01 | Xem danh sách lịch hẹn | - | Hiển thị danh sách | ⬜ |
| TC-AP02 | Tạo lịch hẹn mới | Thông tin lịch hẹn | Tạo thành công | ⬜ |
| TC-AP03 | Cập nhật trạng thái lịch hẹn | Status mới | Cập nhật thành công | ⬜ |

### 3.6 Statistics Module

| TC-ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-ST01 | Xem thống kê doanh thu | Khoảng thời gian | Hiển thị báo cáo | ⬜ |
| TC-ST02 | Xem thống kê lịch hẹn | Khoảng thời gian | Hiển thị thống kê | ⬜ |

## 4. Test Results (Kết quả kiểm thử)

### 4.1 Test Execution Summary

| Loại test | Tổng | Passed | Failed | Blocked |
|-----------|------|--------|--------|---------|
| Authentication | 5 | - | - | - |
| Employee Mgmt | 4 | - | - | - |
| Service Mgmt | 4 | - | - | - |
| Medicine Mgmt | 4 | - | - | - |
| Appointment | 3 | - | - | - |
| Statistics | 2 | - | - | - |
| **Tổng cộng** | **22** | **-** | **-** | **-** |

### 4.2 Defect Summary

| Bug ID | Mô tả | Mức độ | Trạng thái |
|--------|-------|--------|------------|
| BUG-001 | - | - | - |

## 5. Automated Testing

### 5.1 Setup Automated Tests

```bash
# Install test dependencies
npm install --save-dev jest supertest

# Add test script to package.json
# "test": "jest --coverage"
```

### 5.2 Example Test File

```javascript
// tests/auth.test.js
import request from 'supertest';
import app from '../app.js';

describe('Authentication API', () => {
  test('POST /account/login - should login successfully', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(302); // Redirect
  });

  test('POST /account/login - should fail with wrong password', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(response.statusCode).toBe(401);
  });
});
```

### 5.3 Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- tests/auth.test.js
```

### 5.4 CI/CD Integration

<!-- 
Mô tả cách tích hợp automated testing vào CI/CD pipeline:
- GitHub Actions
- GitLab CI
- Jenkins
-->

---
*Tài liệu được cập nhật dựa trên kế hoạch testing và PA2*
