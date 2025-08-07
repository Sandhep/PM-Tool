import WorkspaceModel from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';

class WorkspaceRepository {

  constructor(){
    this.findFilteredWorkspaces = this.findFilteredWorkspaces.bind(this);
  }

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

  async update(dto) {
    const {workspaceId, name, description} = dto;
    return WorkspaceModel.findOneAndUpdate({ workspaceId },{name, description}, { new: true });
  }

  async delete(workspaceId) {
    return WorkspaceModel.deleteOne({ workspaceId });
  }

  async findFilteredWorkspaces({userId,membership,page,limit,search}) {

  const skip = (page - 1) * limit;

  let workspaceFilter = {};
  let workspaceIds = [];

  // If search is applied, prepare $regex filter for name/description
  if (search) {
    workspaceFilter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (membership === 'Owner') {
    // Filter by owner
    workspaceFilter.ownerId = userId;

    const [workspaces, total] = await Promise.all([
      WorkspaceModel.find(workspaceFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WorkspaceModel.countDocuments(workspaceFilter)
    ]);

    return this.formatPaginatedResult({ workspaces, total, page, limit });
  }

  // Get workspace memberships
  const roleFilter =
    membership === 'Admin' || membership === 'Member'
      ? { role: membership }
      : {}; // No role filter for 'All'

  const memberRecords = await WorkspaceMember.find({
    userId,
    ...roleFilter
  }).select('workspaceId');

  workspaceIds = memberRecords.map((entry) => entry.workspaceId);

  if (workspaceIds.length === 0) {
    return this.formatPaginatedResult({ workspaces: [], total: 0, page, limit });
  }

  workspaceFilter.workspaceId = { $in: workspaceIds };

  const [workspaces, total] = await Promise.all([
    WorkspaceModel.find(workspaceFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    WorkspaceModel.countDocuments(workspaceFilter)
  ]);

  return this.formatPaginatedResult({ workspaces, total, page, limit });
}

formatPaginatedResult({ workspaces, total, page, limit }) {
  return {
    workspaces,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      hasNext: page * limit < total,
      hasPrevious: page > 1
    }
  };
}

}

export default new WorkspaceRepository();
