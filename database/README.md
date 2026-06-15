## Import database (SQL Server)

### Yêu cầu

- SQL Server đang chạy (ví dụ: `localhost\\NGUYENTRUNG`)
- Có tài khoản `sa`

### Reset + seed nhanh

Chạy lệnh sau trên PowerShell:

```powershell
sqlcmd -S tcp:localhost,1433 -U sa -P 12345 -f 65001 -i "e:\download of Thư\SWP391-Horse\database\horse_racing_db.sql"
```

### Lưu ý về lỗi font/tiếng Việt

- Nếu import bằng `sqlcmd` mà chữ tiếng Việt bị lỗi, hãy luôn dùng `-f 65001`.
- Backend nên trả UTF-8 để client (Postman/PowerShell) decode đúng.

