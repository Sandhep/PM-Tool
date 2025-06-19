// dtos/AcceptInviteDTO.js
import BadRequestException from "../exceptions/BadRequestException.js";

export default class AcceptInviteDTO {
  constructor(data) {
    const { token, name, password } = data;

    if (!token || typeof token !== 'string') {
      throw new BadRequestException("Token is required");
    }

    if (!name || typeof name !== 'string') {
      throw new BadRequestException("Name is required");
    }

    if (!password || typeof password !== 'string') {
      throw new BadRequestException("Password is required");
    }

    this.token = token;
    this.name = name;
    this.password = password;
  }
}
