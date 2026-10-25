# สำรองข้อมูลทั้งระบบ: ฐานข้อมูล 2 ตัว + workflow ของ n8n
# วิธีใช้ (ที่โฟลเดอร์โปรเจกต์):
#   powershell -ExecutionPolicy Bypass -File scripts\backup.ps1

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)   # ไปที่โฟลเดอร์หลักของโปรเจกต์

$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$backupDir = "backups\$stamp"
New-Item -ItemType Directory -Force $backupDir | Out-Null

# ---------- 1) ฐานข้อมูล ----------
Write-Host "[1/3] สำรองฐานข้อมูล..." -ForegroundColor Cyan
foreach ($db in 'market_insights', 'n8n') {
    # สร้างไฟล์ dump ใน container ก่อน แล้วค่อย copy ออกมา (กันไฟล์เสียจากการส่งผ่าน PowerShell)
    docker compose exec -T postgres pg_dump -U admin -Fc -f "/tmp/$db.dump" $db
    if ($LASTEXITCODE -ne 0) { throw "pg_dump $db ล้มเหลว" }
    docker cp "mi-postgres:/tmp/$db.dump" "$backupDir\$db.dump" | Out-Null
    docker compose exec -T postgres rm "/tmp/$db.dump"
    $size = [math]::Round((Get-Item "$backupDir\$db.dump").Length / 1MB, 2)
    Write-Host "      $db.dump ($size MB)"
}

# ---------- 2) workflow ของ n8n (เก็บเข้า Git) ----------
Write-Host "[2/3] Export workflow ของ n8n..." -ForegroundColor Cyan
docker compose exec -T n8n sh -c "rm -rf /tmp/wf && mkdir -p /tmp/wf && n8n export:workflow --all --separate --pretty --output=/tmp/wf/ > /dev/null 2>&1"
if ($LASTEXITCODE -ne 0) { throw "export workflow ล้มเหลว" }
New-Item -ItemType Directory -Force n8n-workflows | Out-Null
Remove-Item n8n-workflows\*.json -ErrorAction SilentlyContinue   # ลบของเก่า เผื่อมี workflow ถูกลบไปแล้ว
docker cp "mi-n8n:/tmp/wf/." "n8n-workflows" | Out-Null
# ปิดบัง Telegram Chat ID ก่อนเก็บเข้า Git (อ่านค่าจาก .env)
$chatId = ((Get-Content .env | Where-Object { $_ -like 'TELEGRAM_CHAT_ID=*' }) -replace '^TELEGRAM_CHAT_ID=', '').Trim()
if ($chatId) {
    Get-ChildItem n8n-workflows\*.json | ForEach-Object {
        $text = [IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8)
        $masked = $text.Replace("`"$chatId`"", '"YOUR_TELEGRAM_CHAT_ID"')
        $masked = [regex]::Replace($masked, "(?<![\d`"])$chatId(?![\d`"])", '"YOUR_TELEGRAM_CHAT_ID"')
        if ($masked -ne $text) { [IO.File]::WriteAllText($_.FullName, $masked, (New-Object Text.UTF8Encoding($false))) }
    }
}
$count = (Get-ChildItem n8n-workflows\*.json).Count
Write-Host "      ได้ $count workflow ในโฟลเดอร์ n8n-workflows"

# ---------- 3) ลบ backup เก่า เก็บไว้ 7 ชุดล่าสุด ----------
Write-Host "[3/3] ลบ backup เก่า (เก็บ 7 ชุดล่าสุด)..." -ForegroundColor Cyan
Get-ChildItem backups -Directory | Sort-Object Name -Descending | Select-Object -Skip 7 | Remove-Item -Recurse -Force

Write-Host ""
Write-Host "เสร็จแล้ว! backup อยู่ที่ $backupDir" -ForegroundColor Green
Write-Host "อย่าลืม commit โฟลเดอร์ n8n-workflows เข้า Git" -ForegroundColor Yellow
