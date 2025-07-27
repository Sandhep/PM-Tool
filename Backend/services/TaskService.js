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

  async listTasks(projectId,userId,view) {

    const tasks =  await TaskRepository.findAllByProject(projectId);
    
    if(view === 'my-tasks'){
      const userTasks = tasks.filter(task => task.assignerId === userId || task.assigneeId === userId);
      return userTasks;
    }else if(view === 'all-tasks'){
      return tasks;
    }else{
      throw new BadRequestException('Invalid query value');
    }

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

    return response;
  }
  
}

export default new TaskService();
