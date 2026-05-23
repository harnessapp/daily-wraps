import shutil
import subprocess
from pathlib import Path

SOURCE_JSON = Path(r"C:\harness_scraper\harness_api\daily_wraps.json")
SITE_DIR = Path(r"C:\daily-wraps")
SITE_JSON = SITE_DIR / "daily_wraps.json"

print("📄 Copying daily_wraps.json to daily-wraps repo...")
shutil.copyfile(SOURCE_JSON, SITE_JSON)

print("🔎 Checking git status...")
status = subprocess.run(
    ["git", "status", "--porcelain"],
    cwd=SITE_DIR,
    capture_output=True,
    text=True,
)

if not status.stdout.strip():
    print("ℹ️ No daily-wraps changes to publish.")
    raise SystemExit(0)

print("📦 Committing daily-wraps update...")
subprocess.run(["git", "add", "daily_wraps.json"], cwd=SITE_DIR, check=True)
subprocess.run(["git", "commit", "-m", "Update daily wraps"], cwd=SITE_DIR, check=True)

print("🚀 Pushing daily-wraps site...")
subprocess.run(["git", "push"], cwd=SITE_DIR, check=True)

print("✅ daily-wraps site updated.")