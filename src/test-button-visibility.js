// 🚨 SCRIPT DE DIAGNOSTIC BOUTONS - WINDVENTURE
// Usage: node test-button-visibility.js

const https = require('https');

console.log('🔍 DIAGNOSTIC BOUTONS WINDVENTURE');
console.log('====================================');

// Test 1: Vérifier le rendu des packages
async function testPackagesRendering() {
  console.log('\n1️⃣ TEST RENDU PACKAGES:');

  try {
    const response = await fetch('https://windventure.fr/packages');
    const html = await response.text();

    // Compter les packages
    const packageMatches = html.match(/Enhanced Package Card/g);
    console.log(
      `📦 Packages trouvés: ${packageMatches ? packageMatches.length : 0}`
    );

    // Chercher les boutons
    const buttonMatches = html.match(/Book This Package/g);
    console.log(
      `🔘 Boutons "Book This Package" trouvés: ${buttonMatches ? buttonMatches.length : 0}`
    );

    // Chercher les liens vers /book
    const bookLinks = html.match(/href="[^"]*\/book[^"]*"/g);
    console.log(`🔗 Liens /book trouvés: ${bookLinks ? bookLinks.length : 0}`);

    // Afficher les classes CSS
    const classes = html.match(/class="[^"]*"/g);
    const uniqueClasses = [...new Set(classes)];
    console.log(`🎨 Classes CSS uniques: ${uniqueClasses.length}`);

    // Chercher les styles inline
    const inlineStyles = html.match(/style="[^"]*"/g);
    console.log(
      `💅 Styles inline trouvés: ${inlineStyles ? inlineStyles.length : 0}`
    );
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Test 2: Vérifier les styles CSS
async function testCSSStyles() {
  console.log('\n2️⃣ TEST STYLES CSS:');

  try {
    const response = await fetch('https://windventure.fr/globals.css');
    const css = await response.text();

    // Chercher les règles qui cachent les éléments
    const hiddenRules = css.match(
      /display:\s*none|visibility:\s*hidden|opacity:\s*0/g
    );
    console.log(
      `🚫 Règles cachantes trouvées: ${hiddenRules ? hiddenRules.length : 0}`
    );

    // Chercher les règles pour les boutons
    const buttonRules = css.match(/\.book|\.button|a\[href.*book\]/g);
    console.log(
      `🔘 Règles boutons trouvées: ${buttonRules ? buttonRules.length : 0}`
    );
  } catch (error) {
    console.error('❌ Erreur lors du test CSS:', error.message);
  }
}

// Test 3: Vérifier la console pour erreurs
function testConsoleErrors() {
  console.log('\n3️⃣ TEST CONSOLE ERRORS:');
  console.log('📱 Ouvrez la console du navigateur (F12) et vérifiez:');
  console.log('   - Erreurs JavaScript');
  console.log('   - Messages de debug 🔍');
  console.log('   - Nombre de boutons trouvés');
}

// Test 4: Instructions de test manuel
function manualTestInstructions() {
  console.log('\n4️⃣ TEST MANUEL REQUIS:');
  console.log('🌐 Ouvrez https://windventure.fr/packages');
  console.log('🔍 Inspectez avec F12 → Elements');
  console.log('🔍 Cherchez les éléments avec href="/book"');
  console.log('🔍 Vérifiez les styles computed');
  console.log('🔍 Testez le bouton rouge "TEST BOUTON VISIBLE"');
  console.log('🔍 Testez les boutons verts "🚀 BOOK THIS PACKAGE"');
}

// Exécuter tous les tests
async function runAllTests() {
  await testPackagesRendering();
  await testCSSStyles();
  testConsoleErrors();
  manualTestInstructions();

  console.log('\n✅ DIAGNOSTIC TERMINÉ');
  console.log('📋 Vérifiez les résultats ci-dessus');
}

// Exécuter si appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
