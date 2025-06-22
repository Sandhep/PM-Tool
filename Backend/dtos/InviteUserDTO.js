// dtos/InviteUserDTO.js
import BadRequestException from "../exceptions/BadRequestException.js";
import Utils from "../utils/Utils.js";

export default class InviteUserDTO {
  constructor(data) {
    const { email, projectId, role, scope, invitedBy } = data;

    if (!email || typeof email !== 'string') {
      throw new BadRequestException("Email is required and must be a string");
    }

    if(!Utils.isValidEmail(email)){
      throw new BadRequestException("Invalid email format");
    }

    if (!projectId || typeof projectId !== 'string') {
      throw new BadRequestException("Project ID is required and must be a string");
    }

    if (!role || typeof role !== 'string') {
      throw new BadRequestException("Role is required and must be a string");
    }

    if (!invitedBy || typeof invitedBy !== 'string') {
      throw new BadRequestException("Inviting user is missing");
    }

    if (!['Full', 'Restricted', 'ReadOnly'].includes(scope)) {
      throw new BadRequestException('Invalid scope value');
    }

    this.email = email;
    this.projectId = projectId;
    this.role = role;
    this.scope = scope;
    this.invitedBy = invitedBy;
  }
}
