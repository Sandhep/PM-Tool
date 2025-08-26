class ActivityLogConstants {
  static RESOURCE_TYPE = Object.freeze({
    WORKSPACE: "Workspace",
    PROJECT: "Project",
    TASK: "Task",
  });

  static ACTION_TYPE = Object.freeze({
    CREATED: "CREATED",
    UPDATED: "UPDATED",
    DELETED: "DELETED",
  });
}

export default ActivityLogConstants;
