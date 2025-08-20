module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['performance'],
        // Audit spécifique CSS
        onlyAudits: [
          'render-blocking-resources',
          'unused-css-rules',
          'critical-request-chains',
          'first-contentful-paint',
          'largest-contentful-paint',
        ],
      },
    },
    assert: {
      assertions: {
        'unused-css-rules': ['warn', { maxLength: 0.1 }], // Max 10% CSS inutilisé
        'render-blocking-resources': 'off', // Tailwind CSS peut être bloquant, c'est normal
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
      },
    },
  },
};