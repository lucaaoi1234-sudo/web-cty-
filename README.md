# RCPPJSC — Website giới thiệu doanh nghiệp

Landing page tiếng Việt gồm 5 mục điều hướng: Giới thiệu, Sản phẩm, Công nghệ, Khách hàng và Liên hệ.

## Build và chạy thử

Trang được đóng gói thành một `index.html` với CSS, JavaScript và logo được nhúng sẵn. Các ảnh sản phẩm là WebP tối ưu, chỉ tải khi mở thư viện và được build script chép vào `dist/assets/products/`.

```bash
python3 build.py
python3 -m http.server 8000 --bind 0.0.0.0
```

Sau khi chạy lệnh build, có thể mở `index.html` trực tiếp hoặc vào `http://localhost:8000`.

## Triển khai trên Netlify

`netlify.toml` chạy `python3 build.py` và publish thư mục `dist/`, trong đó có trang HTML và các ảnh sản phẩm WebP. CSS, JavaScript và logo được nhúng để tránh lỗi đường dẫn; ảnh trong thư viện chỉ tải khi người dùng mở danh mục. Nếu deploy thủ công, tải toàn bộ thư mục `dist/` lên hosting.

## Trước khi phát hành

- Cập nhật nội dung về lĩnh vực, sản phẩm, công nghệ và khách hàng theo thông tin chính thức của RCPPJSC.
- Biểu mẫu liên hệ hiện là giao diện demo, chưa gửi/lưu dữ liệu. Hãy kết nối email, CRM hoặc API trước khi sử dụng thật.
- Ô “Sản phẩm linh hoạt” mở thư viện dạng dialog với các tab lọc và animation. Ảnh chỉ tải khi mở thư viện/chọn danh mục.
- Để thêm sản phẩm, thêm ảnh WebP vào `assets/products/`, thêm một `.product-tile` trong `index.template.html`, rồi chạy `python3 build.py`. Build kiểm tra đường dẫn ảnh và chép chúng vào `dist/`.
- `styles.css` và `script.js` được nhúng khi build. Logo PNG gốc được giữ tại `assets/rcppjsc-logo.png`; bản WebP tối ưu tại `assets/rcppjsc-logo.webp` được nhúng vào trang để giảm dung lượng tải.
