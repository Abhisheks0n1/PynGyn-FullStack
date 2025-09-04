const dataService = require('../services/dataService');
const aiService = require('../services/aiService');

async function getManagerDashboard(req, res) {
  const userId = parseInt(req.query.user_id);
  try {
    const { projectOverviews, sharedQuickDocs } = dataService.getManagerDashboardData(userId);
    if (!projectOverviews) return res.status(400).json({ error: 'Invalid user or role' });

    let weeklySummary;
    try {
      weeklySummary = await aiService.generateManagerSummary(projectOverviews);
    } catch (aiError) {
      console.error('AI summary failed:', aiError);
      weeklySummary = dataService.generateFallbackManagerSummary(projectOverviews);
    }

    res.json({
      project_overviews: projectOverviews,
      shared_quick_docs: sharedQuickDocs,
      weekly_summary: weeklySummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getManagerDashboard };