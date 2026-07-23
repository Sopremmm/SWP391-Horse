# SWP391 Horse Racing Tournament Management System

Hệ thống quản lý giải đua ngựa cho 5 vai trò: **Admin**, **Horse Owner**, **Jockey**, **Referee** và **Spectator**. Backend dùng Spring Boot 3 / Java 17; frontend dùng React; database dùng SQL Server.

## Database chính thức: một file duy nhất

Chỉ dùng [database/HorseRacingManagement.sql](database/HorseRacingManagement.sql). File này tự tạo database `HorseRacingManagement` (nếu chưa có), toàn bộ bảng/constraint và dữ liệu demo trong một lần chạy. Các SQL export/migration/seed cũ đã được loại bỏ để không còn nhầm lẫn.

Chạy trên Windows PowerShell với SQL Server:

```powershell
$env:DB_PASSWORD = 'your-local-sql-server-password'
sqlcmd -S "localhost\SQLEXPRESS" -U sa -P $env:DB_PASSWORD -C -b -i ".\database\HorseRacingManagement.sql"
```

Đổi `localhost\SQLEXPRESS` thành SQL Server instance của máy nếu khác. Script không xóa database/dữ liệu có sẵn và có thể chạy lặp lại để bổ sung dữ liệu demo còn thiếu. Nếu cần reset sạch trước demo, tự xóa database local rồi chạy lại đúng một file này.

## Chạy ứng dụng

### Backend

Yêu cầu Java 17 và Maven 3.9+.

```bash
export DB_USERNAME=sa
export DB_PASSWORD='your-local-sql-server-password'
export APP_JWT_SECRET='replace-with-a-long-random-secret-at-least-32-characters'
export APP_SEED_ENABLED=false

cd backend
mvn spring-boot:run
```

Sau khi đã chạy file SQL chính thức, để `APP_SEED_ENABLED=false`. Cờ này chỉ là fallback cho database trống, không phải cách seed chính thức của nhóm.

### Frontend

Yêu cầu Node.js 20+.

```bash
cd frontend
npm install
REACT_APP_API_BASE_URL=http://localhost:8080/api npm start
```

