const dataService = require('../services/dataService');

async function getICDashboard(req, res) {
  const userId = parseInt(req.query.user_id);
  try {
    const data = dataService.getICDashboardData(userId);
    if (!data) return res.status(400).json({ error: 'Invalid user or role' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getICDashboard };