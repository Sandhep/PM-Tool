class TaskConstants{

    TASK_STATUS = ['Not Started', 'In Progress', 'Completed'];
    TASK_PRIORITY = ['Low', 'Medium', 'High'];
    TASK_MEMBERSHIP_FILTER = ['AssignedByMe','AssignedToMe'];

    TASK_CREATE_ACCESS = ['Admin','Manager','Collaborator']; // Roles assigned at Project Level
    TASK_READ_ACCESS   = ['Admin','Manager','Collaborator','Viewer']; // Roles assigned at Project Level
    TASK_UPDATE_ACCESS = ['Admin','Manager','Assigner','Assignee']; // Roles assigned at Project Level and Task Level
    TASK_DELETE_ACCESS = ['Admin','Manager','Assigner']; // Roles assigned at Project Level and Task Level
}

export default new TaskConstants();