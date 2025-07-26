import TaskRepository from '../repositories/TaskRepository.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';
import ProjectRepository from '../repositories/ProjectRepository.js';

class TaskService {
  
   constructor(){
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.listTasks = this.listTasks.bind(this);
    this.fetchTask = this.fetchTask.bind(this);
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

    return task;
  }


  async updateTask(taskId, updateTaskDTO) {

    const existingTask = await TaskRepository.findById(taskId);
    if (!existingTask) throw new NotFoundException("Task not found");

    if (updateTaskDTO.dependentTaskId && updateTaskDTO.dependentTaskId === taskId) {
      throw new BadRequestException("A task cannot depend on itself");
    }

    return TaskRepository.update(taskId, updateTaskDTO);
  }

  async deleteTask(taskId) {

    const task = await TaskRepository.findById(taskId);
    if (!task) throw new NotFoundException("Task not found");
    return TaskRepository.delete(taskId);

  }

  async listTasks(projectId,userId) {

    const tasks =  await TaskRepository.findAllByProject(projectId);
    
    let userTasks = [];

    userTasks = tasks.filter(task => task.assignerId === userId || task.assigneeId === userId);

    return userTasks;
  }

  async fetchTask(taskId){

    const task = await TaskRepository.findById(taskId);
    if(!task){
       throw new NotFoundException('Task not found');
    }
    return task;

  }
  
}

export default new TaskService();
