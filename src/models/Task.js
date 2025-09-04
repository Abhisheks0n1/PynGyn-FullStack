class Task {
  constructor(id, title, description, dueDate, status, assignedTo, projectId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.status = status;
    this.assignedTo = assignedTo;
    this.projectId = projectId;
  }
}

module.exports = Task;