# 🌪️ Windventure

## Status & Quality

[![Lighthouse Budget](https://github.com/Hamza92sy/windventure/actions/workflows/quality-lighthouse.yml/badge.svg)](https://github.com/Hamza92sy/windventure/actions/workflows/quality-lighthouse.yml)
[![E2E Matrix](https://github.com/Hamza92sy/windventure/actions/workflows/quality-e2e-matrix.yml/badge.svg)](https://github.com/Hamza92sy/windventure/actions/workflows/quality-e2e-matrix.yml)
[![Smoke Check / Production](https://github.com/Hamza92sy/windventure/actions/workflows/smoke-check-prod.yml/badge.svg)](https://github.com/Hamza92sy/windventure/actions/workflows/smoke-check-prod.yml)
[![Security Scan](https://github.com/Hamza92sy/windventure/actions/workflows/security-scan.yml/badge.svg)](https://github.com/Hamza92sy/windventure/actions/workflows/security-scan.yml)
[![Rollback Drill (Weekly)](https://github.com/Hamza92sy/windventure/actions/workflows/rollback-drill-cron.yml/badge.svg)](https://github.com/Hamza92sy/windventure/actions/workflows/rollback-drill-cron.yml)

**Pipeline:** 🟢 Airline‑Grade · **Version:** `v1.0.0` · **Last Drill:** Weekly (Sun 04:00 UTC)

Modern wind energy platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
pnpm exec playwright test
```

## 🎯 Production Operations

### Quick Commands (Makefile)
```bash
# Production readiness check
make go-no-go

# Watch for runner PRs
make watch

# Merge PR and activate promo banner
make merge PR=123

# Emergency rollback
make rollback

# Check environment status
make env

# Health check
make health

# Generate audit report
make report

# CI pipeline simulation
make ci

# Trigger CI workflows from terminal
make trigger-ci

# Test rollback procedures (drill)
make rollback-drill
```

### Manual Operations
```bash
# Watch for PRs
./scripts/watch-pr.sh runner

# One-shot merge and activate
./scripts/one-shot-merge-and-activate.sh 123

# Emergency rollback
./scripts/rollback.sh

# Check Vercel environment
node scripts/check-vercel-env.mjs
```

## 📚 Documentation

- [🚀 Go Live Runbook](docs/GO_LIVE_RUNBOOK.md) - Complete operational guide
- [🔒 Security Guidelines](SECURITY.md) - Security policies and procedures

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest, Playwright, Lighthouse CI
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## 🔍 Quality Assurance

- **Performance:** Lighthouse CI with strict budgets (≥90% performance)
- **Accessibility:** WCAG compliance (≥90% a11y score)
- **SEO:** Optimized for search engines (≥95% SEO score)
- **E2E Testing:** Comprehensive Playwright test suite
- **Security:** Automated security scanning and dependency audits

## 📊 Environment Variables

### Production
- `NEXT_PUBLIC_SHOW_PROMO` - Controls promo banner visibility (0/1)

Check current status:
```bash
node scripts/check-vercel-env.mjs
```

## 🚨 Emergency Procedures

### Quick Rollback
```bash
make rollback
# or
./scripts/rollback.sh --promote-previous
```

### Health Check
```bash
make health
# or
curl -I https://windventure.fr
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks:
   ```bash
   pnpm typecheck
   pnpm test
   pnpm exec playwright test
   pnpm dlx @lhci/cli autorun
   ```
5. Submit a pull request

## ✈️ Airline Pipeline (pré‑flight, CI triggers, rollback drill)
- Validation rapide : `./scripts/final-validation.sh`
- Déclencher CI : `make trigger-ci` (ou `./scripts/trigger-ci.sh lighthouse|matrix|smoke|all`)
- Rollback Drill : `make rollback-drill`
- Runbook : `docs/RUNBOOK_DECOLLAGE.md`

## 📜 License

[Add your license information here]

---

**🌍 Live Site:** [windventure.fr](https://windventure.fr)  
**📊 Status:** Production Ready
# Workflows trigger - Sun Aug 10 08:17:48 +01 2025
