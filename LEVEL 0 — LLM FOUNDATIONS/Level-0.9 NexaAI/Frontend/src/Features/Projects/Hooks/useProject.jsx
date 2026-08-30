import {
  setLoading,
  setError,
  setActiveProject,
  setAllProjects,
  addProject,
  replaceProject,
  addConversationToProject,
  renameProject,
  deleteProject,
} from "../Redux/project.slice";

import {
  createProject as createProjectApi,
  getAllProjects as getAllProjectsApi,
  getOneProject as getOneProjectApi,
  addConversationToProject as addConversationToProjectApi,
  deleteProject as deleteProjectApi,
  renameProject as renameProjectApi,
} from "../Services/project.service";

import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const useProject = () => {
  const dispatch = useDispatch();

  /* ---------------- CREATE ---------------- */

  const createProjectHook = useCallback(async ({
    title,
  }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data =
        await createProjectApi({
          title,
        });

      if (!data?.success) {
        dispatch(
          setError(data?.message)
        );
        return;
      }

      dispatch(
        addProject(data.data)
      );

      return data;
    } catch (err) {
      dispatch(
        setError(err?.message)
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /* ---------------- GET ALL ---------------- */

  const getAllProjectsHook =
    useCallback(async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data =
          await getAllProjectsApi();

        if (!data?.success) {
          dispatch(
            setError(
              data?.message
            )
          );
          return;
        }

        dispatch(
          setAllProjects(
            data.data
          )
        );

        return data;
      } catch (err) {
        dispatch(
          setError(
            err?.message
          )
        );
      } finally {
        dispatch(
          setLoading(false)
        );
      }
    }, [dispatch]);

  /* ---------------- GET ONE ---------------- */

  const getOneProjectHook =
    useCallback(async ({ projectId }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data =
          await getOneProjectApi({
            projectId,
          });

        if (!data?.success) {
          dispatch(
            setError(
              data?.message
            )
          );
          return;
        }

        dispatch(setActiveProject(data.data));

        return data;
      } catch (err) {
        dispatch(
          setError(
            err?.message
          )
        );
      } finally {
        dispatch(
          setLoading(false)
        );
      }
    }, [dispatch]);

  /* ---------------- ADD CHAT ---------------- */

  const addConversationToProjectHook =
    useCallback(async ({
      projectId,
      conversationId,
    }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data =
          await addConversationToProjectApi(
            {
              projectId,
              conversationId,
            }
          );

        if (!data?.success) {
          dispatch(
            setError(
              data?.message
            )
          );
          return;
        }

        dispatch(
          addConversationToProject(
            {
              projectId,
              conversation: data.data.conversation,
            }
          )
        );

        if (data.data.project) {
          dispatch(replaceProject(data.data.project));
        }

        return data;
      } catch (err) {
        dispatch(
          setError(
            err?.message
          )
        );
      } finally {
        dispatch(
          setLoading(false)
        );
      }
    }, [dispatch]);

  /* ---------------- RENAME ---------------- */

  const renameProjectHook =
    useCallback(async ({
      projectId,
      title,
    }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data =
          await renameProjectApi(
            {
              projectId,
              title,
            }
          );

        if (!data?.success) {
          dispatch(
            setError(
              data?.message
            )
          );
          return;
        }

        if (data.data?._id) {
          dispatch(replaceProject(data.data));
        } else {
          dispatch(renameProject({ projectId, title }));
        }

        return data;
      } catch (err) {
        dispatch(
          setError(
            err?.message
          )
        );
      } finally {
        dispatch(
          setLoading(false)
        );
      }
    }, [dispatch]);

  /* ---------------- DELETE ---------------- */

  const deleteProjectHook =
    useCallback(async ({
      projectId,
    }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data =
          await deleteProjectApi(
            {
              projectId,
            }
          );

        if (!data?.success) {
          dispatch(
            setError(
              data?.message
            )
          );
          return;
        }

        dispatch(
          deleteProject(
            projectId
          )
        );

        return data;
      } catch (err) {
        dispatch(
          setError(
            err?.message
          )
        );
      } finally {
        dispatch(
          setLoading(false)
        );
      }
    }, [dispatch]);

  return {
    createProjectHook,
    getAllProjectsHook,
    getOneProjectHook,
    addConversationToProjectHook,
    renameProjectHook,
    deleteProjectHook,
  };
};
