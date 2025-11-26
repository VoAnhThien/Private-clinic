# HỆ THỐNG QUẢN LÝ PHÒNG KHÁM – CLINIC MANAGEMENT SYSTEM

Dự án Fullstack đặt lịch khám bệnh (Spring Boot 3 + React 18 + PostgreSQL + TailwindCSS)

## TÀI KHOẢN TEST SẴN TRONG DATABASE


→ Đăng nhập bất kỳ tài khoản nào → hệ thống tự động chuyển đúng dashboard theo role.


## YÊU CẦU HỆ THỐNG

- Java 17 hoặc 21
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+
- (Tùy chọn) Git

## CÁCH CHẠY DỰ ÁN (5 PHÚT LẦN ĐẦU, SAU CHỈ 2 PHÚT)

### 1. CÀI DATABASE PostgreSQL

('admin@gmail.com', '123456', 'admin', 'active')

"doctor"		"nam@gmail.com"
"doctor"		"lan@gmail.com"
"patient"	"2025-11-23 00:40:26.68041"	"test999@gmail.com"
"patient"	"2025-11-23 00:44:17.030048"	"testcurl@gmail.com"
"patient"	"2025-11-23 01:09:18.135286"	"vantest@gmail.com"
"patient"	"2025-11-23 16:44:33.230431"	"tanluc@gmail.com"
"admin"		"admin@gmail.com"  

Tạo database tên: `clinic_management`

```sql
CREATE DATABASE clinic_management
    WITH OWNER = postgres
    ENCODING = 'UTF8';

2. CHẠY BACKEND (Spring Boot)
    cd clinic-backend

    mvn spring-boot:run

3. CHẠY FRONTEND (React + Vite)
    cd clinic-frontend
    npm install        # chỉ lần đầu
    npm install lucide-react
    npm run dev

    Frontend chạy ở: http://localhost:5173

4. ĐĂNG NHẬP & TEST
    Mở trình duyệt → http://localhost:5173
    Thử đăng nhập các tài khoản ở bảng trên → bạn sẽ thấy:

    Bệnh nhân → Patient Dashboard
    Bác sĩ → Doctor Dashboard
    Admin → Admin Dashboard


CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH

    Đăng ký / Đăng nhập (có phân quyền role)
    Tự động chuyển trang đúng dashboard theo role (Patient / Doctor / Admin)
    Bảo vệ route bằng ProtectedRoute + AuthContext
    Dashboard riêng cho từng role (đẹp, responsive)
    Token giả + interceptor tự động gắn Bearer
    API /api/auth/me trả về role chính xác
    Tạo Patient tự động khi đăng ký
    Dữ liệu mẫu bác sĩ + bệnh nhân có sẵn

CÁC TÍNH NĂNG CÓ THỂ THÊM SAU

    Đặt lịch khám (appointment)
    Bác sĩ xem + cập nhật trạng thái lịch
    Admin quản lý bác sĩ/bệnh nhân
    Gửi email xác nhận
    JWT thật thay token giả
    Deploy lên Vercel + Railway

LỆNH HỮU ÍCH
    # Backend
    ./mvnw clean compile
    ./mvnw spring-boot:run

    # Frontend
    npm run dev          # chạy dev
    npm run build        # build production
    npm run preview      # xem bản build