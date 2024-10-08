-- Postgreee db
-- name : inventory_management

-- Tabel raw_materials
CREATE TABLE raw_materials (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Kxxx (K untuk raw materials)
    name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    merk VARCHAR(100),
    surat_jalan VARCHAR(100),
    supplier VARCHAR(100),
    purchase_order_code VARCHAR(100),
    amount BIGINT NOT NULL,
    unit VARCHAR(50)
);

-- Tabel log_raw_materials
CREATE TABLE log_raw_materials (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format LRxxx (LR untuk log raw materials)
    id_material VARCHAR(10) REFERENCES raw_materials(id) ON DELETE CASCADE,
    item_in BIGINT NOT NULL,
    date_in TIMESTAMP NOT NULL,
    item_out BIGINT,
    date_out TIMESTAMP
);

-- Tabel quality
CREATE TYPE quality_name AS ENUM (
    'good',
    'not good',
    'approved',
    'bercak',
    'vernis',
    'flek',
    'bleber',
    'overlap',
    'lolos cetak',
    'beda warna'
);

CREATE TABLE quality (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Qxxx (Q untuk quality)
    name quality_name NOT NULL
);

-- Tabel wh_cutting
CREATE TABLE wh_cutting (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Cxxx (C untuk cutting)
    id_rm VARCHAR(10) REFERENCES raw_materials(id) ON DELETE CASCADE,
    name VARCHAR(255),
    quantity BIGINT NOT NULL,
    date_cutting TIMESTAMP NOT NULL
);

-- Tabel wh_sortir
CREATE TABLE wh_sortir (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Sxxx (S untuk sortir)
    id_cutting VARCHAR(10) REFERENCES wh_cutting(id) ON DELETE CASCADE,
    id_quality VARCHAR(10) REFERENCES quality(id) ON DELETE SET NULL,
    type_name VARCHAR(255),
    quantity BIGINT NOT NULL,
    BON VARCHAR(100),
    date_sorting TIMESTAMP NOT NULL
);

-- Tabel offsets
CREATE TABLE offsets (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Oxxx (O untuk offset)
    id_wh_sortir VARCHAR(10) REFERENCES wh_sortir(id) ON DELETE CASCADE,
    id_quality VARCHAR(10) REFERENCES quality(id) ON DELETE SET NULL,
    quantity BIGINT NOT NULL
);

-- Tabel offset_sortir
CREATE TABLE offset_sortir (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format OSxxx (OS untuk offset sortir)
    id_offset VARCHAR(10) REFERENCES offsets(id) ON DELETE CASCADE,
    id_quality VARCHAR(10) REFERENCES quality(id) ON DELETE SET NULL,
    quantity BIGINT NOT NULL
);

-- Tabel vendor
CREATE TABLE vendor (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Vxxx (V untuk vendor)
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255)
);

-- Tabel vernis
CREATE TABLE vernis (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format VNxxx (VN untuk vernis)
    id_vendor VARCHAR(10) REFERENCES vendor(id) ON DELETE CASCADE,
    id_offset_sortir VARCHAR(10) REFERENCES offset_sortir(id) ON DELETE CASCADE,
    surat_jalan BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    date TIMESTAMP NOT NULL
);

-- Tabel vernis_sortir
CREATE TABLE vernis_sortir (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format VSxxx (VS untuk vernis sortir)
    id_vernis VARCHAR(10) REFERENCES vernis(id) ON DELETE CASCADE,
    id_quality VARCHAR(10) REFERENCES quality(id) ON DELETE SET NULL,
    quantity BIGINT NOT NULL,
    date TIMESTAMP NOT NULL,
    id_product VARCHAR(10) REFERENCES product(id) ON DELETE CASCADE
);

-- Tabel product
CREATE TABLE product (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format Pxxx (P untuk product)
    code_name VARCHAR(100),
    name VARCHAR(255),
    type VARCHAR(100),
    group_name VARCHAR(100),
    position VARCHAR(100)
);

