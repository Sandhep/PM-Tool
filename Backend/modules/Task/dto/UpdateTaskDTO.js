import BadRequestException from '../../../common/exceptions/BadRequestException.js';

export default class UpdateTaskDTO {
  constructor({ name, description, status, priority, startDate, endDate, eta, assigneeId, dependentTaskId }) {
    if (!name && !description && !status && !priority && !startDate && !endDate && !eta && !assigneeId && !dependentTaskId) {
      throw new BadRequestException("At least one field is required to update");
    }
    this.name = name;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.eta = eta;
    this.assigneeId = assigneeId;
    this.dependentTaskId = dependentTaskId;
  }
}
