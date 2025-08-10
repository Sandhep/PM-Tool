class ProjectConstants{

    PROJECT_STATUS = ['Not Started', 'In Progress', 'Completed'];
    PROJECT_VISIBILITY = ['Private', 'Workspace'];
    PROJECT_MEMBERSHIP_FILTER = ['Owner', 'Admin', 'Member','Collaborator','Viewer','All'];

    PROJECT_UPDATE_ACCESS = ['Admin','Manager']; // Roles assigned at Project Level
    PROJECT_READ_ACCESS   = ['Admin','Manager','Collaborator','Viewer']; // Roles assigned at Project Level
    PROJECT_DELETE_ACCESS = ['Admin']; // Roles assigned at Project Level
}

export default new ProjectConstants();