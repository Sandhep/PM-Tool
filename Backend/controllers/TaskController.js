import TaskService from '../services/TaskService.js';
import CreateTaskDTO from '../dtos/CreateTaskDTO.js';
import UpdateTaskDTO from '../dtos/UpdateTaskDTO.js';

class TaskController {

  constructor(){
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
      this.list = this.list.bind(this);
      this.fetch = this.fetch.bind(this);
   }

  async create(req, res, next) {
    try {
      const dto = new CreateTaskDTO({ ...req.body, assignerId: req.user.userId , projectId:req.query.projectId});
      const task = await TaskService.createTask(dto);
      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const dto = new UpdateTaskDTO(req.body);
      const task = await TaskService.updateTask(req.params.taskId, dto);
      res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await TaskService.deleteTask(req.params.taskId);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const view = req.query.view;
      const tasks = await TaskService.listTasks(req.query.projectId,req.user.userId,view);
      res.status(200).json({ tasks });
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

}

export default new TaskController();
