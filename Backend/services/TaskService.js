import TaskRepository from '../repositories/TaskRepository.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';

class TaskService {
  async createTask(createTaskDTO) {
    
    // Check dependent task validity
    if (createTaskDTO.dependentTaskId) {
      const dependentTask = await TaskRepository.findById(createTaskDTO.dependentTaskId);
      if (!dependentTask) throw new NotFoundException("Dependent task not found");
    }
    return TaskRepository.create(createTaskDTO);
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

  async listTasks(projectId) {
    return TaskRepository.findAllByProject(projectId);
  }
}

export default new TaskService();
