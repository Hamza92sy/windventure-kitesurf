'use client';

import { useEffect } from 'react';

export default function CSSFixer() {
  useEffect(() => {
    // Supprime tous les styles inline du body
    const cleanBodyStyles = () => {
      const body = document.body;
      
      // Log pour debug
      if (body.style.cssText) {
                      }
      
      // Supprime TOUS les styles inline
      body.removeAttribute('style');
      
      // Force les classes Tailwind à reprendre le contrôle
      if (!body.className.includes('min-h-screen')) {
        body.className = `${body.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`.trim();
      }
      
          };

    // Nettoyage immédiat
    cleanBodyStyles();
    
    // Observer pour détecter si quelque chose réinjecte des styles
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          console.warn('⚠️ Style inline réinjecté, nettoyage automatique...');
          cleanBodyStyles();
        }
      });
    });
    
    // Surveille les changements sur body
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
  
  return null;
}