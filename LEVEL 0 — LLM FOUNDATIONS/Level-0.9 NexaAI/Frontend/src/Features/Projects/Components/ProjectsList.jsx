import { useState, useRef, useEffect } from "react";
import { FolderGit2, Plus, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useProject } from "../Hooks/useProject";
import { setActiveProjectId } from "../Redux/project.slice";

const ProjectsList = () => {
  const { projects } = useSelector((state) => state.project);
  const { createProjectHook } = useProject();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Inline create state — no window.prompt ever
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleStartCreate = (e) => {
    e.stopPropagation();
    setIsCollapsed(false); // Expand when creating a new project
    setIsCreating(true);
    setNewTitle("");
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewTitle("");
  };

  const handleSubmitCreate = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      handleCancelCreate();
      return;
    }
    await createProjectHook({ title: trimmed });
    setIsCreating(false);
    setNewTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmitCreate();
    if (e.key === "Escape") handleCancelCreate();
  };

  return (
    <div className="px-4 py-2 space-y-1">
      {/* Section Header */}
      <div 
        className="flex items-center justify-between px-2 mb-2 cursor-pointer group"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-1.5">
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          )}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">
            Projects
          </span>
        </div>
        <button
          onClick={handleStartCreate}
          title="New Project"
          className="text-slate-400 hover:text-orange-500 transition-colors rounded-md p-0.5 hover:bg-orange-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {!isCollapsed && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Inline Create Input */}
          {isCreating && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-orange-50 border border-orange-200 mx-1 mb-1">
              <FolderGit2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Project name..."
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none min-w-0"
              />
              <button
                onClick={handleSubmitCreate}
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancelCreate}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Project List */}
          <div className="space-y-0.5">
            {(projects || []).length === 0 && !isCreating ? (
              <button
                onClick={handleStartCreate}
                className="w-full px-2 text-xs text-slate-400 hover:text-orange-500 transition-colors text-left py-1"
              >
                + Create your first project
              </button>
            ) : (
              (projects || []).filter(Boolean).map((item) => (
                <button
                  key={item._id || item.title}
                  onClick={() => {
                    dispatch(setActiveProjectId(item._id));
                    navigate("/projects");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-orange-50 hover:text-orange-700 text-xs font-medium transition-all duration-200 group text-left"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 shrink-0 transition-colors" />
                  <span className="truncate flex-1">
                    {item.title || "Untitled Project"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
