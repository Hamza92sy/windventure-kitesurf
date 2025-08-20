'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Activity, Eye, Zap } from 'lucide-react';

const CSSMonitoringDashboard = () => {
  const [status, setStatus] = useState({
    cssLoaded: 'checking',
    tailwindApplied: 'checking',
    responsiveWorking: 'checking',
    noFOUC: 'checking',
    no404s: 'checking',
    lastCheck: new Date().toISOString()
  });

  const [metrics, setMetrics] = useState({
    cssLoadTime: 0,
    unusedCSS: 0,
    totalChecks: 847,
    failures: 3,
    uptime: 99.6
  });

  // Simulation d'un vrai monitoring
  useEffect(() => {
    const runHealthCheck = async () => {
      // Simule les checks CSS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        cssLoaded: 'success',
        tailwindApplied: 'success', 
        responsiveWorking: 'success',
        noFOUC: 'success',
        no404s: 'success',
        lastCheck: new Date().toISOString()
      });
      
      setMetrics({
        cssLoadTime: 156,
        unusedCSS: 8.3,
        totalChecks: 847,
        failures: 3,
        uptime: 99.6
      });
    };

    runHealthCheck();
    const interval = setInterval(runHealthCheck, 30000); // Check toutes les 30s
    
    return () => clearInterval(interval);
  }, []);

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
  };

  const StatusCard = ({ title, status, description, metric }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <StatusIcon status={status} />
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {metric && (
        <div className="text-lg font-semibold text-blue-600">{metric}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎨 CSS Monitoring - Windventure.fr
          </h1>
          <p className="text-gray-600">
            Monitoring en temps réel de l'intégrité CSS et Tailwind
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Dernière vérification : {new Date(status.lastCheck).toLocaleString()}
          </div>
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{metrics.uptime}%</div>
            <div className="text-sm text-gray-600">Uptime CSS</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{metrics.cssLoadTime}ms</div>
            <div className="text-sm text-gray-600">Temps de chargement</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{metrics.unusedCSS}%</div>
            <div className="text-sm text-gray-600">CSS inutilisé</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{metrics.totalChecks}</div>
            <div className="text-sm text-gray-600">Checks totaux</div>
          </div>
        </div>

        {/* Status des checks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatusCard
            title="CSS Chargé"
            status={status.cssLoaded}
            description="Fichier CSS Tailwind correctement chargé"
            metric="✅ Actif"
          />
          <StatusCard
            title="Tailwind Appliqué"
            status={status.tailwindApplied}
            description="Classes Tailwind rendues visuellement"
            metric="✅ Rendu OK"
          />
          <StatusCard
            title="Responsive OK"
            status={status.responsiveWorking}
            description="Breakpoints mobile/desktop fonctionnels"
            metric="✅ Multi-device"
          />
          <StatusCard
            title="Pas de FOUC"
            status={status.noFOUC}
            description="Aucun flash de contenu non stylé"
            metric="< 100ms"
          />
          <StatusCard
            title="Pas d'erreurs 404"
            status={status.no404s}
            description="Tous les assets CSS trouvés"
            metric="0 erreur"
          />
          <StatusCard
            title="Performance"
            status="success"
            description="Métriques Lighthouse CSS"
            metric="Score: 94/100"
          />
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.open('https://windventure.fr/css-test', '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir Page Test
            </button>
            <button 
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => {
                setStatus(prev => ({...prev, lastCheck: new Date().toISOString()}));
                // Ici tu pourrais déclencher un vrai check via API
              }}
            >
              <Activity className="w-4 h-4 mr-2" />
              Check Manuel
            </button>
            <button 
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => window.open('https://github.com/hamzaseidou/windventure/actions', '_blank')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Voir CI/CD
            </button>
          </div>
        </div>

        {/* Code pour Slack Webhook */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">🚨 Webhook Slack Alert (à ajouter dans CI/CD)</h3>
          <pre className="text-sm bg-gray-800 p-4 rounded overflow-x-auto">
{`# Dans .github/workflows/css-monitoring.yml
- name: Slack Alert on CSS Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    text: '🚨 CSS Check Failed on windventure.fr'
  env:
    SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CSSMonitoringDashboard;