import Task from '../model/Task.js';

class TaskRepository {

  constructor(){
    this.findFilteredTasks = this.findFilteredTasks.bind(this);
  }

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

  async findbyParentTask(parentTaskId){
    return Task.find({parentTaskId});
  }

  async update(taskId, updateData) {
    return Task.findOneAndUpdate({ taskId }, updateData, { new: true });
  }

  async delete(taskId) {
    return Task.findOneAndDelete({ taskId });
  }

  async findFilteredTasks({userId,projectId,membership,status,priority,page,limit,search}) {
  
    const skip = (page - 1) * limit;
  
    let taskFilter = {};

    taskFilter.projectId = projectId;
  
    // If search is applied, prepare $regex filter for name/description
    if (search) {
      taskFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if(status){
       taskFilter.status = status;
    }
    
    if(priority){
      taskFilter.priority = priority;
    }

    let tasks;
    let total;
  
    if (membership === 'AssignedByMe') {

      // Filter by assigner
      taskFilter.assignerId = userId;
  
      [tasks, total] = await Promise.all([
        Task.find(taskFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Task.countDocuments(taskFilter)
      ]);

    }else if(membership === 'AssignedToMe') {

      // Filter by assignee
      taskFilter.assignee = userId;
  
      [tasks, total] = await Promise.all([
        Task.find(taskFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Task.countDocuments(taskFilter)
      ]);

    }else{

      [tasks, total] = await Promise.all([
        Task.find(taskFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Task.countDocuments(taskFilter)
      ]);
    }

    return this.formatPaginatedResult({ tasks, total, page, limit });
  }
  
  formatPaginatedResult({ tasks, total, page, limit }) {
    return {
      tasks,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasNext: page * limit < total,
        hasPrevious: page > 1
      }
    };
  }
}

export default new TaskRepository();
