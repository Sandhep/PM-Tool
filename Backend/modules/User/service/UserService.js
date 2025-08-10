import crypto from 'crypto';
import BadRequestException from '../../../common/exceptions/BadRequestException.js';
import MailService from '../../Notification/service/MailService.js';
import UserRepository from '../repository/UserRepository.js';
import InvitationRepository from '../../Invitation/repository/InvitationRepository.js';
import AuthService from '../../Authentication/service/AuthService.js';
import ConflictException from '../../../common/exceptions/ConflictException.js';
import WorkspaceMemberRepository from '../../Workspace/repository/WorkspaceMemberRepository.js';
import WorkSpaceService from '../../Workspace/service/WorkSpaceService.js';
import log from '../../../common/utils/Logger.js';

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
    
        log.info('User invited');
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
    
        log.info('Invite accepted');
        return user;
    }

    async getSentInvitations(userId, filters) {
        log.info('fetched invitations');
        return await InvitationRepository.findFilteredInvitations({
          invitedBy: userId,
          ...filters
        });
    }

    async removeInvitation(invitationId, invitedBy) {
      log.info('deleted invite');
      const deleted = await InvitationRepository.deleteById(invitationId, invitedBy);
      if (!deleted) {
        throw new BadRequestException("Invalid or unauthorized invitation removal");
      }
      return { message: "Invitation removed successfully" };
    }

}

export default new UserService();