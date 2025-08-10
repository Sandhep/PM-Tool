import Invitation from "../model/Invitation.js";

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

  async findFilteredInvitations({ invitedBy, page, limit, role, status, email }) {
    
    const query = { invitedBy };

    if (role) query.role = role;
    if (status) query.status = status;
    if (email) query.email = { $regex: email, $options: 'i' }; // case-insensitive partial match

    const skip = (page - 1) * limit;

    const [invitations, total] = await Promise.all([
      Invitation.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Invitation.countDocuments(query)
    ]);

    const hasNext = page * limit < total;
    const hasPrevious = page > 1;

    return {
      invitations,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext,
        hasPrevious
      }
    };
  }

  async deleteById(invitationId, invitedBy) {
    const result = await Invitation.findOneAndDelete({ invitationId, invitedBy });
    return result;
  }


}

export default new InvitationRepository();
