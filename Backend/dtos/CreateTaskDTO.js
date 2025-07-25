import BadRequestException from '../exceptions/BadRequestException.js';

export default class CreateTaskDTO {
  constructor({ name, description, status, priority, startDate, endDate, eta, projectId, assignerId, assigneeId, dependentTaskId }) {
    if (!name) throw new BadRequestException("Task name is required");
    if (!projectId) throw new BadRequestException("Project ID is required");
    if (!assignerId) throw new BadRequestException("Assigner ID is required");
    if (!assigneeId) throw new BadRequestException("Assignee ID is required");

    this.name = name;
    this.description = description || '';
    this.status = status || 'Not Started';
    this.priority = priority || 'Low';
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.eta = eta || null;
    this.projectId = projectId;
    this.assignerId = assignerId;
    this.assigneeId = assigneeId;
    this.dependentTaskId = dependentTaskId || null;
  }
}
