import BadRequestException from '../exceptions/BadRequestException.js';

export default class DeleteProjectDTO {

  constructor(data) {
    
    if (!data.projectId || typeof data.projectId !== 'string') {
      throw new BadRequestException('Project Id is required and must be a string');
    }
    
    this.projectId = data.projectId;
    this.userId = data.userId;
  }
}
