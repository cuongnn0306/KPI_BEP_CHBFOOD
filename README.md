# KPI Bếp - Quản lý tồn & kế hoạch chuẩn bị ca sáng

Web app tĩnh giúp bộ phận bếp:

- Thêm/xóa nguyên vật liệu tồn cuối ngày (ví dụ: đậu, bò, nước dùng...).
- Thêm/xóa món dự kiến bán giờ cao điểm ngày hôm sau.
- Khai báo định mức từng nguyên vật liệu cho từng món (lượng dùng / 1 bát).
- Khai báo năng lực sơ chế theo nguyên vật liệu (sản lượng mỗi mẻ + phút mỗi mẻ).
- Tự động tính:
  - Tổng nhu cầu nguyên liệu ngày mai.
  - Lượng cần chuẩn bị thêm sau khi trừ tồn.
  - Số mẻ cần làm theo năng lực bếp.
  - Tổng thời gian và mốc giờ hoàn thành KPI.

## Chạy local

Mở trực tiếp `index.html` hoặc chạy server tĩnh:

```bash
python3 -m http.server 8000
```

Sau đó truy cập: <http://localhost:8000>
