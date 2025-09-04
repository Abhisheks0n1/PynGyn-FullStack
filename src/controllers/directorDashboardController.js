const dataService = require('../services/dataService');
const aiService = require('../services/aiService');

async function getDirectorDashboard(req, res) {
  const userId = parseInt(req.query.user_id);
  try {
    const { kpis, quickDocUsage } = dataService.getDirectorDashboardData(userId);
    if (!kpis) return res.status(400).json({ error: 'Invalid user or role' });

    let executiveSummary;
    try {
      executiveSummary = await aiService.generateDirectorSummary(kpis, quickDocUsage);
    } catch (aiError) {
      console.error('AI summary failed:', aiError);
      executiveSummary = dataService.generateFallbackDirectorSummary(kpis);
    }

    res.json({
      kpis,
      quick_doc_usage: quickDocUsage,
      executive_summary: executiveSummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getDirectorDashboard };