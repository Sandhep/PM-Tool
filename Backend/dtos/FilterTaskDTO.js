import TaskConstants from '../constants/TaskConstants.js';
import BadRequestException from '../exceptions/BadRequestException.js';

export default class FilterTaskDTO {

  constructor(data) {

    if (data.page < 1) {
      throw new BadRequestException('Page must be 1 or more');
    }

    if (data.limit < 1 || data.limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    if(!data.projectId){
      throw new BadRequestException('projectId is required');
    }

    if(data.membership && !TaskConstants.TASK_MEMBERSHIP_FILTER.includes(data.membership)){
      throw new BadRequestException('Invalid Membership Filter');
    }

    if(data.status && !TaskConstants.TASK_STATUS.includes(data.status)){
      throw new BadRequestException('Invalid Status');
    }

    if(data.priority && !TaskConstants.TASK_PRIORITY.includes(data.priority)){
      throw new BadRequestException('Invalid Priority');
    }

    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
    this.membership = data.membership?.trim();
    this.status = data.status?.trim();
    this.priority = data.priority?.trim();
    this.search = data.search?.trim() || '';
    this.projectId = data.projectId;
  }
}
