param()

$ErrorActionPreference = 'Stop'

function Require-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found. Install it first and re-run this script."
  }
}

function Read-Required {
  param([string]$Prompt)
  do {
    $value = Read-Host $Prompt
    if ([string]::IsNullOrWhiteSpace($value)) {
      Write-Host "Value is required." -ForegroundColor Yellow
    }
  } while ([string]::IsNullOrWhiteSpace($value))
  return $value.Trim()
}

Write-Host "=== RA10 Stripe Test Setup (Supabase) ===" -ForegroundColor Cyan
Write-Host "This script sets Supabase secrets and deploys edge functions." -ForegroundColor DarkCyan

Require-Command -Name "supabase"

$projectRef = Read-Required "Supabase project ref (before .supabase.co)"
$stripeSecret = Read-Required "Stripe TEST secret key (sk_test_...)"

$priceIt = Read-Required "STRIPE_PRICE_IT"
$priceBusiness = Read-Required "STRIPE_PRICE_BUSINESS"
$priceSport = Read-Required "STRIPE_PRICE_SPORT"
$pricePro = Read-Required "STRIPE_PRICE_PRO"
$priceUltra = Read-Required "STRIPE_PRICE_ULTRA"
$priceEdu = Read-Required "STRIPE_PRICE_EDU"

$siteUrl = Read-Host "SITE_URL (press Enter for https://ra10.co.uk)"
if ([string]::IsNullOrWhiteSpace($siteUrl)) {
  $siteUrl = "https://ra10.co.uk"
}

$webhookSecret = Read-Host "STRIPE_WEBHOOK_SECRET (whsec_...) - optional for now"

Write-Host "\nSetting Supabase secrets..." -ForegroundColor Cyan
$secretArgs = @(
  "--project-ref", $projectRef,
  "STRIPE_SECRET_KEY=$stripeSecret",
  "STRIPE_PRICE_IT=$priceIt",
  "STRIPE_PRICE_BUSINESS=$priceBusiness",
  "STRIPE_PRICE_SPORT=$priceSport",
  "STRIPE_PRICE_PRO=$pricePro",
  "STRIPE_PRICE_ULTRA=$priceUltra",
  "STRIPE_PRICE_EDU=$priceEdu",
  "PAYMENTS_ENABLED=true",
  "SITE_URL=$siteUrl"
)

if (-not [string]::IsNullOrWhiteSpace($webhookSecret)) {
  $secretArgs += "STRIPE_WEBHOOK_SECRET=$webhookSecret"
}

supabase secrets set @secretArgs

Write-Host "\nDeploying edge functions..." -ForegroundColor Cyan
supabase functions deploy create-checkout --project-ref $projectRef
supabase functions deploy stripe-webhook --project-ref $projectRef

Write-Host "\nDone." -ForegroundColor Green
Write-Host "Webhook endpoint URL:" -ForegroundColor Green
Write-Host "https://$projectRef.supabase.co/functions/v1/stripe-webhook" -ForegroundColor White

if ([string]::IsNullOrWhiteSpace($webhookSecret)) {
  Write-Host "\nNext step: add Stripe webhook endpoint in Stripe dashboard and then set STRIPE_WEBHOOK_SECRET." -ForegroundColor Yellow
  Write-Host "Run this after you get whsec_:" -ForegroundColor Yellow
  Write-Host "supabase secrets set --project-ref $projectRef STRIPE_WEBHOOK_SECRET=whsec_xxx" -ForegroundColor White
}
