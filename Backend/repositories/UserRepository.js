import User from "../models/User.js";

class UserRepository {

  async findByEmail(email) {
    return await User.findOne({email});
  }

  async findByUserId(userId) {
    return await User.findOne({ userId });
  }

  async create(userData) {
    return new User(userData).save();
  }
}

export default new UserRepository();
