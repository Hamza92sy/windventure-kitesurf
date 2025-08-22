# 🐛 BUGS & AMÉLIORATIONS PRIORISÉES
Date: 2025-08-21
Build: Production v1.0.0

## 🚨 CRITIQUES (À fixer immédiatement)

### 1. Performance LCP trop élevé (3.9s > 2.5s)
- **Impact**: Core Web Vitals dégradés, SEO impacté
- **Solution**: Optimiser images hero, implémenter next/image avec priority
- **Effort**: 2h
- **Priority**: P0

### 2. Total Blocking Time élevé (387ms > 200ms)
- **Impact**: Interactivité dégradée sur mobile
- **Solution**: Code splitting, lazy loading des composants lourds
- **Effort**: 3h
- **Priority**: P0

### 3. Bouton "Réserver" non trouvé dans tests
- **Impact**: Conversion bloquée
- **Solution**: Vérifier présence et sélecteur du bouton CTA
- **Effort**: 1h
- **Priority**: P0

## ⚠️ IMPORTANTS (À fixer cette semaine)

### 4. Viewport metadata deprecated
- **Impact**: Warning Next.js, future breaking change
- **Solution**: Migrer vers export viewport
- **Effort**: 30min
- **Priority**: P1
```typescript
// Avant (app/layout.tsx)
export const metadata = {
  viewport: 'width=device-width, initial-scale=1'
}

// Après
export const viewport = {
  width: 'device-width',
  initialScale: 1
}
```

### 5. Sentry navigation hook manquant
- **Impact**: Tracking incomplet des erreurs navigation
- **Solution**: Ajouter onRouterTransitionStart dans instrumentation
- **Effort**: 30min
- **Priority**: P1

### 6. Touch targets < 44px sur mobile
- **Impact**: Accessibilité mobile dégradée
- **Solution**: Augmenter padding des boutons à min 44x44px
- **Effort**: 1h
- **Priority**: P1

### 7. Accessibility score 85/100
- **Impact**: WCAG non conforme, SEO impacté
- **Solution**: Ajouter ARIA labels manquants, contraste couleurs
- **Effort**: 2h
- **Priority**: P1

## 📈 AMÉLIORATIONS (Nice to have)

### 8. Implémenter global-error.js
- **Impact**: Meilleur tracking erreurs React
- **Solution**: Créer app/global-error.tsx avec Sentry
- **Effort**: 1h
- **Priority**: P2

### 9. Images non optimisées
- **Impact**: Performance, bande passante
- **Solution**: Utiliser next/image partout, formats WebP/AVIF
- **Effort**: 2h
- **Priority**: P2

### 10. Cache assets statiques
- **Impact**: Performance repeat visits
- **Solution**: Configurer headers Cache-Control appropriés
- **Effort**: 1h
- **Priority**: P2

### 11. PWA Support
- **Impact**: Engagement mobile, offline capability
- **Solution**: Ajouter manifest.json, service worker
- **Effort**: 4h
- **Priority**: P3

### 12. i18n Support (EN/FR)
- **Impact**: Audience internationale
- **Solution**: Implémenter next-intl ou next-i18next
- **Effort**: 8h
- **Priority**: P3

## 📊 MÉTRIQUES À SURVEILLER

### Performance actuelle
- **Lighthouse Performance**: 78/100 ⚠️
- **Lighthouse Accessibility**: 85/100 ⚠️
- **Lighthouse Best Practices**: 96/100 ✅
- **Lighthouse SEO**: 100/100 ✅

### Objectifs semaine prochaine
- Performance: > 90/100
- Accessibility: 100/100
- LCP: < 2.5s
- TBT: < 200ms
- CLS: < 0.1 (déjà OK ✅)

## 🛠 PLAN D'ACTION

### Sprint 1 (Cette semaine)
1. ✅ Fix LCP avec next/image priority
2. ✅ Réduire TBT avec code splitting
3. ✅ Corriger bouton "Réserver"
4. ✅ Migrer viewport metadata
5. ✅ Augmenter touch targets

### Sprint 2 (Semaine prochaine)
1. Implémenter Sentry global-error
2. Optimiser toutes les images
3. Configurer cache headers
4. Audit accessibilité complet

### Sprint 3 (Mois prochain)
1. PWA implementation
2. i18n setup
3. A/B testing framework
4. Analytics dashboard

## 💡 QUICK WINS

1. **Compression Brotli** (30min, +5% perf)
2. **Preconnect Google Fonts** (10min, -100ms)
3. **Lazy load below-the-fold** (1h, -500KB initial)
4. **Minify inline CSS** (20min, -20KB)
5. **Remove unused dependencies** (1h, -200KB bundle)

## 📝 NOTES TECHNIQUES

### Bundle Analysis
```bash
npm run analyze
# Bundle size: 198KB (bon mais peut mieux faire)
# Largest chunks: 
# - @sentry/nextjs: 36KB
# - react-dom: 99KB
# - framework: 53KB
```

### Monitoring Setup
- Sentry: ✅ Configuré (manque global-error)
- Analytics: ❌ À implémenter
- Real User Monitoring: ❌ À implémenter
- Error rate: < 0.1% (bon)
- Uptime: 99.9% (à surveiller)

## ✅ VALIDATION CHECKLIST

- [ ] Tous les P0 fixés
- [ ] Tests E2E passent à 100%
- [ ] Lighthouse > 90 sur toutes les métriques
- [ ] Aucune erreur console en production
- [ ] Mobile responsive parfait 375px-414px
- [ ] Formulaires accessibles au clavier
- [ ] Images optimisées < 100KB chacune
- [ ] Time to Interactive < 3s
- [ ] Pas de layout shift visible

---

**Dernière mise à jour**: 2025-08-21 04:25
**Prochain review**: 2025-08-28