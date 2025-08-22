const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);

  // Extract scores and metrics
  const { lhr } = runnerResult;
  const scores = {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100)
  };

  // Extract Core Web Vitals
  const metrics = {
    FCP: lhr.audits['first-contentful-paint'].numericValue,
    LCP: lhr.audits['largest-contentful-paint'].numericValue,
    CLS: lhr.audits['cumulative-layout-shift'].numericValue,
    TBT: lhr.audits['total-blocking-time'].numericValue,
    SI: lhr.audits['speed-index'].numericValue,
    TTI: lhr.audits['interactive'].numericValue
  };

  console.log('\n🎯 LIGHTHOUSE SCORES:');
  console.log('=====================');
  console.log(`Performance: ${scores.performance}/100 ${scores.performance >= 90 ? '✅' : '⚠️'}`);
  console.log(`Accessibility: ${scores.accessibility}/100 ${scores.accessibility === 100 ? '✅' : '⚠️'}`);
  console.log(`Best Practices: ${scores.bestPractices}/100 ${scores.bestPractices === 100 ? '✅' : '⚠️'}`);
  console.log(`SEO: ${scores.seo}/100 ${scores.seo === 100 ? '✅' : '⚠️'}`);

  console.log('\n📊 CORE WEB VITALS:');
  console.log('==================');
  console.log(`FCP (First Contentful Paint): ${(metrics.FCP/1000).toFixed(2)}s ${metrics.FCP < 1800 ? '✅' : '⚠️'}`);
  console.log(`LCP (Largest Contentful Paint): ${(metrics.LCP/1000).toFixed(2)}s ${metrics.LCP < 2500 ? '✅' : '⚠️'}`);
  console.log(`CLS (Cumulative Layout Shift): ${metrics.CLS.toFixed(3)} ${metrics.CLS < 0.1 ? '✅' : '⚠️'}`);
  console.log(`TBT (Total Blocking Time): ${metrics.TBT}ms ${metrics.TBT < 200 ? '✅' : '⚠️'}`);
  console.log(`SI (Speed Index): ${(metrics.SI/1000).toFixed(2)}s ${metrics.SI < 3400 ? '✅' : '⚠️'}`);
  console.log(`TTI (Time to Interactive): ${(metrics.TTI/1000).toFixed(2)}s ${metrics.TTI < 3800 ? '✅' : '⚠️'}`);

  // Save full report
  fs.writeFileSync('lighthouse-report.json', JSON.stringify(lhr, null, 2));
  console.log('\n💾 Full report saved to lighthouse-report.json');

  await chrome.kill();
  return { scores, metrics };
}

// Run if executed directly
if (require.main === module) {
  runLighthouse()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error running Lighthouse:', err);
      process.exit(1);
    });
}

module.exports = { runLighthouse };