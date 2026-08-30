import { useState, useRef, useEffect } from "react";
import {
  FolderPlus,
  ChevronRight,
  Archive,
  Trash2,
  Folder,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useProject } from "../Hooks/useProject.jsx";
import { useChat } from "../../Chat/Hooks/useChat.jsx";

const ActionMenu = ({ convoId, onClose }) => {
  const [showProjects, setShowProjects] = useState(false);
  const [showInlineCreate, setShowInlineCreate] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const newProjectInputRef = useRef(null);

  const { projects } = useSelector((state) => state.project);
  const { addConversationToProjectHook, createProjectHook } = useProject();
  const { deleteConversationHook } = useChat();

  useEffect(() => {
    if (showInlineCreate && newProjectInputRef.current) {
      newProjectInputRef.current.focus();
    }
  }, [showInlineCreate]);

  const handleMoveToProject = async (projectId) => {
    await addConversationToProjectHook({ projectId, conversationId: convoId });
    if (onClose) onClose();
  };

  const handleCreateAndMove = async () => {
    const trimmed = newProjectTitle.trim();
    if (!trimmed) return;
    const result = await createProjectHook({ title: trimmed });
    if (result?.data?._id) {
      await handleMoveToProject(result.data._id);
    } else {
      setShowInlineCreate(false);
      setNewProjectTitle("");
      if (onClose) onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreateAndMove();
    if (e.key === "Escape") {
      setShowInlineCreate(false);
      setNewProjectTitle("");
    }
  };

  return (
    <div className="w-56 relative rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl flex flex-col gap-0.5">
      {/* Move to Project — hover flyout */}
      <div
        className="relative group/menu"
        onMouseEnter={() => setShowProjects(true)}
        onMouseLeave={() => {
          setShowProjects(false);
          setShowInlineCreate(false);
          setNewProjectTitle("");
        }}
      >
        <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600">
          <div className="flex items-center gap-3">
            <FolderPlus
              size={16}
              className="text-slate-400 group-hover/menu:text-orange-500 transition-colors"
            />
            <span>Move to project</span>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        {/* Nested flyout panel */}
        {showProjects && (
          <div className="absolute left-full top-0 ml-1 w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl flex flex-col gap-0.5 z-50">
            {(projects || []).length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 italic text-center">
                No projects yet
              </div>
            ) : (
              (projects || []).filter(Boolean).map((project) => (
                <button
                  key={project._id || project.title}
                  onClick={() => handleMoveToProject(project._id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 group/item"
                >
                  <Folder
                    size={15}
                    className="text-slate-400 group-hover/item:text-orange-400 transition-colors shrink-0"
                  />
                  <span className="truncate">{project.title || "Untitled"}</span>
                </button>
              ))
            )}

            <div className="mx-2 my-1 border-b border-slate-100" />

            {/* Inline New Project — no window.prompt ever */}
            {showInlineCreate ? (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-orange-50 border border-orange-200 mx-1">
                <FolderPlus size={14} className="text-orange-400 shrink-0" />
                <input
                  ref={newProjectInputRef}
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Project name..."
                  className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none min-w-0"
                />
                <button
                  onClick={handleCreateAndMove}
                  className="text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => {
                    setShowInlineCreate(false);
                    setNewProjectTitle("");
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowInlineCreate(true)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
              >
                <FolderPlus size={15} />
                <span>New Project</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mx-2 my-1 border-b border-slate-100" />

      {/* Rename */}
      <button
        onClick={() => { if (onClose) onClose(); }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 group/btn"
      >
        <Pencil size={15} className="text-slate-400 group-hover/btn:text-orange-500 transition-colors" />
        Rename
      </button>

      {/* Archive */}
      <button
        onClick={() => { if (onClose) onClose(); }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 group/btn"
      >
        <Archive size={15} className="text-slate-400 group-hover/btn:text-orange-500 transition-colors" />
        Archive
      </button>

      {/* Delete */}
      <button
        onClick={async () => {
          await deleteConversationHook({ conversationId: convoId });
          if (onClose) onClose();
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 group/btn"
      >
        <Trash2 size={15} className="text-red-400 group-hover/btn:text-red-600 transition-colors" />
        Delete
      </button>
    </div>
  );
};

export default ActionMenu;
