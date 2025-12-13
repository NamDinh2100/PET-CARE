# PET-CARE Software Requirements

## 1. Use-Case Model

### 1.1 Use-Case Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PET-CARE System                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌──────────┐                                                      │
│    │ Customer │──────► [Đăng ký/Đăng nhập]                          │
│    └──────────┘        [Xem dịch vụ]                                │
│         │              [Đặt lịch hẹn]                               │
│         │              [Xem lịch sử khám]                           │
│         ▼                                                           │
│    ┌──────────────┐                                                 │
│    │ Veterinarian │──► [Xem danh sách lịch hẹn]                    │
│    └──────────────┘    [Ghi nhận thông tin khám]                   │
│         │              [Kê đơn thuốc]                               │
│         ▼                                                           │
│    ┌─────────┐                                                      │
│    │  Admin  │────────► [Quản lý nhân viên]                        │
│    └─────────┘          [Quản lý dịch vụ]                          │
│                         [Quản lý thuốc]                             │
│                         [Quản lý lịch hẹn]                          │
│                         [Xem thống kê]                              │
│                         [Quản lý khách hàng]                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Actors (Tác nhân)

| Actor | Mô tả |
|-------|-------|
| **Customer** | Khách hàng - chủ nuôi thú cưng sử dụng dịch vụ |
| **Veterinarian** | Bác sĩ thú y thực hiện khám và điều trị |
| **Admin** | Quản trị viên quản lý toàn bộ hệ thống |

### 1.3 Chi tiết Use-Cases

---

#### UC01: Đăng ký tài khoản

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC01 |
| **Tên** | Đăng ký tài khoản |
| **Actor** | Customer |
| **Mô tả** | Khách hàng tạo tài khoản mới trên hệ thống |
| **Tiền điều kiện** | Chưa có tài khoản |
| **Hậu điều kiện** | Tài khoản được tạo thành công |

**Luồng chính:**
1. Khách hàng truy cập trang đăng ký
2. Khách hàng nhập thông tin (email, mật khẩu, họ tên,...)
3. Hệ thống xác thực thông tin
4. Hệ thống tạo tài khoản và thông báo thành công

**Luồng thay thế:**
- 3a. Email đã tồn tại → Hiển thị thông báo lỗi

---

#### UC02: Đăng nhập

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC02 |
| **Tên** | Đăng nhập |
| **Actor** | Customer, Veterinarian, Admin |
| **Mô tả** | Người dùng đăng nhập vào hệ thống |

<!-- Thêm luồng chính và luồng thay thế -->

---

#### UC03: Quản lý nhân viên

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC03 |
| **Tên** | Quản lý nhân viên |
| **Actor** | Admin |
| **Mô tả** | Admin thêm, sửa, xóa thông tin nhân viên |

<!-- Thêm luồng chính và luồng thay thế -->

---

#### UC04: Quản lý dịch vụ

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC04 |
| **Tên** | Quản lý dịch vụ |
| **Actor** | Admin |
| **Mô tả** | Admin thêm, sửa, xóa các dịch vụ của phòng khám |

---

#### UC05: Quản lý thuốc

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC05 |
| **Tên** | Quản lý thuốc |
| **Actor** | Admin |
| **Mô tả** | Admin thêm, sửa, xóa danh mục thuốc |

---

#### UC06: Quản lý lịch hẹn

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC06 |
| **Tên** | Quản lý lịch hẹn |
| **Actor** | Admin |
| **Mô tả** | Admin xem và quản lý tất cả lịch hẹn |

---

#### UC07: Xem thống kê

| Thông tin | Chi tiết |
|-----------|----------|
| **Mã UC** | UC07 |
| **Tên** | Xem thống kê |
| **Actor** | Admin |
| **Mô tả** | Admin xem báo cáo thống kê doanh thu, lịch hẹn |

---

## 2. Non-Functional Requirements (Yêu cầu phi chức năng)

### 2.1 Performance (Hiệu suất)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-P01 | Thời gian phản hồi trang < 3 giây | Bắt buộc |
| NFR-P02 | Hỗ trợ tối thiểu 100 người dùng đồng thời | Mong muốn |
| NFR-P03 | Thời gian xử lý đăng nhập < 2 giây | Bắt buộc |

### 2.2 Security (Bảo mật)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-S01 | Mật khẩu được mã hóa bằng bcrypt | Bắt buộc |
| NFR-S02 | Sử dụng session để quản lý đăng nhập | Bắt buộc |
| NFR-S03 | Phân quyền người dùng theo vai trò | Bắt buộc |

### 2.3 Usability (Khả năng sử dụng)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-U01 | Giao diện thân thiện, dễ sử dụng | Bắt buộc |
| NFR-U02 | Responsive trên các thiết bị | Mong muốn |
| NFR-U03 | Hỗ trợ tiếng Việt | Bắt buộc |

### 2.4 Reliability (Độ tin cậy)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-R01 | Uptime tối thiểu 99% | Mong muốn |
| NFR-R02 | Backup dữ liệu hàng ngày | Mong muốn |

### 2.5 Maintainability (Khả năng bảo trì)

| ID | Yêu cầu | Mức độ |
|----|---------|--------|
| NFR-M01 | Mã nguồn theo chuẩn MVC | Bắt buộc |
| NFR-M02 | Tài liệu hóa đầy đủ | Bắt buộc |

---
*Tài liệu được cập nhật từ PA1*
