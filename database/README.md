# Database setup (Windows)

Chỉ có một file SQL chính thức: [HorseRacingManagement.sql](HorseRacingManagement.sql).

File tự tạo database, toàn bộ schema/constraint và dữ liệu demo. Không cần chạy migration hoặc seed riêng.

## Chạy bằng Windows PowerShell

Mở PowerShell tại thư mục gốc của project, sau đó chạy:

```powershell
$env:DB_PASSWORD = 'your-local-sql-server-password'
sqlcmd -S "localhost\SQLEXPRESS" -U sa -P $env:DB_PASSWORD -C -b -i ".\database\HorseRacingManagement.sql"
```

- Đổi `localhost\SQLEXPRESS` thành instance SQL Server thực tế, ví dụ `localhost,1433` nếu dùng cổng TCP.
- Nếu Windows Authentication đã được bật, có thể thay phần `-U sa -P $env:DB_PASSWORD` bằng `-E`.
- Có thể mở file SQL bằng SQL Server Management Studio (SSMS) rồi nhấn **Execute** nếu không dùng `sqlcmd`.

## Dữ liệu tạo sẵn

- 9 tài khoản demo: Admin, Referee, 3 Horse Owner, 3 Jockey active, Spectator.
- 9 horses cho 3 owner.
- `Demo Tournament 2026`: giải `OPEN`, race đã publish, 2 entry `APPROVED` và 1 entry `PENDING` để test approve/deny.
- `Results Showcase 2026`: giải `FINISHED`, có result/report đã confirm để xem ngay.

Tất cả account demo có mật khẩu `123456`, chỉ dùng cho môi trường local/demo.

## Reset demo

Script không tự xóa database để tránh mất dữ liệu. Nếu cần reset hoàn toàn, xóa database `HorseRacingManagement` trên máy local rồi chạy lại file SQL duy nhất này.
