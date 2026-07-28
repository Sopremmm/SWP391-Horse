# Debug Session: e2e-tournament-race-flow
- **Status**: [OPEN]
- **Issue**: Kiểm thử E2E luồng giải đấu → đăng ký ngựa → tạo race → assign referee → referee nhập kết quả → admin duyệt/public → user xem kết quả (UI/API/DB)
- **Debug Server**: (pending)
- **Log File**: .dbg/trae-debug-log-e2e-tournament-race-flow.ndjson

## Reproduction Steps
1. Admin đăng nhập → tạo Public Tournament.
2. Horse Owner đăng nhập → đăng ký ngựa tham gia Tournament.
3. Admin tạo Race trong Tournament (chỉ chọn ngựa đã đăng ký).
4. Admin assign Referee cho Race → Referee nhận notification.
5. Referee nhập kết quả + vi phạm → submit cho Admin.
6. Admin xem kết quả → approve → publish.
7. User/Spectator xem kết quả đã publish (chỉ hiển thị đã approve).

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | JWT/role mapping sai (ROLE_*, claim) gây 401/403 ở các bước admin/owner/referee | Med | Med | Pending |
| B | DTO/endpoint mismatch khi tạo tournament/race/assign dẫn tới dữ liệu DB sai hoặc 400/500 | Med | Med | Pending |
| C | Validation đăng ký ngựa/tạo race không chặn ngựa không hợp lệ → DB lỗi hoặc trạng thái race/entry sai | Med | Med | Pending |
| D | Notification không tạo/không hiển thị do type/endpoint/filter → referee không nhận thông báo | Med | Low | Pending |
| E | Workflow referee submit/admin approve/publish sai trạng thái → user vẫn thấy kết quả chưa duyệt hoặc không thấy kết quả đã publish | High | Med | Pending |

## Log Evidence
- Pending

## Verification Conclusion
- Pending

