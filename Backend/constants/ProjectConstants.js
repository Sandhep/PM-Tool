class ProjectConstants{

    PROJECT_STATUS = ['Not Started', 'In Progress', 'Completed'];
    PROJECT_VISIBILITY = ['Private', 'Workspace'];
    PROJECT_MEMBERSHIP_FILTER = ['Owner', 'Admin', 'Member','Collaborator','Viewer','All'];

    PROJECT_WRITE_ACCESS = ['Admin','Manager'];
    PROJECT_READ_ACCESS   = ['Admin','Manager','Collaborator','Viewer'];
    PROJECT_ADMIN_ACCESS = ['Admin'];
}

export default new ProjectConstants();