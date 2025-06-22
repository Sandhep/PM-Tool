import Project from '../models/Project.js';

class ProjectRepository {
  async create(projectData) {
    return new Project(projectData).save();
  }

  async findById(projectId) {
    return Project.findOne({ projectId });
  }

  async findByIds(projectIds) {
    return await Project.find({ projectId: { $in: projectIds } });
  }

  async findByUser(userId) {
    return Project.find({ createdBy: userId }).sort({ createdAt: -1 });
  }

  async update(projectId, updates) {
    return Project.findOneAndUpdate({ projectId }, updates, { new: true });
  }

  async delete(projectId) {
    return Project.findOneAndDelete({ projectId });
  }
}

export default new ProjectRepository();
