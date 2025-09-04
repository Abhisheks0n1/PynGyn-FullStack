const Space = require('../models/Space');
const Project = require('../models/Project');
const Task = require('../models/Task');
const QuickDoc = require('../models/QuickDoc');
const User = require('../models/User');
const config = require('../config/config');


let spaces = [];
let projects = [];
let tasks = [];
let quickDocs = [];
let users = [];

function seedData() {
  spaces = [
    new Space(1, 'Marketing'),
    new Space(2, 'Finance')
  ];

  projects = [
    new Project(1, 'Campaign A', 1),
    new Project(2, 'Budget Planning', 2),
    new Project(3, 'Q4 Forecast', 2)
  ];

  users = [
    new User(1, 'Alice', 'IC', [1]),
    new User(2, 'Bob', 'Manager', [1, 2]),
    new User(3, 'Charlie', 'Director', [1, 2, 3])
  ];

  tasks = [
    new Task(1, 'Design Banner', 'Create visual', '2025-09-05', 'pending', 1, 1),
    new Task(2, 'Write Copy', 'Draft text', '2025-08-30', 'pending', 1, 1),
    new Task(3, 'Review Assets', 'Check quality', '2025-09-10', 'completed', 1, 1),
    new Task(4, 'Launch Ad', 'Deploy campaign', '2025-09-15', 'pending', 2, 1),
    new Task(5, 'Compile Expenses', 'Gather data', '2025-09-01', 'pending', 1, 2),
    new Task(6, 'Analyze Budget', 'Run numbers', '2025-09-20', 'completed', 2, 2),
    new Task(7, 'Forecast Revenue', 'Predict Q4', '2025-09-25', 'pending', 3, 3),
    new Task(8, 'Adjust Projections', 'Update based on data', '2025-08-25', 'pending', 3, 3),
    new Task(9, 'Present Findings', 'Prepare slides', '2025-09-12', 'pending', 1, 2),
    new Task(10, 'Audit Accounts', 'Review finances', '2025-09-30', 'completed', 2, 3)
  ];

  quickDocs = [
    new QuickDoc(1, 'Campaign Strategy', 'Details here', 1, [2], 1),
    new QuickDoc(2, 'Budget Guidelines', 'Rules', 2, [1, 3], 2),
    new QuickDoc(3, 'Forecast Model', 'Equations', 3, [], 3),
    new QuickDoc(4, 'Marketing Notes', 'Ideas', 1, [2], 1)
  ];
}


function isOverdue(task) {
  return task.status === 'pending' && task.dueDate < config.currentDate;
}

function isDueSoon(task) {
  const sevenDaysFromNow = new Date(config.currentDate);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  return task.status === 'pending' && task.dueDate >= config.currentDate && task.dueDate <= sevenDaysFromNow;
}

function getUser(userId) {
  return users.find(u => u.id === userId);
}

function getICDashboardData(userId) {
  const user = getUser(userId);
  if (!user || user.role !== 'IC') return null;

  const myTasks = tasks.filter(t => t.assignedTo === userId);
  const pending = myTasks.filter(t => t.status === 'pending' && !isOverdue(t) && !isDueSoon(t)).map(t => ({ id: t.id, title: t.title, due_date: t.dueDate.toISOString() }));
  const dueSoon = myTasks.filter(isDueSoon).map(t => ({ id: t.id, title: t.title, due_date: t.dueDate.toISOString() }));
  const overdue = myTasks.filter(isOverdue).map(t => ({ id: t.id, title: t.title, due_date: t.dueDate.toISOString() }));

  const myQuickDocs = quickDocs.filter(q => q.ownerId === userId || q.collaborators.includes(userId)).map(q => ({ id: q.id, title: q.title }));

  const recentActivity = tasks
    .filter(t => user.projects.includes(t.projectId))
    .sort((a, b) => b.id - a.id)
    .slice(0, 3)
    .map(t => ({ id: t.id, title: t.title, status: t.status }));

  return {
    my_tasks: { pending, due_soon: dueSoon, overdue },
    my_quick_docs: myQuickDocs,
    recent_activity: recentActivity
  };
}

function getManagerDashboardData(userId) {
  const user = getUser(userId);
  if (!user || user.role !== 'Manager') return null;

  const projectOverviews = user.projects.map(projId => {
    const projTasks = tasks.filter(t => t.projectId === projId);
    const total = projTasks.length;
    const completed = projTasks.filter(t => t.status === 'completed').length;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) + '%' : '0%';
    const pendingTasks = projTasks.filter(t => t.status === 'pending').length;
    const blockers = projTasks.filter(isOverdue).length;

    const proj = projects.find(p => p.id === projId);
    return { project_id: projId, project_name: proj.name, completion_rate: completionRate, pending_tasks: pendingTasks, blockers };
  });

  const sharedQuickDocs = quickDocs.filter(q => user.projects.includes(q.projectId)).map(q => ({ id: q.id, title: q.title }));

  return { projectOverviews, sharedQuickDocs };
}

function generateFallbackManagerSummary(projectOverviews) {
  const totalOverdues = projectOverviews.reduce((sum, p) => sum + p.blockers, 0);
  return `Team progress: ${projectOverviews.length} projects, ${totalOverdues} overdue tasks. Focus on blockers in high-overdue areas.`;
}

function getDirectorDashboardData(userId) {
  const user = getUser(userId);
  if (!user || user.role !== 'Director') return null;

  const allTasks = tasks;
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const completionPercent = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) + '%' : '0%';

  const overdueTrends = {};
  projects.forEach(proj => {
    const projOverdues = tasks.filter(t => t.projectId === proj.id && isOverdue(t)).length;
    if (projOverdues > 0) {
      overdueTrends[proj.name] = projOverdues;
    }
  });

  const quickDocUsage = {};
  spaces.forEach(space => {
    const spaceProjects = projects.filter(p => p.spaceId === space.id).map(p => p.id);
    const count = quickDocs.filter(q => spaceProjects.includes(q.projectId)).length;
    quickDocUsage[space.name] = count;
  });

  const kpis = { completion_percent: completionPercent, overdue_trends: overdueTrends };

  return { kpis, quickDocUsage };
}

function generateFallbackDirectorSummary(kpis) {
  const bottlenecks = Object.keys(kpis.overdue_trends).filter(name => {
    const projId = projects.find(p => p.name === name).id;
    const projTasks = tasks.filter(t => t.projectId === projId).length;
    return (kpis.overdue_trends[name] / projTasks) > 0.2;
  });
  return `Overall health: ${kpis.completion_percent} tasks completed. Bottlenecks in ${bottlenecks.join(', ') || 'none'}. Priorities: Address overdues in Finance space.`;
}

seedData();

module.exports = {
  getICDashboardData,
  getManagerDashboardData,
  generateFallbackManagerSummary,
  getDirectorDashboardData,
  generateFallbackDirectorSummary
};