-- Tabel log_product
CREATE TABLE log_product (
    id VARCHAR(10) PRIMARY KEY,  -- ID dengan format LPxxx (LP untuk log product)
    id_product VARCHAR(10) REFERENCES product(id) ON DELETE CASCADE,
    date_in TIMESTAMP NOT NULL,
    amount_in INTEGER NOT NULL,
    date_out TIMESTAMP,
    amount_out INTEGER
);


-- Contoh data untuk tabel raw_materials
INSERT INTO raw_materials (id, name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit) VALUES
('K001', 'Bahan A', '100x200', 'Merk A', 'SJ001', 'Supplier A', 'PO001', 5000, 'kg'),
('K002', 'Bahan B', '150x250', 'Merk B', 'SJ002', 'Supplier B', 'PO002', 3000, 'kg');

-- Contoh data untuk tabel log_raw_materials
INSERT INTO log_raw_materials (id, id_material, item_in, date_in, item_out, date_out) VALUES
('LR001', 'K001', 2000, '2024-01-01 10:00:00', NULL, NULL),
('LR002', 'K002', 1500, '2024-01-02 11:00:00', NULL, NULL);

-- Contoh data untuk tabel quality
INSERT INTO quality (id, name) VALUES
('Q001', 'good'),
('Q002', 'not good'),
('Q003', 'approved');

-- Contoh data untuk tabel wh_cutting
INSERT INTO wh_cutting (id, id_rm, name, quantity, date_cutting) VALUES
('C001', 'K001', 'Pemotongan Bahan A', 1800, '2024-01-03 09:00:00'),
('C002', 'K002', 'Pemotongan Bahan B', 1200, '2024-01-04 10:00:00');

-- Contoh data untuk tabel wh_sortir
INSERT INTO wh_sortir (id, id_cutting, id_quality, type_name, quantity, BON, date_sorting) VALUES
('S001', 'C001', 'Q001', 'Sortir Bahan A', 1700, 'BON001', '2024-01-05 08:00:00'),
('S002', 'C002', 'Q002', 'Sortir Bahan B', 1000, 'BON002', '2024-01-06 09:00:00');

-- Contoh data untuk tabel offsets
INSERT INTO offsets (id, id_wh_sortir, id_quality, quantity) VALUES
('O001', 'S001', 'Q001', 100),
('O002', 'S002', 'Q002', 200);

-- Contoh data untuk tabel offset_sortir
INSERT INTO offset_sortir (id, id_offset, id_quality, quantity) VALUES
('OS001', 'O001', 'Q001', 50),
('OS002', 'O002', 'Q002', 75);

-- Contoh data untuk tabel vendor
INSERT INTO vendor (id, name, address) VALUES
('V001', 'Vendor A', 'Alamat Vendor A'),
('V002', 'Vendor B', 'Alamat Vendor B');

-- Contoh data untuk tabel vernis
INSERT INTO vernis (id, id_vendor, id_offset_sortir, surat_jalan, quantity, date) VALUES
('VN001', 'V001', 'OS001', 123, 500, '2024-01-07 12:00:00'),
('VN002', 'V002', 'OS002', 456, 300, '2024-01-08 13:00:00');

-- Contoh data untuk tabel vernis_sortir
INSERT INTO vernis_sortir (id, id_vernis, id_quality, quantity, date, id_product) VALUES
('VS001', 'VN001', 'Q001', 400, '2024-01-09 14:00:00', 'P001'),
('VS002', 'VN002', 'Q002', 250, '2024-01-10 15:00:00', 'P002');

-- Contoh data untuk tabel product
INSERT INTO product (id, code_name, name, type, group_name, position) VALUES
('P001', 'PROD001', 'Produk A', 'Type A', 'Group A', 'Position A'),
('P002', 'PROD002', 'Produk B', 'Type B', 'Group B', 'Position B');

-- Contoh data untuk tabel log_product
INSERT INTO log_product (id, id_product, date_in, amount_in, date_out, amount_out) VALUES
('LP001', 'P001', '2024-01-11 16:00:00', 400, NULL, NULL),
('LP002', 'P002', '2024-01-12 17:00:00', 250, NULL, NULL);


CREATE SEQUENCE vendor_id_seq START 1;
CREATE SEQUENCE raw_materials_seq START 1;
CREATE SEQUENCE log_raw_materials_seq START 1;





