// controllers/TaskController.js
import TaskService from '../services/TaskService.js';
import CreateTaskDTO from '../dtos/CreateTaskDTO.js';
import UpdateTaskDTO from '../dtos/UpdateTaskDTO.js';

class TaskController {
  async create(req, res, next) {
    try {
      const dto = new CreateTaskDTO({ ...req.body, assignerId: req.user.userId });
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
      const tasks = await TaskService.listTasks(req.params.projectId);
      res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
