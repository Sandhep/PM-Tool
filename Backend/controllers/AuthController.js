import AuthService from "../services/AuthService.js";
import LoginUserDTO from "../dtos/LoginUserDTO.js";
import RegisterUserDTO from "../dtos/RegisterUserDTO.js";
import InviteUserDTO from "../dtos/InviteUserDTO.js";
import AcceptInviteDTO from "../dtos/AcceptInviteDTO.js";

class AuthController {

  async login(req, res, next) {
    try {
      const dto = new LoginUserDTO(req.body);
      const result = await AuthService.login(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const dto = new RegisterUserDTO(req.body);
      const newUser = await AuthService.register(dto);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      next(error);
    }
  }

  async inviteUser(req, res, next) {
    try {
      const data = { ...req.body, invitedBy: req.user.userId };
      const dto = new InviteUserDTO(data);
      const invitation = await AuthService.inviteUser(dto);
      res.status(200).json({ message: 'Invitation sent successfully', invitation });
    } catch (error) {
      next(error);
    }
  }

  async acceptInvitation(req, res, next) {
    try {
      const dto = new AcceptInviteDTO(req.body);
      const user = await AuthService.acceptInvitation(dto);
      res.status(201).json({ message: 'Invitation accepted', user });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
