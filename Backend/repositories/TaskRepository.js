import Task from '../models/Task.js';

class TaskRepository {

  async create(taskData) {
    return new Task(taskData).save();
  }

  async findById(taskId) {
    return Task.findOne({ taskId });
  }

  async findByName(name){
    return Task.findOne({name});
  }

  async findAllByProject(projectId) {
    return Task.find({ projectId }).sort({ createdAt: -1 });
  }

  async update(taskId, updateData) {
    return Task.findOneAndUpdate({ taskId }, updateData, { new: true });
  }

  async delete(taskId) {
    return Task.findOneAndDelete({ taskId });
  }
}

export default new TaskRepository();
