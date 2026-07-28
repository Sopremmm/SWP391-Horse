# Debug Session: admin-configure-gates-missing-horses
- **Status**: [OPEN]
- **Issue**: Role Admin ở màn Configure Gates chỉ thấy 1 ngựa, các ngựa khác không hiển thị trong danh sách chọn.
- **Log File**: .dbg/trae-debug-log-admin-configure-gates-missing-horses.ndjson

## Reproduction Steps
1. Đăng nhập Admin.
2. Mở trang race detail của bracket.
3. Mở modal `Configure Gates`.
4. Kiểm tra dropdown chọn horse entry.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Frontend filter `eligibleEntries` đang loại mất các entry đã có `race_id` khác race hiện tại | High | Low | Pending |
| B | API `GET /api/entries/tournament/{id}` chỉ trả về 1 entry hợp lệ cho tournament này | Med | Low | Pending |
| C | Modal gates dùng state assignment cũ nên không render đủ option từ dữ liệu backend | Med | Low | Pending |
| D | Dữ liệu tournament hiện tại thực tế chỉ có 1 entry chưa bị gán/reject nên UI nhìn như bị lỗi | Med | Low | Pending |

## Log Evidence
- DB/API evidence for tournament `id=8 (Xoai Cat Hoa Loc)`: chỉ có 1 `race_entry` tồn tại trong tournament nên modal hiện 1 horse là đúng với dữ liệu hiện tại.
- Static/frontend evidence: `eligibleEntries` đang filter `(!item.race?.id || item.race.id === race?.id)`, nên các horse đã nằm ở bracket khác sẽ bị ẩn hoàn toàn khỏi modal Configure Gates.

## Verification Conclusion
- Hypothesis B và D được xác nhận cho tournament hiện tại: dữ liệu giải đang chỉ có 1 entry.
- Hypothesis A cũng đúng ở mức logic UI: các entry thuộc bracket khác bị filter khỏi danh sách, gây cảm giác thiếu ngựa và không cho admin reassign giữa các bracket.
