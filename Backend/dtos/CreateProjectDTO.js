import BadRequestException from '../exceptions/BadRequestException.js';

export default class CreateProjectDTO {

  constructor(data) {
    
    if (!data.name || typeof data.name !== 'string') {
      throw new BadRequestException('Project name is required and must be a string');
    }

    this.name = data.name;
    this.description = data.description || '';
    this.createdBy = data.createdBy;
  }
}
