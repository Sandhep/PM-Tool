// dtos/InviteUserDTO.js
import BadRequestException from "../exceptions/BadRequestException.js";
import Utils from "../utils/Utils.js";

export default class InviteUserDTO {
  constructor(data) {
    const { email, workspaceId, invitedBy } = data;

    if (!email || typeof email !== 'string') {
      throw new BadRequestException("Email is required and must be a string");
    }

    if(!Utils.isValidEmail(email)){
      throw new BadRequestException("Invalid email format");
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw new BadRequestException("Workspace ID is required and must be a string");
    }

    if (!invitedBy || typeof invitedBy !== 'string') {
      throw new BadRequestException("Inviting user is missing");
    }

    this.email = email;
    this.workspaceId = workspaceId;
    this.invitedBy = invitedBy;
  }
}
