import ProjectMemberRepository from '../repository/ProjectMemberRepository.js';
import NotFoundException from '../../../common/exceptions/NotFoundException.js';
import UserRepository from '../../User/repository/UserRepository.js';
import ConflictException from '../../../common/exceptions/ConflictException.js';
import ProjectRepository from '../repository/ProjectRepository.js';
import log from '../../../common/utils/Logger.js';

class ProjectMemberService {

   constructor(){
    this.getMembers = this.getMembers.bind(this);
    this.addUserToProject = this.addUserToProject.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.updateRole = this.updateRole.bind(this);
  }
    
  async getMembers(projectId) {

      const project = await ProjectRepository.findById(projectId);

      if(!project){
         throw new NotFoundException('Project not found');
      }
    
      const projectMembers = await ProjectMemberRepository.findAllByProject(projectId);
      if (!projectMembers.length) return { members: [] };

      const userIds = projectMembers.map(m => m.userId);
      const addedByIds = projectMembers.map(m => m.addedBy).filter(Boolean);
      const allUserIds = [...new Set([...userIds, ...addedByIds])];

      const users = await UserRepository.findByUserIds(allUserIds);
      const userMap = new Map(users.map(u => [u.userId, u]));

      const userList = projectMembers.map(member => {
        const user = userMap.get(member.userId);
        const addedByUser = userMap.get(member.addedBy);

        return {
          name: user?.name || '',
          email: user?.email || '',
          userId: user?.userId || member.userId,
          role: member.role,
          scope: member.scope,
          addedBy: addedByUser?.name || '',
          addedAt: member.addedAt,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        };
      });

      log.info(`Fetched Project members for Project: ${projectId}`);

      return {
        members: {
          projectId,
          ownerId:project.ownerId,
          user: userList
        }
      };
    }


  async updateRole(dto) {

    const {projectId, userId, role} = dto;

    const member = await ProjectMemberRepository.updateRole(projectId, userId, role);
    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    log.info(`Role updated for user: ${userId} in project: ${projectId}`);

    return member;
  }

  async addUserToProject(dto){

    const {addedBy,userId,projectId,role} = dto;

    const user = await ProjectMemberRepository.findByProjectAndUser(projectId,userId);

    if(user){
       throw new ConflictException('User Already exists in the Project');
    }

    await ProjectMemberRepository.addMember({
          projectId: projectId,
          userId: userId,
          role: role,
          addedBy: addedBy,
        });

    log.info(`User :${userId} added in project: ${projectId}`);    
  }

  async removeMember(projectId, userId) {

    log.info(`User :${userId} removed from project: ${projectId}`); 

    return ProjectMemberRepository.removeMember(projectId, userId);
  }

}

export default new ProjectMemberService();
