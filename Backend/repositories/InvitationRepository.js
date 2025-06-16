import Invitation from "../models/Invitation.js";

class InvitationRepository {

  async findByEmail(email) {
    return await Invitation.findOne({email});
  }

  async findByStatus(token,status){
    return await Invitation.findOne({ token: token, status: status });
  }

  async findByUserId(invitedBy) {
    return await Invitation.findOne({invitedBy});
  }

  async create(inviteData) {
    return new Invitation(inviteData).save();
  }

  async updateStatus(token,status){
    const invite = await Invitation.findOne({ token: token});
    invite.status = status;
    await invite.save();
    return invite;
  }
}

export default new InvitationRepository();
