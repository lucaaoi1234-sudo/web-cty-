# RCPPJSC — Website giới thiệu doanh nghiệp

Landing page tiếng Việt gồm 5 mục điều hướng: Giới thiệu, Sản phẩm, Công nghệ, Khách hàng và Liên hệ.

## Build và chạy thử

Trang được đóng gói thành một `index.html` độc lập để tránh lỗi 404 khi môi trường preview chỉ publish trang HTML. CSS, JavaScript và logo được nhúng trực tiếp vào trang từ các tệp nguồn.

```bash
python3 build.py
python3 -m http.server 8000 --bind 0.0.0.0
```

Sau khi chạy lệnh build, có thể mở `index.html` trực tiếp hoặc vào `http://localhost:8000`.

## Triển khai trên Netlify

`netlify.toml` chạy `python3 build.py` và publish thư mục `dist/`. Build script cũng tạo `index.html` độc lập ở thư mục gốc để có thể tải thủ công nếu cần. Trình duyệt không cần tải riêng CSS, JavaScript hay logo.

## Trước khi phát hành

- Cập nhật nội dung về lĩnh vực, sản phẩm, công nghệ và khách hàng theo thông tin chính thức của RCPPJSC.
- Biểu mẫu liên hệ hiện là giao diện demo, chưa gửi/lưu dữ liệu. Hãy kết nối email, CRM hoặc API trước khi sử dụng thật.
- `styles.css` và `script.js` được nhúng khi build. Logo PNG gốc được giữ tại `assets/rcppjsc-logo.png`; bản WebP tối ưu tại `assets/rcppjsc-logo.webp` được nhúng vào trang để giảm dung lượng tải.
