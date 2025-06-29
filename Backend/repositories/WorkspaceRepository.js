import WorkspaceModel from '../models/Workspace.js';

class WorkspaceRepository {
  async create(data) {
    return WorkspaceModel.create(data);
  }

  async findById(workspaceId) {
    return WorkspaceModel.findOne({ workspaceId });
  }

  async findByName(workspaceName){
    return WorkspaceModel.findOne({name:workspaceName});
  }

  async findByOwner(userId) {
    return WorkspaceModel.find({ ownerId: userId });
  }

  async update(workspaceId, updates) {
    return WorkspaceModel.findOneAndUpdate({ workspaceId }, updates, { new: true });
  }

  async delete(workspaceId) {
    return WorkspaceModel.deleteOne({ workspaceId });
  }
}

export default new WorkspaceRepository();
