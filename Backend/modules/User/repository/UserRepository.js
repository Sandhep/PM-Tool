import User from "../model/User.js";

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

  async findByUserIds(userIds) {
    return await User.find({ userId: { $in: userIds } });
  }

}

export default new UserRepository();
