# Configuration DNS Définitive pour windventure.fr

## Configuration Recommandée chez Hostinger

### Option A : Nameservers Vercel (Plus stable)
Changez les nameservers vers :
- ns1.vercel-dns.com
- ns2.vercel-dns.com

### Option B : Configuration A/CNAME Records
Si vous gardez Hostinger DNS, configurez :

**Type A Record:**
- Host: @
- Points to: 76.76.21.21

**Type CNAME Record:**
- Host: www
- Points to: cname.vercel-dns.com

## Vérification
```bash
# Tester la configuration
nslookup windventure.fr
curl -I https://windventure.fr
```

## URLs de Production
- Principal : https://windventure.fr
- Backup : https://windventure-premium.vercel.app

## Support
- Vercel : https://vercel.com/docs/custom-domains
- Status : https://www.vercel-status.com/