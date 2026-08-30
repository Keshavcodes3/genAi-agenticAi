import axios from "axios";
import { BASEURL } from "../../API/ApiStore";

const API = axios.create({
    baseURL: `${BASEURL}/api/project`,
    withCredentials: true,
});

export const createProject = async ({ title }) => {
    const { data } = await API.post("/", { title });
    return data;
};

export const getAllProjects = async () => {
    const { data } = await API.get("/");
    return data;
};

export const getOneProject = async ({ projectId }) => {
    const { data } = await API.get(`/${projectId}`);
    return data;
};

export const addConversationToProject = async ({ projectId, conversationId }) => {
    const { data } = await API.post(`/add/${projectId}`, { conversationId });
    return data;
};

export const deleteProject = async ({ projectId }) => {
    const { data } = await API.delete(`/${projectId}`);
    return data;
};

export const renameProject = async ({ projectId, title }) => {
    const { data } = await API.patch(`/rename/${projectId}`, { title });
    return data;
};
