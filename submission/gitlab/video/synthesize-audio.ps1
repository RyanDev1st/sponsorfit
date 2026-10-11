# Synthesize voiceover audio for SponsorFit Honesty Guard GitLab Transcend demo video
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

$shots = @(
    [PSCustomObject]@{
        id = "shot_01_project"
        name = "Shot 1: Project Overview & The Need for Supervised Control"
        text = "Welcome to SponsorFit Honesty Guard, built for GitLab's 'Life After Code' hackathon. In an era where generative AI and autonomous workflows write documentation and copy, unbacked claims can easily slip into codebases. Honesty Guard brings 'Speed with Control' to the GitLab Duo Agent Platform: enabling autonomous provenance auditing while strictly enforcing human authorization before any files are changed."
        subtitles = @(
            "Welcome to SponsorFit Honesty Guard, built for GitLab's 'Life After Code' hackathon.",
            "In an era where generative AI and autonomous workflows write documentation and copy, unbacked claims can easily slip into codebases.",
            "Honesty Guard brings 'Speed with Control' to the GitLab Duo Agent Platform: enabling autonomous provenance auditing while strictly enforcing human authorization before any files are changed."
        )
    },
    [PSCustomObject]@{
        id = "shot_02_diff"
        name = "Shot 2: Merge Request !1 & Demo Claim Diff"
        text = "Here on Merge Request exclamation-point-one, a contributor submits new marketing copy adding an unbacked adoption statistic claiming 10,000 creators. Traditional linters pass this without warning. Under our Flow Registry v1 workflow, Honesty Guard inspects the merge request diff automatically."
        subtitles = @(
            "Here on Merge Request !1, a contributor submits new marketing copy adding an unbacked adoption statistic claiming 10,000 creators.",
            "Traditional linters pass this without warning.",
            "Under our Flow Registry v1 workflow, Honesty Guard inspects the merge request diff automatically."
        )
    },
    [PSCustomObject]@{
        id = "shot_03_comment"
        name = "Shot 3: Findings Comment, Replacement NOT Applied, and Paused Human Gate"
        text = "Notice what happens next: the agent does not unilaterally modify files or force a merge. Instead, it posts structured findings note 3991403634 to the discussion, classifying the unsourced 10,000 creator claim as blocking. The agent proposes an honest nonnumeric replacement, marked explicitly NOT applied: 'SponsorFit helps creators prepare culturally grounded sponsorship pitches.' The flow cleanly pauses at the HumanInputComponent gate in status INPUT_REQUIRED, awaiting human maintainer direction. Because the raw agent session requires maintainer login, the paused gate is verified directly here in the audit comment."
        subtitles = @(
            "Notice what happens next: the agent does not unilaterally modify files or force a merge.",
            "Instead, it posts structured findings note 3991403634 to the discussion, classifying the unsourced 10,000 creator claim as blocking.",
            "The agent proposes an honest nonnumeric replacement, marked explicitly NOT applied: 'SponsorFit helps creators prepare culturally grounded sponsorship pitches.'",
            "The flow cleanly pauses at the HumanInputComponent gate in status INPUT_REQUIRED, awaiting human maintainer direction.",
            "Because the raw agent session requires maintainer login, the paused gate is verified directly here in the audit comment."
        )
    },
    [PSCustomObject]@{
        id = "shot_04_flow"
        name = "Shot 4: Flow Registry YAML & HumanInputComponent"
        text = "Here is the flow specification in honesty-guard dot yaml on GitLab. Here we see the maintainer-approval step defined as a HumanInputComponent. Execution pauses and branches based on human maintainer direction: approve routes to the remediator, modify loops back, and reject halts the flow cleanly. Autonomous speed is coupled with strict supervised control."
        subtitles = @(
            "Here is the flow specification in honesty-guard.yaml on GitLab.",
            "Here we see the maintainer-approval step defined as a HumanInputComponent.",
            "Execution pauses and branches based on human maintainer direction: approve routes to the remediator, modify loops back, and reject halts the flow cleanly.",
            "Autonomous speed is coupled with strict supervised control."
        )
    },
    [PSCustomObject]@{
        id = "shot_05_pipeline"
        name = "Shot 5: GitLab CI Pipeline 2936135503 All Stages Passed"
        text = "Here on GitLab CI Pipeline 2936135503, all four stages are completely green: the test suite, the honesty audit, the single-page app build, and the zero-cost GitLab Pages deployment. Every commit and merge request is verified end-to-end."
        subtitles = @(
            "Here on GitLab CI Pipeline 2936135503, all four stages are completely green:",
            "The test suite, the honesty audit, the single-page app build, and the zero-cost GitLab Pages deployment.",
            "Every commit and merge request is verified end-to-end."
        )
    },
    [PSCustomObject]@{
        id = "shot_06_terminal"
        name = "Shot 6: Local Guard BLOCKED Output & Test Suite Verification"
        text = "We also verify Honesty Guard locally. Running honesty-guard dot mjs against the unsourced marketing claim gives status BLOCKED with passed false, catching the unbacked 10,000 creator claim before it can merge. Running npm test confirms all sixteen core API tests and all thirteen honesty guard tests pass with zero failures."
        subtitles = @(
            "We also verify Honesty Guard locally.",
            "Running honesty-guard.mjs against the unsourced marketing claim gives status BLOCKED with passed false, catching the unbacked 10,000 creator claim before it can merge.",
            "Running npm test confirms all 16 core API tests and all 13 honesty guard tests pass with 0 failures."
        )
    },
    [PSCustomObject]@{
        id = "shot_07_close"
        name = "Shot 7: Closing Summary & Hackathon Verification"
        text = "With all tests passing and pipelines green, SponsorFit Honesty Guard proves that in the age of autonomous development, teams can achieve speed with control using the GitLab Duo Agent Platform. Open source under the MIT license, with zero ongoing cost. Thank you!"
        subtitles = @(
            "With all tests passing and pipelines green, SponsorFit Honesty Guard proves that in the age of autonomous development,",
            "Teams can achieve speed with control using the GitLab Duo Agent Platform.",
            "Open source under the MIT license, with zero ongoing cost. Thank you!"
        )
    }
)

