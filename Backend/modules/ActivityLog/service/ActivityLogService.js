import ActivityLogRepository from "../repository/ActivityLogRepository.js";
import log from "../../../common/utils/Logger.js";

class ActivityLogService {

  async recordActivity({ resourceType,resourceId,actionType,description,initiatedBy}) {

   try{
        return await ActivityLogRepository.create({
            resourceType,
            resourceId,
            actionType,
            description,
            initiatedBy,
        });
    }catch(error){
       log.error(error);
    }

  }

  async getResourceLogs(resourceId) {
    return await ActivityLogRepository.findByResource(resourceId);
  }
}

export default new ActivityLogService();
