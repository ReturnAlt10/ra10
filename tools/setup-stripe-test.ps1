param()

$ErrorActionPreference = 'Stop'

# RA10 — Stripe (new account) test-mode setup for Supabase.
# Seats all Stripe price IDs + secrets as Supabase edge function secrets, then
# deploys the 5 Stripe functions. Uses `npx supabase@latest` so no global CLI
# install is required (Node/npx is).
#
# SECRETS (Stripe sk_test_... / whsec_...) are read interactively and passed
# straight to the CLI — never echoed or written to disk.

$SupabaseCli = "npx"
$SupabaseCliArgs = @("supabase@latest")

function Write-Console($msg, $color) {
  Write-Host $msg -ForegroundColor $color
}

function Require-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found. Install it first and re-run this script."
  }
}

function Read-Required {
  param([string]$Prompt, [switch]$Secret)
  do {
    $value = if ($Secret) { (Read-Host $Prompt -AsSecureString | ForEach-Object { [System.Net.NetworkCredential]::new('', $_).Password }) } else { Read-Host $Prompt }
    if ([string]::IsNullOrWhiteSpace($value)) {
      Write-Console "Value is required." Yellow
    }
  } while ([string]::IsNullOrWhiteSpace($value))
  return $value.Trim()
}

Write-Console "=== RA10 Stripe Test Setup (Supabase) ===" Cyan
Write-Console "Sets Supabase secrets and deploys the Stripe edge functions." DarkCyan
Write-Console ""

Require-Command -Name "npx"

$projectRef = Read-Required "Supabase project ref (the part before .supabase.co)"
$stripeSecret = Read-Required "Stripe TEST secret key (sk_test_...)" -Secret

$priceIt         = Read-Required "STRIPE_PRICE_IT           (IT £5 one-time)"
$priceBusiness   = Read-Required "STRIPE_PRICE_BUSINESS     (Business £5 one-time)"
$priceSport      = Read-Required "STRIPE_PRICE_SPORT        (Sport £5 one-time)"
$pricePro        = Read-Required "STRIPE_PRICE_PRO          (Pro £20/year)"
$priceProMonth   = Read-Required "STRIPE_PRICE_PRO_MONTHLY  (Pro £2/month)"
$priceUltra      = Read-Required "STRIPE_PRICE_ULTRA        (Ultra £30/year)"
$priceUltraMonth = Read-Required "STRIPE_PRICE_ULTRA_MONTHLY (Ultra £3/month)"
$priceEdu        = Read-Required "STRIPE_PRICE_EDU          (EDU £100/year)"
$priceCredits    = Read-Required "STRIPE_PRICE_CREDITS      (Credits £0.01 one-time)"

$siteUrl = Read-Host "SITE_URL (press Enter for https://ra10.co.uk)"
if ([string]::IsNullOrWhiteSpace($siteUrl)) {
  $siteUrl = "https://ra10.co.uk"
}

Write-Console "`nSetting Supabase secrets..." Cyan
$secretArgs = @(
  "secrets", "set",
  "--project-ref", $projectRef,
  "STRIPE_SECRET_KEY=$stripeSecret",
  "STRIPE_PRICE_IT=$priceIt",
  "STRIPE_PRICE_BUSINESS=$priceBusiness",
  "STRIPE_PRICE_SPORT=$priceSport",
  "STRIPE_PRICE_PRO=$pricePro",
  "STRIPE_PRICE_PRO_MONTHLY=$priceProMonth",
  "STRIPE_PRICE_ULTRA=$priceUltra",
  "STRIPE_PRICE_ULTRA_MONTHLY=$priceUltraMonth",
  "STRIPE_PRICE_EDU=$priceEdu",
  "STRIPE_PRICE_CREDITS=$priceCredits",
  "PAYMENTS_ENABLED=true",
  "SITE_URL=$siteUrl"
)

& $SupabaseCli @SupabaseCliArgs @secretArgs
if ($LASTEXITCODE -ne 0) { throw "supabase secrets set failed." }

Write-Console "`nDeploying Stripe edge functions..." Cyan
$functions = @(
  "create-checkout",
  "confirm-checkout",
  "create-billing-portal",
  "billing-status",
  "stripe-webhook"
)
foreach ($fn in $functions) {
  Write-Console "  deploying $fn ..." DarkCyan
  & $SupabaseCli @SupabaseCliArgs "functions" "deploy" $fn "--project-ref" $projectRef "--no-verify-jwt"
  if ($LASTEXITCODE -ne 0) { throw "supabase functions deploy $fn failed." }
}

Write-Console "`nDone." Green
Write-Console "Webhook endpoint URL (put this in Stripe dashboard → Developers → Webhooks):" Green
Write-Console "  https://$projectRef.supabase.co/functions/v1/stripe-webhook" White
Write-Console ""
Write-Console "Next step: create the Stripe webhook endpoint, subscribe to the events, then run:" Yellow
Write-Console "  npx supabase@latest secrets set --project-ref $projectRef STRIPE_WEBHOOK_SECRET=whsec_xxx" White
