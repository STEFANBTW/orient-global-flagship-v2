$viz = 'c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\UJ3DMap\project-1-uj3dmap-mvp\visualizations'
$missing = @()
Get-ChildItem $viz -Filter '*.html' | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch 'isPaused') {
        $missing += $_.Name
    }
}
if ($missing.Count -eq 0) {
    Write-Host 'ALL PASS - every visualization has isPaused'
} else {
    Write-Host "MISSING isPaused ($($missing.Count) files):"
    $missing | ForEach-Object { Write-Host "  - $_" }
}
