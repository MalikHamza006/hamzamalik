$ErrorActionPreference = "Stop"
$base = "http://localhost:3000/api/assistant"

function Fresh { @{} }
function Send([string]$text, $state, [switch]$Show) {
  $s = if ($null -eq $state) { @{ stage = "welcome"; lead = @{}; intent = $null; language = "en"; askedName = $false; askedContact = $false } } else { $state }
  $body = @{ message = $text; state = $s } | ConvertTo-Json -Depth 8
  $r = Invoke-RestMethod -Uri $base -Method Post -ContentType "application/json" -Body $body -TimeoutSec 40
  if ($Show) {
    Write-Host "  > $text" -ForegroundColor Cyan
    Write-Host "  HM AI : $($r.text)" -ForegroundColor White
    Write-Host "         stage=$($r.stage) intent=$($r.intent) lang=$($r.language) card=$($r.showLeadCard)" -ForegroundColor DarkGray
  }
  return $r
}
$fail = 0
function Check($ok, $msg) { if ($ok) { Write-Host "  PASS  $msg" -ForegroundColor Green } else { Write-Host "  FAIL  $msg" -ForegroundColor Red; $script:fail++ } }

Write-Host "`n=== A. CASUAL VISITOR: answers, no pressure ===" -ForegroundColor Yellow
$a = Send "What technologies does Hamza use?" $null
Check (($a.text -match "React") -and ($a.text -match "Django")) "answers with the real stack"
Check (-not ($a.text -match "phone number|whatsapp number|your name")) "does not ask for contact details"
Check ($a.showQuickActions -eq $true) "keeps quick actions"
Check ($a.stage -eq "welcome") "stays casual (not pushed into lead flow)"

Write-Host "`n=== B. PRICING: no invented numbers ===" -ForegroundColor Yellow
foreach ($q in @("How much do you charge?", "What is the price?", "kitna kharcha aayega?")) {
  $p = Send $q $null
  Check (-not ($p.text -match '(?i)\$\s?\d|USD\s?\d|PKR\s?\d|\d+\s*(PKR|USD|rupees)\b')) "'$q' -> no invented price"
}

Write-Host "`n=== C. FULL JOURNEY ===" -ForegroundColor Yellow
$r = Send "I need an AI-powered business dashboard for my company" $null -Show
Check ($r.lead.projectType -eq "AI-powered dashboard / admin panel") "combined AI+dashboard project type"
$s = Send "It's brand new, launching in January" $r -Show
$s = Send "We don't have a design yet, we'll need that too" $s -Show
$s = Send "We'd like to start next month" $s -Show
$s = Send "Budget is around 300k" $s -Show
Check ($s.lead.budget -eq "300k") "budget keeps its 'k' unit (got '$($s.lead.budget)')"
Check ($s.lead.status -eq "New project") "status captured"
Check ($s.lead.design -match "Design") "design captured"
Check ($s.lead.timeline -match "next month") "timeline captured"
$s = Send "Ali" $s -Show
Check ($s.lead.name -eq "Ali") "name captured"
Check ($s.text.Trim().Length -gt 10) "contact question is not empty"
$s = Send "ali.khan@example.com or WhatsApp 0300 1234567" $s -Show
Check ($s.lead.email -eq "ali.khan@example.com") "email captured"
Check ($s.lead.phone -match "0300") "phone captured"
Check ($s.showLeadCard -eq $true) "lead card shown"
Check ($s.stage -eq "handoff") "reached handoff"

Write-Host "`n=== D. NO FALSE BOOKING / NO PUSHINESS ===" -ForegroundColor Yellow
$all = "$($s.text)"
foreach ($bad in @("meeting has been booked","booked your","confirmed your","calendar invite","you're all set","only 2 slots","limited availability","book now")) {
  Check (-not ($all -match [regex]::Escape($bad))) "no '$bad'"
}

Write-Host "`n=== E. ROMAN URDU (fresh) ===" -ForegroundColor Yellow
$u = Send "mujhe ek ecommerce website banwani hai" $null -Show
Check ($u.language -eq "ur") "detects Roman Urdu"
Check ($u.lead.projectType -eq "E-commerce store") "detects e-commerce (got '$($u.lead.projectType)')"
Check ($u.stage -ne "welcome") "begins discovery"
$u2 = Send "mujhe ek AI chatbot banana hai apne business ke liye" $null -Show
Check ($u2.lead.projectType -eq "AI-powered application") "detects AI project in Urdu"

Write-Host "`n=== F. PRIVACY: sensitive input stored nowhere ===" -ForegroundColor Yellow
$pv = Send "my password is hunter2, cnic 42101-1234567-1 and card 4111 1111 1111 1111" $null
$vals = ($pv.lead.PSObject.Properties | ForEach-Object { "$($_.Value)" }) -join " | "
Check ($vals -notmatch 'hunter2|42101|4111') "no credential/CNIC/card stored (lead='$vals')"
Check ($pv.text -match "(?i)security|don't send|password") "warns the visitor"

Write-Host "`n=== G. BUDGET DECLINE (optional field) ===" -ForegroundColor Yellow
$g = Send "I want to hire Hamza" $null
$g = Send "existing inventory management system" $g
$g = Send "we already have a design" $g
$g = Send "asap" $g
Check ($g.lead.timeline -eq "As soon as possible") "urgent timeline captured"
$g = Send "I'd rather not share the budget" $g -Show
Check ($g.lead.budget -match "Not shared") "budget decline recorded without pressure"

Write-Host "`n=== H. MISC INTENTS ===" -ForegroundColor Yellow
Check ((Send "Can you build a SaaS dashboard?" $null).intent -in @("hire","fullstack","ai_development")) "hire/intent for SaaS request"
Check ((Send "What projects are in the portfolio?" $null).intent -eq "projects") "projects intent"
Check ((Send "How do I contact you?" $null).intent -eq "contact") "contact intent"
$hh = Send "How long will it take?" $null
Check ($hh.intent -eq "timeline") "timeline intent"
Check (-not ($hh.text -match '\d+\s*(weeks|months|days)')) "no promised delivery date"
$rs = Send "start over" $null -Show
Check ($rs.stage -eq "welcome") "reset returns to welcome"

Write-Host "`n=== I. INPUT ROBUSTNESS ===" -ForegroundColor Yellow
foreach ($t in @("<script>alert(1)</script>", ("x" * 4000), "?????", "🙂")) {
  try { $z = Send $t $null; Check ($null -ne $z.text) "handled len=$($t.Length)" } catch { Check $false "handled len=$($t.Length)" }
}
foreach ($t in @("", "    ")) {
  try { Send $t $null | Out-Null; Check $false "empty rejected" } catch { Check ([int]$_.Exception.Response.StatusCode -eq 400) "empty -> HTTP 400" }
}

Write-Host "`n=================================================" -ForegroundColor White
if ($fail -eq 0) { Write-Host "ALL CHECKS PASSED" -ForegroundColor Green } else { Write-Host "$fail CHECK(S) FAILED" -ForegroundColor Red }
Write-Host "=================================================" -ForegroundColor White