$results = @()
$totalDuration = 0.0

$titleDuration = 2.0
Write-Host "Title Card: $titleDuration seconds (silent)"
$totalDuration += $titleDuration

# Subtitle tracking
$srtEntries = @()
$srtIndex = 1

function Format-SrtTime($seconds) {
    $hours = [int]($seconds / 3600)
    $remainder = $seconds % 3600
    $mins = [int]($remainder / 60)
    $secs = [int]($remainder % 60)
    $ms = [int](($remainder - [int]$remainder) * 1000)
    return ("{0:D2}:{1:D2}:{2:D2},{3:D3}" -f $hours, $mins, $secs, $ms)
}

foreach ($shot in $shots) {
    $wavPath = Join-Path $audioDir "$($shot.id).wav"
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($shot.text)

    $durStr = & $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $wavPath
    $dur = [double]$durStr
    $shotStart = $totalDuration
    $shotEnd = $shotStart + $dur
    $totalDuration += $dur

    # Distribute subtitles proportionally by length of text
    $subs = $shot.subtitles
    $totalChars = ($subs | ForEach-Object { $_.Length } | Measure-Object -Sum).Sum
    $curStart = $shotStart

    for ($i = 0; $i -lt $subs.Count; $i++) {
        $subText = $subs[$i]
        $subDur = ($subText.Length / $totalChars) * $dur
        $subEnd = if ($i -eq $subs.Count - 1) { $shotEnd } else { $curStart + $subDur }

        $srtEntries += "$srtIndex`n$((Format-SrtTime $curStart)) --> $((Format-SrtTime $subEnd))`n$subText`n"
        $srtIndex++
        $curStart = $subEnd
    }

    $results += [PSCustomObject]@{
        Id = $shot.id
        Name = $shot.name
        Text = $shot.text
        Duration = [Math]::Round($dur, 2)
        Start = [Math]::Round($shotStart, 2)
        End = [Math]::Round($shotEnd, 2)
        TotalElapsed = [Math]::Round($totalDuration, 2)
    }
}

$synth.Dispose()

Write-Host "`nVoiceover Synthesis Results:"
$results | Format-Table Id, Duration, Start, End, Name -AutoSize
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

# Write subtitles.srt
$srtPath = Join-Path $PSScriptRoot "subtitles.srt"
$srtContent = $srtEntries -join "`n"
$srtContent | Set-Content $srtPath -Encoding UTF8
Write-Host "Saved subtitles to $srtPath"

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
