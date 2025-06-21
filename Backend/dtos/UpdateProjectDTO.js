import BadRequestException from "../exceptions/BadRequestException";

export default class UpdateProjectDTO {

  constructor(data) {
    
    if (data.status && !['Not Started', 'In Progress', 'Completed'].includes(data.status)) {
      throw new BadRequestException('Invalid project status');
    }

    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
  }
}
