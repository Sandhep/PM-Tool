import ActivityLog from '../model/ActivityLog.js';

class ActivityLogRepository {
  async create(logData) {
    const log = new ActivityLog(logData);
    return await log.save();
  }

  async findByResource(resourceId) {
    return await ActivityLog.find({ resourceId })
      .sort({ createdAt: -1 })
      .exec();
  }
}

export default new ActivityLogRepository();