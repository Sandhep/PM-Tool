import AuthService from "../services/AuthService.js";
import LoginUserDTO from "../dtos/LoginUserDTO.js";
import RegisterUserDTO from "../dtos/RegisterUserDTO.js";
import RequestOtpDTO from "../dtos/RequestOtpDTO.js";
import VerifyOtpDTO from "../dtos/VerifyOtpDTO.js";

class AuthController {

  constructor(){
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.requestOtp = this.requestOtp.bind(this);
    this.resetPasswordWithOtp = this.resetPasswordWithOtp.bind(this);
  }

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

  async requestOtp(req, res, next) {
    try {
      const dto = new RequestOtpDTO(req.body);
      const result = await AuthService.requestOtp(dto);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async resetPasswordWithOtp(req, res, next) {
    try {
      const dto = new VerifyOtpDTO(req.body);
      const result = await AuthService.resetPasswordWithOtp(dto);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }


}

export default new AuthController();
