import json
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import date, datetime, timedelta


BASE_URL = "http://localhost:8080"
DB_SERVER = "localhost"
DB_USER = "sa"
DB_PASSWORD = "12345"
DB_NAME = "horse_racing_db"


def http_json(method: str, path: str, token: str | None = None, query: dict | None = None, body=None):
    url = BASE_URL + path
    if query:
        url += "?" + urllib.parse.urlencode(query)

    data = None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    if body is not None:
        data = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            raw = res.read().decode("utf-8")
            return res.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8")
        try:
            parsed = json.loads(raw) if raw else None
        except Exception:
            parsed = raw
        return e.code, parsed


def sql_scalar(query: str) -> str:
    cmd = [
        "sqlcmd",
        "-S",
        DB_SERVER,
        "-U",
        DB_USER,
        "-P",
        DB_PASSWORD,
        "-d",
        DB_NAME,
        "-h",
        "-1",
        "-W",
        "-Q",
        query,
    ]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    lines = []
    for line in out.splitlines():
        trimmed = line.strip()
        if not trimmed:
            continue
        lower = trimmed.lower()
        if "rows affected" in lower:
            continue
        lines.append(trimmed)
    if not lines:
        return ""
    return lines[-1]


@dataclass
class Login:
    token: str
    user_id: int
    email: str
    roles: list[str]


def login(email: str, password: str) -> Login:
    status, res = http_json("POST", "/api/auth/signin", body={"email": email, "password": password})
    if status != 200:
        raise RuntimeError(f"Login failed for {email}: {status} {res}")
    return Login(token=res["token"], user_id=res["id"], email=res["email"], roles=res.get("roles") or [])


def assert_true(condition: bool, message: str):
    if not condition:
        raise AssertionError(message)


