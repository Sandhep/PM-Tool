import ProjectMemberService from '../services/ProjectMemberService.js';

class ProjectMemberController {

  async listMembers(req, res, next) {
    try {
      const members = await ProjectMemberService.getMembers(req.params.projectId);
      res.status(200).json(members);
    } catch (err) {
      next(err);
    }
  }

  async updateScope(req, res, next) {
    try {
      const updated = await ProjectMemberService.updateScope(
        req.params.projectId,
        req.body.userId,
        req.body.scope
      );
      res.status(200).json({ message: 'Scope updated', member: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await ProjectMemberService.removeMember(
        req.params.projectId,
        req.params.userId
      );
      res.status(200).json({ message: 'Member removed' });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProjectMemberController();
