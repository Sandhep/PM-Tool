import UserService from "../service/UserService.js";
import InviteUserDTO from "../dto/InviteUserDTO.js";
import AcceptInviteDTO from "../dto/AcceptInviteDTO.js";
import FilterInvitationsDTO from "../dto/FilterInvitationsDTO.js";

class UserController{

    constructor(){
      this.inviteUser = this.inviteUser.bind(this);
      this.acceptInvitation = this.acceptInvitation.bind(this);
      this.getSentInvitations = this.getSentInvitations.bind(this);
      this.removeInvitation = this.removeInvitation.bind(this);
    }

    async inviteUser(req, res, next) {
        try {
          const data = { ...req.body, invitedBy: req.user.userId };
          const dto = new InviteUserDTO(data);
          const invitation = await UserService.inviteUser(dto);
          res.status(200).json({ message: 'Invitation sent successfully', invitation });
        } catch (error) {
          next(error);
        }
    }
    
    async acceptInvitation(req, res, next) {
        try {
          const dto = new AcceptInviteDTO(req.body);
          const user = await UserService.acceptInvitation(dto);
          res.status(201).json({ message: 'Invitation accepted', user });
        } catch (error) {
          next(error);
        }
    }

    async getSentInvitations(req, res, next) {
        try {
          const userId = req.user.userId;
          const dto = new FilterInvitationsDTO({ ...req.body });
          const result = await UserService.getSentInvitations(userId, dto);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
    }

    async removeInvitation(req, res, next) {
        try {
          const { invitationId } = req.params;
          const invitedBy = req.user.userId;
          const result = await UserService.removeInvitation(invitationId, invitedBy);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
    }


}

export default new UserController();