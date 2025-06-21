import crypto from 'crypto';
import BadRequestException from '../exceptions/BadRequestException.js';
import MailService from './MailService.js';
import UserRepository from '../repositories/UserRepository.js';
import InvitationRepository from '../repositories/InvitationRepository.js';
import AuthService from './AuthService.js';

class UserService{

    async inviteUser(inviteUserDTO) {

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs
    
        await MailService.sendInviteMail(inviteUserDTO, token);
    
        const invitation = await InvitationRepository.create({
          email: inviteUserDTO.email,
          projectId: inviteUserDTO.projectId,
          invitedBy: inviteUserDTO.invitedBy,
          token,
          role: inviteUserDTO.role,
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
    
        // TODO: Add user to project
        // await ProjectService.addUserToProject(user._id, invite.projectId, invite.role);
    
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