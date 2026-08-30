import { createSlice } from "@reduxjs/toolkit";

const upsertConversation = (project, conversation) => {
    if (!project || !conversation?._id) return;

    if (!project.conversations) {
        project.conversations = [];
    }

    project.conversations = project.conversations.filter(
        (item) => item._id !== conversation._id
    );
    project.conversations.unshift(conversation);
    project.conversationCount = project.conversations.length;
};

const removeConversationFromProject = (project, conversationId) => {
    if (!project?.conversations) return;

    project.conversations = project.conversations.filter(
        (item) => item._id !== conversationId
    );
    project.conversationCount = project.conversations.length;
};

const projectSlice = createSlice({
    name: "project",

    initialState: {
        activeProject: null,
        projects: [],
        loading: false,
        error: null,
    },

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setActiveProjectId: (state, action) => {
            const projectId = action.payload;

            if (!projectId) {
                state.activeProject = null;
                return;
            }

            state.activeProject = state.projects.find((p) => p._id === projectId) || null;
        },

        setActiveProject: (state, action) => {
            state.activeProject = action.payload;
        },

        setAllProjects: (state, action) => {
            state.projects = action.payload || [];

            if (state.activeProject) {
                state.activeProject =
                    state.projects.find((project) => project._id === state.activeProject._id) ||
                    null;
            }
        },

        addProject: (state, action) => {
            const project = action.payload;
            if (!project?._id) return;

            const exists = state.projects.find((item) => item._id === project._id);
            if (exists) {
                Object.assign(exists, project);
                return;
            }

            state.projects.unshift(project);
        },

        replaceProject: (state, action) => {
            const project = action.payload;
            if (!project?._id) return;

            const index = state.projects.findIndex((item) => item._id === project._id);
            if (index >= 0) {
                state.projects[index] = project;
            } else {
                state.projects.unshift(project);
            }

            if (state.activeProject?._id === project._id) {
                state.activeProject = project;
            }
        },

        addConversationToProject: (state, action) => {
            const { projectId, conversation } = action.payload;
            if (!projectId || !conversation?._id) return;

            state.projects.forEach((project) => {
                removeConversationFromProject(project, conversation._id);
            });

            const targetProject = state.projects.find((p) => p._id === projectId);
            upsertConversation(targetProject, conversation);

            if (state.activeProject) {
                if (state.activeProject._id === projectId) {
                    removeConversationFromProject(state.activeProject, conversation._id);
                    upsertConversation(state.activeProject, conversation);
                } else {
                    removeConversationFromProject(state.activeProject, conversation._id);
                }
            }
        },

        renameProject: (state, action) => {
            const { projectId, title } = action.payload;
            const project = state.projects.find((p) => p._id === projectId);

            if (project) {
                project.title = title;
            }

            if (state.activeProject?._id === projectId) {
                state.activeProject.title = title;
            }
        },

        deleteProject: (state, action) => {
            state.projects = state.projects.filter((p) => p._id !== action.payload);

            if (state.activeProject?._id === action.payload) {
                state.activeProject = null;
            }
        },
    },
});

export const {
    setLoading,
    setError,
    setActiveProjectId,
    setActiveProject,
    setAllProjects,
    addProject,
    replaceProject,
    addConversationToProject,
    renameProject,
    deleteProject,
} = projectSlice.actions;

export default projectSlice.reducer;
