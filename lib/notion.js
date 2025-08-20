// 🔗 NOTION INTEGRATION - Connection Claude ↔ Notion
// Gestion automatique des projets et tâches

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

class NotionManager {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  // 📝 Créer une nouvelle entrée de projet
  async createProject({
    name,
    status = '🟢 En cours',
    type = '🔧 Fix technique',
    priority = '📋 Normale',
    description = '',
    repository = '',
    branch = 'main',
    commitSha = ''
  }) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          'Nom': {
            title: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          'Status': {
            select: {
              name: status,
            },
          },
          'Type': {
            select: {
              name: type,
            },
          },
          'Priorité': {
            select: {
              name: priority,
            },
          },
          'Repository': {
            url: repository,
          },
          'Branch': {
            rich_text: [
              {
                text: {
                  content: branch,
                },
              },
            ],
          },
          'Commit SHA': {
            rich_text: [
              {
                text: {
                  content: commitSha,
                },
              },
            ],
          },
          'Description': {
            rich_text: [
              {
                text: {
                  content: description,
                },
              },
            ],
          },
        },
      });

      console.log('✅ Projet créé dans Notion:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Erreur création projet Notion:', error);
      throw error;
    }
  }

  // 🔄 Mettre à jour le statut d'un projet
  async updateProjectStatus(pageId, status, results = '') {
    try {
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties: {
          'Status': {
            select: {
              name: status,
            },
          },
          'Résultats': {
            rich_text: [
              {
                text: {
                  content: results,
                },
              },
            ],
          },
        },
      });

      console.log('✅ Statut mis à jour dans Notion');
      return response;
    } catch (error) {
      console.error('❌ Erreur mise à jour Notion:', error);
      throw error;
    }
  }

  // 📊 Lister tous les projets
  async getProjects(filter = {}) {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter,
        sorts: [
          {
            property: 'Dernière Mise à Jour',
            direction: 'descending',
          },
        ],
      });

      return response.results;
    } catch (error) {
      console.error('❌ Erreur lecture projets Notion:', error);
      throw error;
    }
  }

  // 🔍 Rechercher un projet par nom
  async findProjectByName(name) {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Nom',
          title: {
            contains: name,
          },
        },
      });

      return response.results[0] || null;
    } catch (error) {
      console.error('❌ Erreur recherche projet:', error);
      return null;
    }
  }

  // 📈 Statistiques des projets
  async getProjectStats() {
    try {
      const projects = await this.getProjects();
      
      const stats = {
        total: projects.length,
        enCours: 0,
        termines: 0,
        problemes: 0,
        urgents: 0,
      };

      projects.forEach(project => {
        const status = project.properties.Status?.select?.name;
        const priority = project.properties.Priorité?.select?.name;

        if (status === '🟢 En cours') stats.enCours++;
        if (status === '✅ Terminé') stats.termines++;
        if (status === '⚠️ Problème') stats.problemes++;
        if (priority === '🔥 Critique') stats.urgents++;
      });

      return stats;
    } catch (error) {
      console.error('❌ Erreur stats projets:', error);
      return null;
    }
  }

  // 🧪 Tester la connexion
  async testConnection() {
    try {
      // Tester l'accès à la database
      const response = await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });

      console.log('✅ Connexion Notion réussie!');
      console.log('📊 Database:', response.title[0]?.plain_text || 'Sans nom');
      return true;
    } catch (error) {
      console.error('❌ Erreur connexion Notion:', error.message);
      return false;
    }
  }
}

module.exports = { NotionManager };