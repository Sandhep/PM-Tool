import crypto from 'crypto';
import BadRequestException from '../exceptions/BadRequestException.js';
import MailService from './MailService.js';
import ProjectMemberService from './ProjectMemberService.js';
import UserRepository from '../repositories/UserRepository.js';
import InvitationRepository from '../repositories/InvitationRepository.js';
import AuthService from './AuthService.js';
import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import ConflictException from '../exceptions/ConflictException.js';
import WorkspaceMemberRepository from '../repositories/WorkspaceMemberRepository.js';
import WorkSpaceService from './WorkSpaceService.js';

class UserService{

    constructor(){
      this.inviteUser = this.inviteUser.bind(this);
      this.acceptInvitation = this.acceptInvitation.bind(this);
      this.getSentInvitations = this.getSentInvitations.bind(this);
      this.removeInvitation = this.removeInvitation.bind(this);
    }

    async inviteUser(inviteUserDTO) {

        const user = await WorkspaceMemberRepository.findByWorkspaceAndEmail(inviteUserDTO.workspaceId,inviteUserDTO.email);

        if(user){
           throw new ConflictException("User is already a member of the Workspace");
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs
    
        await MailService.sendInviteMail(inviteUserDTO, token);
    
        const invitation = await InvitationRepository.create({
          email: inviteUserDTO.email,
          workspaceId: inviteUserDTO.workspaceId,
          invitedBy: inviteUserDTO.invitedBy,
          token,
          expiresAt,
        });
    
        return invitation;
    }
    
    async acceptInvitation(acceptInviteDTO) {

        const invite = await InvitationRepository.findByStatus(acceptInviteDTO.token, 'Pending');
    
        if (!invite) {
          throw new BadRequestException("Invitation invalid");
        }

        if(invite.expiresAt < new Date()){
          invite.status = 'Expired';
          invite.save();
          throw new BadRequestException("Invitation Expired");
        }
    
        let user = await UserRepository.findByEmail(invite.email);
    
        if (!user) {
          user = await AuthService.register({
            name: acceptInviteDTO.name,
            email: invite.email,
            password: acceptInviteDTO.password
          });
        }
    
        await WorkSpaceService.addMember(invite.workspaceId, user.userId, invite.role, invite.invitedBy);
    
        await InvitationRepository.updateStatus(acceptInviteDTO.token, 'Accepted');
    
        return user;
    }

    async getSentInvitations(userId, filters) {
        return await InvitationRepository.findFilteredInvitations({
          invitedBy: userId,
          ...filters
        });
    }

    async removeInvitation(invitationId, invitedBy) {
      const deleted = await InvitationRepository.deleteById(invitationId, invitedBy);
      if (!deleted) {
        throw new BadRequestException("Invalid or unauthorized invitation removal");
      }
      return { message: "Invitation removed successfully" };
    }



}

export default new UserService();