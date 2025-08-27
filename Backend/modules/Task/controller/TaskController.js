import TaskService from '../service/TaskService.js';
import ActivityLog from '../../ActivityLog/service/ActivityLogService.js'
import ActivityLogConstants from '../../../common/constants/ActivityLogConstants.js';
import CreateTaskDTO from '../dto/CreateTaskDTO.js';
import UpdateTaskDTO from '../dto/UpdateTaskDTO.js';
import FilterTaskDTO from '../dto/FilterTaskDTO.js';

class TaskController {

  constructor(){
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
      this.fetch = this.fetch.bind(this);
      this.viewTasks = this.viewTasks.bind(this);
   }

  async create(req, res, next) {
    try {
      const dto = new CreateTaskDTO({ ...req.body, assignerId: req.user.userId , projectId:req.query.projectId});
      const task = await TaskService.createTask(dto);
      ActivityLog.recordActivity({
         resourceType: ActivityLogConstants.RESOURCE_TYPE.TASK,
         resourceId: task.taskId,
         actionType: ActivityLogConstants.ACTION_TYPE.CREATED,
         description: "Task created",
         initiatedBy: req.user.userId,
      })
      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const dto = new UpdateTaskDTO(req.body);
      const task = await TaskService.updateTask(req.params.taskId, dto);
      ActivityLog.recordActivity({
         resourceType: ActivityLogConstants.RESOURCE_TYPE.TASK,
         resourceId: req.params.taskId,
         actionType: ActivityLogConstants.ACTION_TYPE.UPDATED,
         description: "Task Updated",
         initiatedBy: req.user.userId,
      })
      res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
      next(error);
    }
  }

  async updateTaskAssignee(req, res, next) {
     try {
      const assigneeId = req.body.assigneeId;
      const task = await TaskService.updateTaskAssignee(req.params.taskId, assigneeId);
      ActivityLog.recordActivity({
         resourceType: ActivityLogConstants.RESOURCE_TYPE.TASK,
         resourceId: req.params.taskId,
         actionType: ActivityLogConstants.ACTION_TYPE.UPDATED,
         description: "Task Assignee Updated",
         initiatedBy: req.user.userId,
      })
      res.status(200).json({ message: "Task Assignee updated successfully", task });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await TaskService.deleteTask(req.params.taskId);
      ActivityLog.recordActivity({
         resourceType: ActivityLogConstants.RESOURCE_TYPE.TASK,
         resourceId: req.params.taskId,
         actionType: ActivityLogConstants.ACTION_TYPE.DELETED,
         description: "Task Deleted",
         initiatedBy: req.user.userId,
      })
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      next(error);
    }
  }


  async fetch(req,res,next){
    try{
      const task = await TaskService.fetchTask(req.params.taskId);
      res.status(200).json({task});
    } catch(error){
      next(error);
    }
  }

  async viewTasks(req,res,next){
    try{
      const filters = new FilterTaskDTO(req.body);
      const tasks = await TaskService.getFilteredTasks(req.user.userId,filters);
      res.status(200).json(tasks);
    }catch(error){
      next(error);
    }
  }

}

export default new TaskController();
