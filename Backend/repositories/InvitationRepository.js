import Invitation from "../models/Invitation.js";

class InvitationRepository {

  async findByEmail(email) {
    return Invitation.findOne({email});
  }

  async findByUserId(invitedBy) {
    return Invitation.findOne({invitedBy});
  }

  async create(inviteData) {
    return new Invitation(inviteData).save();
  }
}

export default new InvitationRepository();
