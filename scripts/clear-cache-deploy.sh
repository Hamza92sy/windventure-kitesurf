#!/bin/bash

echo "🔧 CLEARING CACHE AND REDEPLOYING WINDVENTURE"
echo "============================================="

# 1. Clear Vercel build cache
echo "1️⃣ Clearing Vercel build cache..."
rm -rf .vercel/cache 2>/dev/null
rm -rf .next 2>/dev/null

# 2. Clear local Next.js cache
echo "2️⃣ Clearing Next.js cache..."
rm -rf .next/cache 2>/dev/null
npm cache clean --force

# 3. Rebuild locally to ensure fresh build
echo "3️⃣ Building locally..."
npm run build

# 4. Deploy with force flag
echo "4️⃣ Deploying to Vercel (forced, no cache)..."
vercel --prod --force --yes

# 5. Clear CDN cache
echo "5️⃣ Waiting 10 seconds for deployment..."
sleep 10

# 6. Test the site
echo "6️⃣ Testing site..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Cache-Control: no-cache" https://windventure.fr)
echo "HTTP Status: $RESPONSE"

# 7. Check content
CONTENT=$(curl -s -H "Cache-Control: no-cache" https://windventure.fr | grep -c "Your Ultimate Kitesurfing Adventure Starts Here")
if [ $CONTENT -gt 0 ]; then
    echo "✅ SUCCESS: English content deployed!"
else
    echo "❌ WARNING: English content not found, may need manual cache purge"
fi

echo "============================================="
echo "🎯 Deployment complete! Check https://windventure.fr"