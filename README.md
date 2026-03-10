# KPI Bếp - Web App quản lý tồn và KPI ca sáng

Ứng dụng web tĩnh cho bộ phận bếp:

- Quản lý tồn cuối ngày theo **danh sách nguyên vật liệu động** (thêm/xóa/sửa).
- Dự báo sản lượng bán theo **nhiều món** (ví dụ thêm món "Tô ngon miệng").
- Khai báo **định mức nguyên liệu cho từng món** (mỗi tô/bát dùng bao nhiêu).
- Khai báo **năng lực bếp theo từng nguyên liệu** (năng suất/mẻ + phút/mẻ).
- Tự động tính:
  - tổng nguyên liệu cần cho ngày mai,
  - lượng cần chuẩn bị thêm sau khi trừ tồn,
  - số mẻ cần làm,
  - tổng thời gian và mốc hoàn thành KPI bếp.

## UX mobile

- Các trường số dùng `inputmode="numeric"` hoặc `inputmode="decimal"` để ưu tiên bàn phím số trên điện thoại.
- Input số được tăng kích thước để dễ thao tác.

## Chạy local

Mở trực tiếp `index.html` hoặc chạy web server tĩnh:

```bash
python3 -m http.server 8000
```

Sau đó truy cập: <http://localhost:8000>
