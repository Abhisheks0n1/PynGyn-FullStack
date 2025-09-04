const OpenAI = require('openai');
const config = require('../config/config');

const openai = new OpenAI({ apiKey: config.openaiApiKey });

async function generateManagerSummary(projectOverviews) {
  const prompt = `
    Generate a concise weekly team progress summary based on these project overviews:
    ${JSON.stringify(projectOverviews, null, 2)}
    Include key metrics like completion rates, pending tasks, and blockers. Suggest focus areas for the team.
  `;

  const response = await openai.chat.completions.create({
    model: config.openaiModel,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content.trim();
}

async function generateDirectorSummary(kpis, quickDocUsage) {
  const prompt = `
    Generate an executive summary for organizational health based on these KPIs and Quick Doc usage:
    KPIs: ${JSON.stringify(kpis, null, 2)}
    Quick Doc Usage: ${JSON.stringify(quickDocUsage, null, 2)}
    Highlight completion percent, overdue trends, bottlenecks (projects with >20% overdues), project health, and priorities. Detect trends using NLP.
  `;

  const response = await openai.chat.completions.create({
    model: config.openaiModel,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content.trim();
}

module.exports = {
  generateManagerSummary,
  generateDirectorSummary
};