Mở [http://localhost:3000](http://localhost:3000). Backend mặc định chạy ở `http://localhost:8080`.

## Dữ liệu demo

Tất cả account demo dùng mật khẩu `123456` (chỉ dành cho local/demo).

| Vai trò | Email | Dùng để demo |
| --- | --- | --- |
| Admin | `admin@demo.com` | Duyệt entry, quản lý bracket/race, confirm kết quả. |
| Referee | `referee@demo.com` | Check-in, nhập kết quả, gửi report. |
| Horse Owner 1 | `owner@demo.com` | Stable chính, đăng ký/mời jockey. |
| Horse Owner 2 | `owner2@demo.com` | Dữ liệu stable bổ sung. |
| Horse Owner 3 | `owner3@demo.com` | Dữ liệu stable bổ sung. |
| Jockey 1 | `jockey@demo.com` | Được gán cho Thunder/Demo Star. |
| Jockey 2 | `jockey2@demo.com` | Được gán cho Lightning. |
| Jockey 3 | `jockey3@demo.com` | Được gán cho Silver Comet. |
| Spectator | `spectator@demo.com` | Chỉ xem tournament/race/horses/leaderboard. |

Ba jockey demo đã có profile `active`, vì vậy xuất hiện trong danh sách mời. Jockey tự đăng ký mới phải vào **Profile** bật trạng thái active trước khi Horse Owner có thể mời.

Seed tạo hai giải tách biệt để demo không bị “kẹt” ở một trạng thái:

| Giải | Trạng thái | Mục đích |
| --- | --- | --- |
| `Demo Tournament 2026` | `OPEN` | Luồng tương tác: 2 ngựa đã được duyệt/gán gate, một entry `PENDING` để Admin test approve/deny, race đã assign referee và publish. |
| `Results Showcase 2026` | `FINISHED` | Luồng chỉ xem: race/result/report đã hoàn tất và public, dùng để kiểm tra owner/spectator/leaderboard ngay. |

## Demo flow chuẩn (15–20 phút)

### 1. Kiểm tra public — Spectator

1. Đăng nhập `spectator@demo.com`.
2. Mở **Tournaments** → `Results Showcase 2026` để xem race đã hoàn tất, kết quả và leaderboard.
3. Mở `Demo Tournament 2026` để xem bracket/race đã public.

Kết quả đúng: spectator chỉ xem được dữ liệu public, không có màn hình Admin hoặc Referee.

### 2. Duyệt entry — Admin

1. Đăng nhập `admin@demo.com`.
2. Vào **Confirm Registration**.
3. Tìm entry `Iron Duke` của `Demo Tournament 2026` đang `PENDING`.
4. Chọn **Accept** để duyệt. Để test từ chối, tạo/register một horse khác, sau đó chọn **Deny** và nhập lý do.

Kết quả đúng: Horse Owner nhận notification; chỉ entry `APPROVED` mới được đưa vào gate/race.

### 3. Quản lý stable và đăng ký ngựa — Horse Owner

1. Đăng nhập `owner@demo.com`.
2. Mở menu user → **My Stable**.
3. Chọn **Add Horse**, nhập Horse Name, Breed, Age và **Age Class**, sau đó xác nhận lưu.
4. Mở `Demo Tournament 2026` → **Register**, chọn horse vừa tạo và confirm.
5. Đăng nhập lại Admin, duyệt entry đó ở **Confirm Registration**.

Kết quả đúng: horse mới xuất hiện ngay ở stable/leaderboard với điểm 0; entry mới là `PENDING` trước khi Admin duyệt. Không xóa horse đã có lịch sử tournament để bảo toàn đối soát.

### 4. Mời jockey — Horse Owner và Jockey

1. Với `owner@demo.com`, mở horse/entry đã được duyệt → **Invite Jockeys**.
2. Chọn một jockey active, kiểm tra chi tiết horse và race rồi confirm lời mời.
3. Đăng nhập account jockey tương ứng → **Invitations** hoặc Notification.
4. Kiểm tra horse/race, chọn **Accept** hoặc **Decline** rồi confirm.
5. Đăng nhập lại owner để xem notification phản hồi. Nếu decline, mời jockey khác trước giờ race.

Kết quả đúng: jockey không active không xuất hiện trong danh sách; horse không có jockey khi race bắt đầu sẽ bị loại.

### 5. Race flow — Admin → Referee → Admin

1. Với Admin, mở **Manage Tournaments** → `Demo Tournament 2026` → `Round 1 - 1200m`.
2. Kiểm tra race đã có gate, referee và participant hợp lệ. Nếu UI có nút **Start Race**, dùng nút đó để chuyển race sang `ONGOING`.
3. Đăng nhập `referee@demo.com` → **My Races** → mở `Round 1 - 1200m`.
4. Tick attendance cho horse có mặt, nhập finish time/rank không trùng. Có thể thêm incident với severity mong muốn. Nhấn **Save Table**, sau đó **Submit Report**.
5. Đăng nhập Admin → mở race report, kiểm tra incident log → **Confirm Report**.
6. Nhấn **Publish Results** (nếu màn hình hiển thị) để Owner/Spectator thấy kết quả.

Kết quả đúng: referee chỉ thao tác race được assign. Incident được lưu kèm report; Admin là người confirm/publish kết quả cho người dùng khác.

### Ý nghĩa các nút publish

| Nút | Hiệu lực |
| --- | --- |
| **Publish Bracket** | Cho các vai trò khác Referee xem bracket tournament. |
| **Publish Race** | Cho các vai trò khác Referee xem chi tiết/lịch của race. |
| **Submit Report** | Referee gửi bảng kết quả và incident cho Admin; **chưa** tự public kết quả. |
| **Confirm Report** | Admin xác nhận report Referee gửi. |
| **Publish Results** | Admin public kết quả đã xác nhận cho Owner/Jockey/Spectator. |

### 6. Kiểm tra kết quả đã public

1. Đăng nhập `owner@demo.com` hoặc `spectator@demo.com`.
2. Vào tournament/race vừa publish hoặc mở `Results Showcase 2026`.
3. Kiểm tra bảng kết quả, incident/result và leaderboard.

## Quy tắc nghiệp vụ chính

- Horse Owner chỉ đăng ký horse trong thời gian `registrationStartDate`–`registrationEndDate`.
- Jockey có thể được mời đến trước thời điểm race bắt đầu, nhưng phải active.
- Admin từ chối entry phải có lý do; hệ thống gửi notification cho owner.
- Admin chỉ gán entry `APPROVED` vào gate; referee chỉ cập nhật race được assign.
- Sau vòng qualifier/semi-final, các race sau chỉ chọn top 3 từ race trước.
- Tournament chỉ chuyển `FINISHED` khi các race liên quan đã hoàn tất.

## Kiểm tra chất lượng

```bash
cd backend && mvn clean test
cd frontend && node node_modules/react-scripts/bin/react-scripts.js build
```

## Cấu trúc chính

- `backend/src/main/java/.../controller`: HTTP boundary và authorization.
- `backend/src/main/java/.../service`: nghiệp vụ, state transition, notification.
- `backend/src/main/java/.../repository`: JPA data access.
- `database/HorseRacingManagement.sql`: schema + constraint + dữ liệu demo chính thức, là file SQL duy nhất cần dùng.
- `frontend/src/services`: API client và mapping data.

## Lưu ý bảo mật

- Không commit `.env`, SQL password, JWT secret hoặc SMTP password.
- Demo accounts không dùng cho production.
- Không dùng `SchemaPatchRunner` để tự sửa schema khi runtime; migration phải được chạy có chủ đích.