def main():
    admin = login("admin@racing.vn", "123456")
    owner = login("owner1@racing.vn", "123456")
    referee = login("referee1@racing.vn", "123456")
    jockey = login("jockey1@racing.vn", "123456")
    spectator = login("spectator1@racing.vn", "123456")

    today = date.today()
    start_date = today + timedelta(days=8)
    end_date = start_date + timedelta(days=7)
    tournament_name = f"QA Public Tournament {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    status, created_tournament = http_json(
        "POST",
        "/api/tournaments",
        token=admin.token,
        body={
            "name": tournament_name,
            "location": "QA Stadium",
            "description": "E2E QA Tournament",
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "prizePool": 1000000,
            "maxHorses": 20,
        },
    )
    assert_true(status == 200, f"Create tournament failed: {status} {created_tournament}")
    tournament_id = created_tournament["id"]

    db_tournament_status = sql_scalar(f"SELECT status FROM tournament WHERE id={tournament_id}")
    assert_true(db_tournament_status == "DRAFT", f"DB tournament status expected DRAFT, got {db_tournament_status}")

    race_date_1 = datetime.combine(start_date, datetime.min.time()).replace(hour=9, minute=0, second=0)
    race_date_2 = datetime.combine(start_date, datetime.min.time()).replace(hour=10, minute=0, second=0)

    status, race1 = http_json(
        "POST",
        f"/api/races/tournament/{tournament_id}",
        token=admin.token,
        body={
            "name": "QA Race 1",
            "roundNumber": 1,
            "raceDate": race_date_1.isoformat(),
            "distanceM": 1200,
            "maxParticipants": 12,
        },
    )
    assert_true(status == 200, f"Create race1 failed: {status} {race1}")
    race1_id = race1["id"]

    status, race2 = http_json(
        "POST",
        f"/api/races/tournament/{tournament_id}",
        token=admin.token,
        body={
            "name": "QA Race 2",
            "roundNumber": 2,
            "raceDate": race_date_2.isoformat(),
            "distanceM": 1400,
            "maxParticipants": 12,
        },
    )
    assert_true(status == 200, f"Create race2 failed: {status} {race2}")

    status, opened = http_json(
        "PATCH",
        f"/api/tournaments/{tournament_id}/status",
        token=admin.token,
        query={"status": "OPEN"},
    )
    assert_true(status == 200, f"Update tournament status OPEN failed: {status} {opened}")
    assert_true((opened.get("status") or "").upper() == "OPEN", f"Tournament status expected OPEN, got {opened}")

    status, tournaments_public = http_json("GET", "/api/tournaments")
    assert_true(status == 200 and isinstance(tournaments_public, list), f"Public tournament list failed: {status} {tournaments_public}")
    assert_true(any(t.get("id") == tournament_id for t in tournaments_public), "Tournament not visible to public users")

    horse_id = 1
    status, entry = http_json(
        "POST",
        "/api/entries/register",
        token=owner.token,
        query={"horseId": horse_id, "tournamentId": tournament_id},
    )
    assert_true(status == 200, f"Owner register horse failed: {status} {entry}")
    entry_id = entry["id"]

    db_entry_status = sql_scalar(f"SELECT status FROM race_entry WHERE id={entry_id}")
    assert_true(db_entry_status == "PENDING", f"DB entry status expected PENDING, got {db_entry_status}")

    status, entries_admin = http_json("GET", f"/api/entries/tournament/{tournament_id}", token=admin.token)
    assert_true(status == 200 and isinstance(entries_admin, list), f"Admin list entries failed: {status} {entries_admin}")
    assert_true(any(e.get("id") == entry_id for e in entries_admin), "Admin cannot see newly registered entry")

    status, approved_entry = http_json(
        "PATCH",
        f"/api/entries/{entry_id}/approve",
        token=admin.token,
        query={"raceId": race1_id},
    )
    assert_true(status == 200, f"Approve entry failed: {status} {approved_entry}")
    assert_true((approved_entry.get("status") or "") == "APPROVED", f"Entry status expected APPROVED, got {approved_entry}")

    status, invitation = http_json(
        "POST",
        "/api/invitations",
        token=owner.token,
        query={
            "horseId": horse_id,
            "jockeyId": jockey.user_id,
            "raceId": race1_id,
            "message": "QA invite",
        },
    )
    assert_true(status == 200, f"Invite jockey failed: {status} {invitation}")
    invitation_id = invitation["id"]

    status, accepted = http_json(
        "PATCH",
        f"/api/invitations/{invitation_id}/respond",
        token=jockey.token,
        query={"status": "ACCEPTED"},
    )
    assert_true(status == 200, f"Jockey accept invitation failed: {status} {accepted}")

    db_entry_jockey_id = sql_scalar(f"SELECT jockey_id FROM race_entry WHERE id={entry_id}")
    assert_true(str(db_entry_jockey_id) == str(jockey.user_id), f"DB entry jockey_id expected {jockey.user_id}, got {db_entry_jockey_id}")

    status, assigned = http_json(
        "PATCH",
        f"/api/races/{race1_id}/referee",
        token=admin.token,
        query={"refereeId": referee.user_id},
    )
    assert_true(status == 200, f"Assign referee failed: {status} {assigned}")
    assert_true((assigned.get("referee") or {}).get("id") == referee.user_id, "Race referee not set correctly")

    status, referee_notifications = http_json("GET", "/api/notifications/my", token=referee.token)
    assert_true(status == 200 and isinstance(referee_notifications, list), f"Referee notifications failed: {status} {referee_notifications}")
    assert_true(
        any((n.get("refType") or "").upper() == "RACE" and n.get("refId") == race1_id for n in referee_notifications),
        "Missing referee notification for assignment (expected refType=RACE, refId=raceId)",
    )

    status, referee_entries = http_json("GET", f"/api/referee/races/{race1_id}/entries", token=referee.token)
    assert_true(status == 200 and isinstance(referee_entries, list), f"Referee get entries failed: {status} {referee_entries}")
    assert_true(any(e.get("id") == entry_id for e in referee_entries), "Referee cannot access race entries")

    status, checked_in = http_json(
        "PATCH",
        f"/api/referee/races/{race1_id}/checkin",
        token=referee.token,
        body={"entryId": entry_id, "checkedIn": True},
    )
    assert_true(status == 200, f"Referee check-in failed: {status} {checked_in}")

    status, violation = http_json(
        "POST",
        f"/api/referee/races/{race1_id}/violations",
        token=referee.token,
        body={"entryId": entry_id, "message": "QA violation"},
    )
    assert_true(status == 200, f"Record violation failed: {status} {violation}")

    status, results_saved = http_json(
        "PUT",
        f"/api/referee/races/{race1_id}/results",
        token=referee.token,
        body=[{"entryId": entry_id, "finishRank": 1, "finishTimeMs": 123456}],
    )
    assert_true(status == 200 and isinstance(results_saved, list), f"Upsert results failed: {status} {results_saved}")

    status, submit_report = http_json(
        "POST",
        f"/api/referee/races/{race1_id}/report/submit",
        token=referee.token,
        body={"notes": "QA notes"},
    )
    assert_true(status == 200, f"Submit report failed: {status} {submit_report}")

    status, public_results_before = http_json("GET", f"/api/races/{race1_id}/results")
    assert_true(status == 403, f"Public results should be forbidden before admin publish, got {status} {public_results_before}")

    status, admin_report = http_json("GET", f"/api/admin/races/{race1_id}/report", token=admin.token)
    assert_true(status == 200, f"Admin get report failed: {status} {admin_report}")

    status, admin_confirmed = http_json("POST", f"/api/admin/races/{race1_id}/report/confirm", token=admin.token)
    assert_true(status == 200 and admin_confirmed.get("confirmed") is True, f"Admin confirm report failed: {status} {admin_confirmed}")

    status, published = http_json("POST", f"/api/admin/races/{race1_id}/publish-results", token=admin.token)
    assert_true(status == 200 and (published.get("status") or "").upper() == "COMPLETED", f"Publish results failed: {status} {published}")

    db_race_status = sql_scalar(f"SELECT status FROM race WHERE id={race1_id}")
    assert_true(db_race_status == "COMPLETED", f"DB race status expected COMPLETED, got {db_race_status}")

    status, public_results = http_json("GET", f"/api/races/{race1_id}/results")
    assert_true(status == 200 and isinstance(public_results, dict), f"Public results after publish failed: {status} {public_results}")
    assert_true("results" in public_results and "violations" in public_results, f"Public results payload missing fields: {public_results}")
    assert_true(len(public_results.get("results") or []) > 0, "Public results should contain ranking rows")

    print("E2E PASS")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"E2E FAIL: {e}")
        sys.exit(1)
