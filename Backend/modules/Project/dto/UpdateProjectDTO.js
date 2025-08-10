import ProjectConstants from "../../../common/constants/ProjectConstants.js";
import BadRequestException from "../../../common/exceptions/BadRequestException.js";

export default class UpdateProjectDTO {

  constructor(data) {

    if (!data.name || typeof data.name !== 'string') {
      throw new BadRequestException('Project name is required and must be a string');
    }
    
    if (data.status && !ProjectConstants.PROJECT_STATUS.includes(data.status)) {
      throw new BadRequestException('Invalid project status');
    }
    
    if(data.name)  this.name = data.name;

    if(data.description) this.description = data.description;
   
    if(data.status) this.status = data.status;

  }
}
