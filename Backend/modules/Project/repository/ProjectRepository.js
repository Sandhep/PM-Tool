import ProjectConstants from '../../../common/constants/ProjectConstants.js';
import Project from '../model/Project.js';
import ProjectMember from '../model/ProjectMember.js';

class ProjectRepository {

  constructor(){
    this.findFilteredProjects = this.findFilteredProjects.bind(this);
  }
  async create(projectData) {
    return new Project(projectData).save();
  }

  async findById(projectId) {
    return Project.findOne({ projectId });
  }

  async findByIds(projectIds) {
    return await Project.find({ projectId: { $in: projectIds } });
  }
  
  async findByWorkspace(workspaceId,projectIds){
    return await Project.find({workspaceId,projectId:{$in:projectIds}});
  }

  async findByWorkspace(workspaceId){
    return await Project.find({workspaceId});
  }


  async findByParentProject(parentProjectId){
    return await Project.find({parentProjectId});       
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

  async findFilteredProjects({ userId, membership, workspaceId, page, limit, search, status,visibility }) {
      const skip = (page - 1) * limit;
      let projectFilter = {};
      let projectIds = [];

      projectFilter.workspaceId = workspaceId;
  
      // Search filter for name/description
      if (search) {
        projectFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Status filter
      if (status) {
        projectFilter.status = status; // exact match, change to regex if needed
      }
  
      //visibility filter
  
      if(visibility){
        projectFilter.visibility = visibility;
      }
  
      if (membership === 'Owner') {
        // Owner filter
        projectFilter.ownerId = userId;
  
        // Fetch projects by workspace
        const [projects, total] = await Promise.all([
          Project.find(projectFilter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
          Project.countDocuments(projectFilter)
        ]);
  
        return this.formatPaginatedResult({ projects, total, page, limit });
      }
  
      // Membership filter
      const roleFilter = ProjectConstants.PROJECT_READ_ACCESS.includes(membership) ? { role: membership } : {}; // For 'All'
  
      const memberRecords = await ProjectMember.find({
        userId,
        ...roleFilter
      }).select('projectId');
  
      projectIds = memberRecords.map(entry => entry.projectId);
  
      if (projectIds.length === 0) {
        return this.formatPaginatedResult({ projects: [], total: 0, page, limit });
      }
  
      projectFilter.projectId = { $in: projectIds };
  
      const [projects, total] = await Promise.all([
          Project.find(projectFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
          Project.countDocuments(projectFilter)
      ]);
  
      return this.formatPaginatedResult({ projects, total, page, limit });
   }
  
   formatPaginatedResult({ projects, total, page, limit }) {
    
      return {
        projects,
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

export default new ProjectRepository();
