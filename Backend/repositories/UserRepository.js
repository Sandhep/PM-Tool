import User from "../models/User.js";

class UserRepository {

  async findByEmail(email) {
    return User.findOne({Email:email});
  }

  async findByUserId(userId) {
    return User.findOne({ UserID: userId });
  }

  async create(userData) {
    return new User(userData).save();
  }
}

export default new UserRepository();
