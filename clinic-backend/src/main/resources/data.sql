-- src/main/resources/data.sql

ALTER SEQUENCE account_account_id_seq RESTART WITH 1;
ALTER SEQUENCE patient_id_seq RESTART WITH 1;
ALTER SEQUENCE doctor_id_seq RESTART WITH 1;

-- 1. Chuyên khoa
INSERT INTO specialty (specialty_name) VALUES 
('Nội tổng quát'),
('Tim mạch'),
('Nhi khoa'),
('Da liễu'),
('Răng hàm mặt');

-- 2. Phòng khám
INSERT INTO room (room_name, location) VALUES
('Phòng 101', 'Tầng 1'),
('Phòng 102', 'Tầng 1'),
('Phòng 201', 'Tầng 2'),
('Phòng 202', 'Tầng 2'),
('Phòng 301', 'Tầng 3');

-- 3. Tài khoản + Bác sĩ
INSERT INTO account (email, password, account_type, status) VALUES
('nam@gmail.com', '123456', 'doctor', 'active'),
('lan@gmail.com', '123456', 'doctor', 'active'),
('minh@gmail.com', '123456', 'doctor', 'active');

INSERT INTO doctor (fullname, specialty_id, room_id, consultation_fee, account_id) VALUES
('BS. Nguyễn Văn Nam', 1, 1, 200000, 1),
('BS. Trần Thị Lan', 2, 2, 250000, 2),
('BS. Lê Văn Minh', 3, 3, 180000, 3);

-- 4. Tài khoản Admin (để test nếu muốn)
INSERT INTO account (email, password, account_type, status) VALUES
('admin@clinic.com', 'admin123', 'admin', 'active');

-- 5. Tài khoản Patient mẫu (để test login nhanh)
INSERT INTO account (email, password, account_type, status) VALUES
('patient1@gmail.com', '123456', 'patient', 'active'),
('patient2@gmail.com', '123456', 'patient', 'active');

INSERT INTO patient (patient_id, fullname, phone, email, account_id) VALUES
('P0001', 'Nguyễn Thị Hoa', '0909876543', 'patient1@gmail.com', 5),
('P0002', 'Trần Văn Hùng', '0912345678', 'patient2@gmail.com', 6);