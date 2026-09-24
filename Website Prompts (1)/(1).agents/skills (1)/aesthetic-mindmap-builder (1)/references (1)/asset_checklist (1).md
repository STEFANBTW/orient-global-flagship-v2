# Asset Checklist — Fonts & JS Libraries

---

## Generic Font Download Function

Use this function for every aesthetic. Call it once per font family needed.

```powershell
function Get-GoogleFont {
    param(
        [string]$FontName,        # URL-encoded e.g. "Bebas+Neue"
        [string]$Weights = "400;500;600;700",
        [string]$OutDir           # absolute path to assets/fonts/
    )

    $headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    $url = "https://fonts.googleapis.com/css2?family=${FontName}:wght@${Weights}&display=swap"
    $css = (Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing).Content

    # Extract all woff2 URLs (Google returns multiple per font — one per unicode subset)
    $woff2Urls = [regex]::Matches($css, "url\(['""]?([^'""\)]+\.woff2)['""]?\)") |
                 ForEach-Object { $_.Groups[1].Value }

    $i = 0
    $localCss = $css
    foreach ($woffUrl in $woff2Urls) {
        $safeName = ($FontName -replace '\+', '_') + "_$i.woff2"
        Invoke-WebRequest -Uri $woffUrl -OutFile "$OutDir\$safeName" -UseBasicParsing
        # Replace URL with local path in CSS (use index to avoid ambiguity across subsets)
        $localCss = $localCss -replace [regex]::Escape($woffUrl), $safeName
        $i++
    }
    return $localCss
}
```

### Usage pattern for any aesthetic

```powershell
$root = "c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts"
$base = "$root\aesthetics\$FOLDER"
$fontsDir = "$base\assets\fonts"

# Load the function above first, then:
$allCss = ""
foreach ($font in $fontsNeeded) {
    $allCss += Get-GoogleFont -FontName $font.Name -Weights $font.Weights -OutDir $fontsDir
    $allCss += "`n"
}
$allCss | Out-File "$fontsDir\fonts.css" -Encoding UTF8

# JSZip (same for all aesthetics)
Invoke-WebRequest "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" `
  -OutFile "$base\assets\js\jszip.min.js" -UseBasicParsing
```

---

## Font Lists per Aesthetic

After extracting spec tokens, build the `$fontsNeeded` array from this table.
The table maps each aesthetic to its fonts, identified from the spec's Typography section.

| # | Aesthetic | Path A Fonts | Path B Fonts | Body Font | Mono Font |
|---|---|---|---|---|---|
| 02 | Brutalism | Bebas+Neue, Impact (system) | JetBrains+Mono, Space+Mono | Inter | IBM+Plex+Mono |
| 03 | Editorial | Cormorant+Garamond, Playfair+Display | Libre+Baskerville, DM+Serif+Display | Source+Serif+4 | — |
| 04 | Maximalism | Abril+Fatface, Playfair+Display | Fraunces, DM+Serif+Display | Lora | — |
| 05 | Glassmorphism | Exo+2, Rajdhani | Inter, DM+Sans | Outfit | Space+Mono |
| 06 | Neumorphism | Nunito, Poppins | Inter, DM+Sans | Plus+Jakarta+Sans | — |
| 07 | Skeuomorphism | Lora, EB+Garamond | Roboto+Slab, Zilla+Slab | Merriweather | — |
| 08 | Flat Design | Nunito, Poppins | Quicksand | Open+Sans | — |
| 09 | Material Design | Roboto, Nunito | Outfit | Roboto | Roboto+Mono |
| 10 | Cyberpunk | Orbitron, Rajdhani | Share+Tech+Mono, JetBrains+Mono | Inter | — |
| 11 | Vaporwave Y2K | Pacifico, Lobster | VT323, Press+Start+2P | Nunito | — |
| 12 | Organic Natural | Fraunces, Lora | Jost, Raleway | Source+Serif+4 | — |
| 13 | Luxury | Cormorant+Garamond, Playfair+Display | Italiana, DM+Serif+Display | Jost | — |
| 14 | Corporate | Inter, IBM+Plex+Sans | Source+Serif+4, Libre+Baskerville | Open+Sans | — |
| 15 | Bauhaus | Jost, Barlow+Condensed | IBM+Plex+Sans, Space+Grotesk | Inter | — |
| 16 | Art Deco | Poiret+One, Josefin+Sans | Cormorant+Garamond, Italiana | Jost | — |
| 17 | Swiss | Inter, IBM+Plex+Sans | Space+Grotesk, DM+Sans | Inter | — |
| 18 | Psychedelic | Syne, Fraunces | Abril+Fatface, Righteous | Nunito | — |
| 19 | Dark Editorial | Cormorant+Garamond, Playfair+Display | Inter, DM+Sans | Inter | JetBrains+Mono |
| 20 | Handcrafted DIY | Caveat, Kalam | Special+Elite, Courier+Prime | Lora | — |

**Notes:**
- "Impact (system)" = do not download; reference as system font fallback in CSS only
- Always confirm font names against the extracted spec — the table is a guide, not gospel
- Default weights to download: `400;500;600;700` unless the spec specifies thin/heavy only
- Fonts like VT323 and Press Start 2P only have weight 400 — pass `"400"` for those

---

## Verification

After download, confirm:

```powershell
# Check fonts.css exists and references local files (not google CDN)
Get-Content "$base\assets\fonts\fonts.css" | Select-String "fonts.googleapis.com"
# Should return nothing — all URLs should be local filenames

# Count downloaded woff2 files
(Get-ChildItem "$base\assets\fonts\*.woff2").Count
# Should be > 0

# Check jszip exists
Test-Path "$base\assets\js\jszip.min.js"  # Should be True
```
