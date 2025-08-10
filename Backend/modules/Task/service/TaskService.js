import TaskRepository from '../repository/TaskRepository.js';
import NotFoundException from '../../../common/exceptions/NotFoundException.js';
import BadRequestException from '../../../common/exceptions/BadRequestException.js';
import ProjectRepository from '../../Project/repository/ProjectRepository.js';
import log from '../../../common/utils/Logger.js';

class TaskService {
  
   constructor(){
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.fetchTask = this.fetchTask.bind(this);
    this.getFilteredTasks = this.getFilteredTasks.bind(this);
  }

  async createTask(createTaskDTO) {
    
    if (createTaskDTO.parentTaskId) {

      const parentTask = await TaskRepository.findById(createTaskDTO.parentTaskId);
      if (!parentTask) throw new NotFoundException("Parent task not found");

    }

    const project = await ProjectRepository.findById(createTaskDTO.projectId);

    if(!project){
      throw new NotFoundException("Project Not Found");
    }

    const task = await TaskRepository.create(createTaskDTO);
    log.info('Task Created');
    return task;
  }


  async updateTask(taskId, updateTaskDTO) {

    const existingTask = await TaskRepository.findById(taskId);
    if (!existingTask) throw new NotFoundException("Task not found");

    if (updateTaskDTO.dependentTaskId && updateTaskDTO.dependentTaskId === taskId) {
      throw new BadRequestException("A task cannot depend on itself");
    }

    log.info('Task updated');
    return TaskRepository.update(taskId, updateTaskDTO);
  }

  async deleteTask(taskId) {

    const task = await TaskRepository.findById(taskId);
    if (!task) throw new NotFoundException("Task not found");
    log.info('Task deleted');
    return TaskRepository.delete(taskId);

  }

 
  async getFilteredTasks(userId,filters){
     log.info('Fetched task list');
     return await TaskRepository.findFilteredTasks({userId,...filters});
  }

  async fetchTask(taskId){

    const task = await TaskRepository.findById(taskId);

    if(!task){
       throw new NotFoundException('Task not found');
    }

    const tasks = await TaskRepository.findbyParentTask(taskId);

    let childTasks = [];

    tasks.forEach(childTask =>{
       const node = {
        taskId: childTask.taskId,
        name: childTask.name,
        description: childTask.description,
        status: childTask.status,
        priority: childTask.priority,
        assigneeId: childTask.assigneeId,
        assignerId: childTask.assignerId,
        parentTaskId: childTask.parentTaskId,
       }
       childTasks.push(node);
    })

    const response = {
      taskId: task.taskId,
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      endDate: task.endDate,
      eta: task.eta,
      projectId: task.projectId,
      assignerId: task.assignerId,
      assigneeId: task.assigneeId,
      parentTaskId: task.parentTaskId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      childTasks,
    }
  
    log.info('Fetched task details');
    return response;
  }
  
}

export default new TaskService();
