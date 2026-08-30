import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  addConversations,
  addMessages,
  appendMessageChunk,
  deleteConversation as deleteConversationFromState,
  removeLastMessage,
  setActiveConversationId,
  setConversationMessages,
  setConversations,
  setError,
  setLoading,
  setStreamingConversationId,
  updateConversationMeta,
} from "../Redux/chat.slice";

import {
  createEmptyConversationApi,
  deleteConversation,
  getAllConversations,
  getAllMessages,
  streamStartChat,
  streamTakeFollowUp,
  updateConversationModeApi,
} from "../Services/chat.service";

const toUiMessage = (chat) => ({
  role: chat.role,
  message: {
    content: chat.content,
  },
});

export const useChat = () => {
  const dispatch = useDispatch();

  const startChatHook = useCallback(async ({ message, mode = "casual" }) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return { success: false };

    dispatch(setLoading(true));
    dispatch(setError(null));

    let currentConvoId = null;

    return new Promise((resolve) => {
      streamStartChat(
        { message: trimmedMessage, mode },
        (startData) => {
          currentConvoId = startData.conversationId;

          dispatch(setActiveConversationId(currentConvoId));
          dispatch(setStreamingConversationId(currentConvoId));
          dispatch(
            addConversations({
              convoId: currentConvoId,
              convo: startData.title,
              mode: startData.mode || mode,
            })
          );
          dispatch(
            setConversationMessages({
              chatId: currentConvoId,
              messages: [
                { message: { content: trimmedMessage }, role: "user" },
                { message: { content: "" }, role: "ai" },
              ],
            })
          );
        },
        (chunk) => {
          if (!currentConvoId) return;
          dispatch(
            appendMessageChunk({
              chatId: currentConvoId,
              chunk,
              role: "ai",
            })
          );
        },
        (done) => {
          dispatch(setLoading(false));
          dispatch(setStreamingConversationId(null));

          if (done?.conversationId) {
            dispatch(
              updateConversationMeta({
                convoId: done.conversationId,
                convo: done.title,
                mode: done.mode,
              })
            );
          }

          resolve(done);
        },
        (err) => {
          if (currentConvoId) {
            dispatch(removeLastMessage({ chatId: currentConvoId, role: "ai" }));
          }
          dispatch(setError(err));
          dispatch(setLoading(false));
          dispatch(setStreamingConversationId(null));
          resolve({ success: false, error: err });
        }
      );
    });
  }, [dispatch]);

  const takeFollowUpHook = useCallback(async ({ conversationId, message }) => {
    const trimmedMessage = message.trim();
    if (!conversationId || !trimmedMessage) return { success: false };

    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setStreamingConversationId(conversationId));
    dispatch(
      addMessages({
        chatId: conversationId,
        message: { content: trimmedMessage },
        role: "user",
      })
    );
    dispatch(
      addMessages({
        chatId: conversationId,
        message: { content: "" },
        role: "ai",
      })
    );

    return new Promise((resolve) => {
      streamTakeFollowUp(
        { conversationId, message: trimmedMessage },
        (chunk) => {
          dispatch(
            appendMessageChunk({
              chatId: conversationId,
              chunk,
              role: "ai",
            })
          );
        },
        (done) => {
          dispatch(setLoading(false));
          dispatch(setStreamingConversationId(null));

          if (done?.conversationId) {
            dispatch(
              updateConversationMeta({
                convoId: done.conversationId,
                convo: done.title,
                mode: done.mode,
              })
            );
          }

          resolve(done);
        },
        (err) => {
          dispatch(removeLastMessage({ chatId: conversationId, role: "ai" }));
          dispatch(setError(err));
          dispatch(setLoading(false));
          dispatch(setStreamingConversationId(null));
          resolve({ success: false, error: err });
        }
      );
    });
  }, [dispatch]);

  const fetchChatHistory = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await getAllConversations();

      if (data.success) {
        dispatch(setConversations(data.allConversations));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const getAllChats = useCallback(async ({ conversationId }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await getAllMessages({ conversationId });

      dispatch(
        addConversations({
          convoId: data.conversationId,
          convo: data.title,
          mode: data.mode,
        })
      );
      dispatch(
        setConversationMessages({
          chatId: conversationId,
          messages: data.chats.map(toUiMessage),
        })
      );
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createEmptyChatHook = useCallback(async ({ mode = "casual" }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await createEmptyConversationApi({ mode });

      if (data.success) {
        dispatch(setActiveConversationId(data.conversationId));
        dispatch(
          addConversations({
            convoId: data.conversationId,
            convo: data.conversation?.title || "New Chat",
            mode: data.conversation?.mode || mode,
            createdAt: data.conversation?.createdAt,
            updatedAt: data.conversation?.updatedAt,
          })
        );
        dispatch(
          setConversationMessages({
            chatId: data.conversationId,
            messages: [],
          })
        );
      }

      return data;
    } catch (err) {
      dispatch(setError(err.message));
      return { success: false, error: err.message };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const updateModeHook = useCallback(async ({ conversationId, mode }) => {
    try {
      dispatch(setError(null));
      const data = await updateConversationModeApi({ conversationId, mode });

      if (data.success) {
        dispatch(
          updateConversationMeta({
            convoId: conversationId,
            mode: data.mode,
          })
        );
      }

      return data;
    } catch (err) {
      dispatch(setError(err.message));
      return { success: false, error: err.message };
    }
  }, [dispatch]);

  const deleteConversationHook = useCallback(async ({ conversationId }) => {
    try {
      dispatch(setError(null));
      const data = await deleteConversation(conversationId);

      if (data.success) {
        dispatch(deleteConversationFromState(conversationId));
      }

      return data;
    } catch (err) {
      dispatch(setError(err.message));
      return { success: false, error: err.message };
    }
  }, [dispatch]);

  return {
    startChatHook,
    takeFollowUpHook,
    fetchChatHistory,
    getAllChats,
    createEmptyChatHook,
    updateModeHook,
    deleteConversationHook,
  };
};
