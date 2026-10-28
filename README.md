# RCPPJSC — Website giới thiệu doanh nghiệp

Landing page tiếng Việt gồm đúng 5 mục điều hướng: Giới thiệu, Sản phẩm, Công nghệ, Khách hàng và Liên hệ.

## Build và chạy thử

```bash
python3 build.py
python3 -m http.server 8000 --bind 0.0.0.0
```

Build tạo hai đầu ra:

- `index.html` là bản tự chứa: CSS, JavaScript, logo và cả bảy ảnh WebP đều được nhúng vào một tệp. Có thể tải riêng tệp này lên hosting chỉ phục vụ `index.html`.
- `dist/` là bản deploy tối ưu: HTML ban đầu nhỏ hơn, còn ảnh WebP nằm ở `dist/assets/products/` và được tải theo nhu cầu — ảnh giới thiệu khi cuộn tới, ảnh gallery khi mở danh mục.

Mở `index.html` trực tiếp hoặc vào `http://localhost:8000` để xem bản tự chứa.

## Triển khai trên Netlify

`netlify.toml` chạy `python3 build.py` và publish `dist/`. Khi deploy thủ công lên hosting hỗ trợ một tệp duy nhất, dùng `index.html` ở thư mục gốc. Không deploy riêng `dist/index.html` nếu hosting không nhận kèm thư mục `dist/assets/products/`.

## Nội dung và thư viện sản phẩm

- Thông điệp “Chất lượng, giá cả cạnh tranh” nằm ở cột trái; hai ảnh nhà xưởng bên phải tự luân phiên dạng slideshow nền, có trạng thái tĩnh khi bật giảm chuyển động.
- Ô “Sản phẩm linh hoạt” mở dialog có các tab lọc: Tất cả, Sầu riêng, Hộp 11 kg, Thiết kế bao bì và Thương hiệu. Chuyển tab, mở dialog và hiện ảnh đều có animation; hỗ trợ bàn phím và đóng bằng Esc/backdrop.
- Để thêm sản phẩm, thêm ảnh WebP vào `assets/products/` và một `.product-tile` trong `index.template.html`, rồi chạy `python3 build.py`. Build sẽ nhúng ảnh vào `index.html` và chép ảnh vào `dist/assets/products/`.
- `styles.css` và `script.js` được nhúng khi build. Logo PNG gốc được giữ tại `assets/rcppjsc-logo.png`; bản WebP tối ưu tại `assets/rcppjsc-logo.webp` được nhúng để giảm dung lượng tải.

## Trước khi phát hành

- Cập nhật nội dung về lĩnh vực, sản phẩm, công nghệ và khách hàng theo thông tin chính thức của RCPPJSC.
- Biểu mẫu liên hệ hiện là giao diện demo, chưa gửi/lưu dữ liệu. Hãy kết nối email, CRM hoặc API trước khi sử dụng thật.
