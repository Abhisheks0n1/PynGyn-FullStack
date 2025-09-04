class QuickDoc {
  constructor(id, title, content, ownerId, collaborators, projectId) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.ownerId = ownerId;
    this.collaborators = collaborators;
    this.projectId = projectId;
  }
}

module.exports = QuickDoc;