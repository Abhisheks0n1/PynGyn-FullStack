const express = require('express');
const icDashboardController = require('../controllers/icDashboardController');
const managerDashboardController = require('../controllers/managerDashboardController');
const directorDashboardController = require('../controllers/directorDashboardController');

const router = express.Router();

router.get('/dashboard/ic', icDashboardController.getICDashboard);
router.get('/dashboard/manager', managerDashboardController.getManagerDashboard);
router.get('/dashboard/director', directorDashboardController.getDirectorDashboard);

module.exports = router;