import WorkspaceMemberRepository from '../repositories/WorkspaceMemberRepository.js';
import ForbiddenException from '../exceptions/ForbiddenException.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import WorkspaceRepository from '../repositories/WorkspaceRepository.js';

class WorkspaceAccessControlMiddleware {

  constructor(){
    this.checkAdminAccess = this.checkAdminAccess.bind(this);
    this.checkMemberAccess = this.checkMemberAccess.bind(this);
  }  

  async checkAccess(userId,workspaceId){

    const workspace = await WorkspaceRepository.findById(workspaceId);

    if(!workspace){
       throw new NotFoundException('Workspace Not Found'); 
    }
     
    const access = await WorkspaceMemberRepository.findByWorkspaceAndUser(workspaceId,userId);

    if(!access){
        return 'Non Member';
    }

    return access.role;

  }

  async checkAdminAccess(req,res,next){

    try{
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;

        const access = await this.checkAccess(userId,workspaceId);

        if(access === 'Admin'){
           next();
        }else{
          throw new ForbiddenException('Requires Admin Access');
        }

    }catch(error){
        next(error);
    }
   
  }

  async checkMemberAccess(req,res,next){

     try{
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;

        const access = await this.checkAccess(userId,workspaceId);

        if(access === 'Member' || access === 'Admin'){
           next();
        }else{
          throw new ForbiddenException('You don not have access to this workspace');
        }

    }catch(error){
        next(error);
    }

  }

}

export default new WorkspaceAccessControlMiddleware();
