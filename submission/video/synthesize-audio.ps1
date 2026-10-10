# Synthesize voiceover audio for SponsorFit demo video
param(
    [string]$ScriptJson = ""
)

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$installedVoices = $synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }
if ($installedVoices -contains "Microsoft Zira Desktop") {
    $synth.SelectVoice("Microsoft Zira Desktop")
} elseif ($installedVoices.Count -gt 0) {
    $synth.SelectVoice($installedVoices[0])
}
$synth.Rate = 1

$audioDir = Join-Path $PSScriptRoot "audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
}

function Find-Binary($envVar, $name) {
    $val = [System.Environment]::GetEnvironmentVariable($envVar)
    if ($val) { return $val }
    if (Get-Command $name -ErrorAction SilentlyContinue) { return $name }
    $winget = "C:\Users\admin\AppData\Local\Microsoft\WinGet\Links\$name.exe"
    if (Test-Path $winget) { return $winget }
    $hermes = "D:\Hermes\tools\ffmpeg-9.0.1-win32-x64\bin\$name.exe"
    if (Test-Path $hermes) { return $hermes }
    return $name
}

$ffmpeg = Find-Binary "FFMPEG_BIN" "ffmpeg"
$ffprobe = Find-Binary "FFPROBE_BIN" "ffprobe"

$shots = @()
$scriptPath = if ($ScriptJson -and (Test-Path $ScriptJson)) { $ScriptJson } else { Join-Path $audioDir "voiceover_script.json" }

if (Test-Path $scriptPath) {
    $raw = Get-Content $scriptPath -Raw -Encoding UTF8
    $shots = $raw | ConvertFrom-Json
} else {
    $shots = @(
        [PSCustomObject]@{
            id = "shot_01_hook"
            name = "Shot 1: The Hook & Creator Monetization Problem"
            text = "Every month, thousands of talented newsletter writers and indie podcasters pitch brands for sponsorships using the exact same generic stats: follower counts and age demographics. But premium brands like Aesop, Oatly, and Patagonia don't buy demographics, they buy authentic cultural alignment. Welcome to SponsorFit: the autonomous agent that turns audience cultural taste into quantifiable brand partnerships using Qloo's Taste Graph."
        },
        [PSCustomObject]@{
            id = "shot_02_seeds"
            name = "Shot 2: Setting the Cultural Profile & Running the Agent"
            text = "Instead of asking for follower numbers, SponsorFit asks for your audience's cultural fingerprint. Here, our culture podcast audience loves A24 films, indie songwriter Phoebe Bridgers, the show Severance, and Tartine Bakery. We click Run Cultural Sponsorship Audit."
        },
        [PSCustomObject]@{
            id = "shot_03_trace"
            name = "Shot 3: Agent Tool Execution Trace"
            text = "Under the hood, the agent executes four transparent steps. First, it resolves each seed keyword into canonical Qloo URN entities. Next, it queries Qloo's v2 insights endpoint for brand affinities and cross-domain overlap. Then, our ranking engine deterministically benchmarks candidate brands against sample averages. Every step records exact parameters, row counts, and latency."
        },
        [PSCustomObject]@{
            id = "shot_04_ranked"
            name = "Shot 4: Ranked Sponsor Fit Tiers"
            text = "Notice how our collapsed summary keeps all ranked sponsors above the fold. In this sample dataset, the engine surfaces benchmarked brand matches: Aesop shows a sample affinity of ninety-four percent, thirty-two percent above the sample mean, driven by audience interest in A24 films. In live mode with a provisioned API key, SponsorFit queries Qloo's live Taste Graph with identical transparent field citations."
        },
        [PSCustomObject]@{
            id = "shot_05_mediakit"
            name = "Shot 5: One-Page Cultural Media Kit"
            text = "SponsorFit generates a publication-ready Cultural Media Kit. In one click, creators can download a clean Markdown dossier backed by zero-hallucination data. You're no longer begging for ad reads, you're presenting empirical consumer preference data."
        },
        [PSCustomObject]@{
            id = "shot_06_pitch"
            name = "Shot 6: Grounded Sponsor Pitch Letters"
            text = "Switching to pitch letters, SponsorFit formats personalized cold outreach emails using this sample audit data. Notice the difference: every claim cites verifiable Qloo API response fields, proving to the brand's partnership team why this audience over-indexes on their products. One click copies the pitch ready for your email client."
        },
        [PSCustomObject]@{
            id = "shot_07_close"
            name = "Shot 7: Zero-Cost Deployment & Conclusion"
            text = "SponsorFit is open-source under MIT, tested with 16 automated test suites, and prepped for zero-cost deployment on Vercel Hobby. Built from scratch for the Qloo Agentic Hackathon: because AI agents should have taste. Thank you!"
        }
    )
}

$results = @()
$totalDuration = 0.0

$titleDuration = 2.0
Write-Host "Title Card: $titleDuration seconds (silent)"
$totalDuration += $titleDuration

foreach ($shot in $shots) {
    $wavPath = Join-Path $audioDir "$($shot.id).wav"
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($shot.text)
    
    $durStr = & $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $wavPath
    $dur = [double]$durStr
    $totalDuration += $dur
    
    $results += [PSCustomObject]@{
        Id = $shot.id
        Name = $shot.name
        Text = $shot.text
        Duration = [Math]::Round($dur, 2)
        TotalElapsed = [Math]::Round($totalDuration, 2)
    }
}

$synth.Dispose()

Write-Host "`nVoiceover Synthesis Results:"
$results | Format-Table Id, Duration, TotalElapsed, Name -AutoSize
Write-Host ("Total Video Duration: {0:N2} seconds ({1:D2}:{2:D2})" -f $totalDuration, [int]($totalDuration / 60), [int]($totalDuration % 60))

$metaPath = Join-Path $audioDir "voiceover_timings.json"
$metadata = @{
    titleCardDuration = $titleDuration
    totalDuration = [Math]::Round($totalDuration, 2)
    voice = "Microsoft Zira Desktop"
    shots = $results
}
$metadata | ConvertTo-Json -Depth 4 | Set-Content $metaPath -Encoding UTF8
Write-Host "Saved timing metadata to $metaPath"

# Generate master_audio.wav with 2s title silence
Write-Host "Concatenating master audio with $ffmpeg..."
$silenceWav = Join-Path $audioDir "silence_title.wav"
& $ffmpeg -y -f lavfi -i anullsrc=r=22050:cl=mono -t 2.0 -c:a pcm_s16le $silenceWav

$concatList = Join-Path $audioDir "concat_list.txt"
$lines = @("file 'silence_title.wav'")
foreach ($shot in $shots) {
    $lines += "file '$($shot.id).wav'"
}
$lines | Set-Content $concatList -Encoding ASCII

$masterAudio = Join-Path $audioDir "master_audio.wav"
& $ffmpeg -y -f concat -safe 0 -i $concatList -c:a pcm_s16le $masterAudio
Write-Host "Master audio generated at $masterAudio"
