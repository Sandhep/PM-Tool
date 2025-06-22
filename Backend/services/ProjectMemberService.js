import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import UserRepository from '../repositories/UserRepository.js';

class ProjectMemberService {
    
  async getMembers(projectId) {
    
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

      return {
        members: {
          projectId,
          user: userList
        }
      };
    }


  async updateScope(projectId, userId, scope) {

    const member = await ProjectMemberRepository.updateScope(projectId, userId, scope);
    if (!member) {
      throw new NotFoundException('Project member not found');
    }
    return member;
  }

  async addUserToProject(inviterId,userId,projectId,role,scope){

    await ProjectMemberRepository.addMember({
          projectId: projectId,
          userId: userId,
          role: role,
          scope: scope,
          addedBy: inviterId,
        });
  }

  async removeMember(projectId, userId) {
    return ProjectMemberRepository.removeMember(projectId, userId);
  }

}

export default new ProjectMemberService();
