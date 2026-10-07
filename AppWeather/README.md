# BÁO CÁO & HƯỚNG DẪN ỨNG DỤNG DỰ BÁO THỜI TIẾT (REACT NATIVE)

Ứng dụng di động dự báo thời tiết hiện đại, trực quan, hỗ trợ định vị GPS tự động và tra cứu dữ liệu thời tiết thực tế từ **Open-Meteo API** (Hoàn toàn miễn phí, không cần API Key).

## Cấu Hình API Sử Dụng:
- **Dự báo thời tiết (Forecast)**: `https://api.open-meteo.com/v1/forecast`
- **Tìm kiếm địa điểm (Geocoding)**: `https://geocoding-api.open-meteo.com/v1/search`

---

## 1. Yêu Cầu Chức Năng Đã Hoàn Thành (100%)

1. **Xem thời tiết hiện tại**:
   - Hiển thị tên địa điểm (thành phố, quốc gia) theo GPS hoặc theo tìm kiếm.
   - Nhiệt độ hiển thị lớn, trạng thái thời tiết đi kèm icon trực quan.
   - Hiển thị nhiệt độ cao nhất (Max), thấp nhất (Min) và nhiệt độ cảm nhận thực tế (Feels Like).
   - Màu nền giao diện tự động đổi màu Gradient theo trạng thái thời tiết (Trời nắng vàng cam, Mưa xám xanh, Đêm tối huyền bí, Dông bão...).

2. **Dự báo theo giờ (24 giờ tiếp theo)**:
   - Danh sách cuộn ngang mượt mà hiển thị 24 giờ tiếp theo.
   - Từng mốc giờ hiển thị: Mốc thời gian (vd: Bây giờ, 2 SA, 4 CH), Biểu tượng thời tiết, Nhiệt độ và Tỉ lệ mưa (%).
   - **Tương tác**: **Chạm vào bất kỳ mốc giờ nào** để mở popup Bottom Sheet chi tiết đầy đủ các chỉ số của riêng giờ đó (Khả năng mưa, Độ ẩm, Tốc độ & Hướng gió, Chỉ số UV, Cảm nhận thực tế, Tầm nhìn xa, Áp suất khí quyển).

3. **Dự báo nhiều ngày (7 ngày)**:
   - Danh sách hiển thị 7 ngày liên tiếp: Hôm nay, Ngày mai, Thứ Sáu, Thứ Bảy...
   - Trạng thái thời tiết, biểu tượng, tỉ lệ mưa.
   - Thanh dải nhiệt độ trực quan so sánh biên độ nhiệt độ thấp nhất và cao nhất giữa các ngày.
   - **Tương tác**: **Chạm vào bất kỳ ngày nào** để mở bảng chi tiết toàn bộ chỉ số của ngày đó (Nhiệt độ cao nhất/thấp nhất, Tỉ lệ mưa cả ngày, Gió mạnh nhất & hướng gió, Chỉ số UV tối đa, Giờ mặt trời mọc & lặn, Độ ẩm trung bình, Tầm nhìn xa, Áp suất khí quyển).

4. **Xem thông tin chi tiết về thời tiết**:
   - Lưới các thẻ chỉ số trực quan hiện đại:
     - **Độ ẩm**: Tỉ lệ % độ ẩm không khí.
     - **Tốc độ gió & Hướng gió**: km/h và hướng gió chi tiết tiếng Việt (vd: Bắc-Tây Bắc, Đông Nam...).
     - **Chỉ số UV**: Đi kèm mức độ đánh giá (Thấp, Trung bình, Cao, Rất cao).
     - **Áp suất khí quyển**: Đơn vị mb.
     - **Tầm nhìn xa**: Đơn vị km và mức độ (Rất tốt, Tốt, Kém).
     - **Nhiệt độ cảm nhận thực tế**: Cảm giác cơ thể người chịu ảnh hưởng từ gió và ẩm.

5. **Sử dụng vị trí hiện tại (GPS)**:
   - Tự động hiển thị hộp thoại xin cấp quyền GPS (`ACCESS_FINE_LOCATION`).
   - Lấy tọa độ GPS thiết bị để gọi API dự báo thời tiết chính xác tại vị trí người dùng.
   - Xử lý tình huống người dùng từ chối quyền: chuyển sang địa điểm mặc định (Hà Nội) và cho phép người dùng tự tìm kiếm thành phố qua thanh Search.

6. **Tìm kiếm địa điểm**:
   - Tìm kiếm autocomplete bất kỳ thành phố nào trên thế giới.
   - Có sẵn danh sách gợi ý các thành phố lớn tại Việt Nam (Hà Nội, Hồ Chí Minh, Đà Nẵng, Cần Thơ, Hải Phòng, Nha Trang, Đà Lạt, Huế, Sa Pa...).
   - Chạm vào địa điểm sẽ tự động chuyển về màn hình chính và tải toàn bộ dự báo thời tiết của địa điểm đó.

---

## 2. File APK Đã Build Sẵn Để Nộp Bài & Cài Đặt (Standalone APK)

File APK Release độc lập đã được biên dịch hoàn tất. Toàn bộ mã nguồn JavaScript, icons, fonts và logic đã được đóng gói sẵn 100% bên trong file APK, **chạy độc lập trên mọi thiết bị Android mà không cần máy tính hay Metro Server**:

- **Đường dẫn file APK Release (Dùng để cài đặt & nộp bài)**:
  `d:\MobileApp2026\App_Weather\AppWeather\android\app\build\outputs\apk\release\app-release.apk` (Dung lượng: ~68 MB)

### Cài đặt nhanh qua ADB:
```bash
adb install -r d:\MobileApp2026\App_Weather\AppWeather\android\app\build\outputs\apk\release\app-release.apk
```
*(Hoặc copy trực tiếp file `app-release.apk` vào bộ nhớ điện thoại Android và nhấn Cài đặt).*

---

## 3. Hướng Dẫn Chạy Từ Source Code (Dành Cho Lập Trình Viên)

### Bước 1: Cài đặt dependencies (nếu clone trên máy mới)
```bash
cd AppWeather
npm install --legacy-peer-deps
```

### Bước 2: Chạy Metro Bundler
```bash
npm start
```

### Bước 3: Chạy ứng dụng trên Android
Mở máy ảo Android hoặc cắm điện thoại đã bật USB Debugging, sau đó:
```bash
npm run android
```
hoặc mở trực tiếp file APK Release đã biên dịch sẵn trong thư mục `android/app/build/outputs/apk/release/app-release.apk`.

