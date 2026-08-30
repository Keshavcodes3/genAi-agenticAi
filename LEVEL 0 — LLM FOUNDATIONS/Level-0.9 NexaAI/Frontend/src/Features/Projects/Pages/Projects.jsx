import { useEffect } from 'react';
import Sidebar from '../../Chat/Components/Sidebar.jsx';
import MobileHeader from '../../Chat/Components/MobileHeader.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { useProject } from '../Hooks/useProject.jsx';
import { FolderGit2, MessageSquare, ArrowLeft } from 'lucide-react';
import { setActiveProjectId } from '../Redux/project.slice.js';
import { setActiveConversationId } from '../../Chat/Redux/chat.slice.js';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { activeProject, projects } = useSelector((state) => state.project);
  const { getAllProjectsHook } = useProject();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjectsHook();
  }, [getAllProjectsHook]);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        <MobileHeader title="Workspace" />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-hide">
          {activeProject ? (
            <div className="max-w-5xl mx-auto w-full pt-8">
              <button 
                onClick={() => dispatch(setActiveProjectId(null))}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 mb-6 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Workspace
              </button>
              <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <FolderGit2 className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{activeProject.title}</h1>
                  <p className="text-slate-500 mt-1">Project Workspace</p>
                </div>
              </div>
              
              <h2 className="text-lg font-semibold text-slate-700 mb-6">Conversations</h2>
              
              {(!activeProject.conversations || activeProject.conversations.length === 0) ? (
                 <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                   <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                     <MessageSquare className="w-8 h-8 text-slate-300" />
                   </div>
                   <p className="text-slate-500 font-medium">No conversations in this project yet.</p>
                   <p className="text-sm text-slate-400 mt-1">Move a chat here to get started.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {activeProject.conversations.map((conv) => (
                     <button
                       key={conv._id}
                       onClick={() => {
                         dispatch(setActiveConversationId(conv._id));
                         navigate("/chat");
                       }}
                       className="group flex h-32 cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
                     >
                       <div className="flex items-start justify-between mb-auto">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                            <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {conv.mode || "casual"}
                          </span>
                       </div>
                       <div>
                          <h3 className="truncate font-semibold text-slate-700 group-hover:text-slate-900">
                            {conv.title || "New Chat"}
                          </h3>
                          <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-slate-400">
                            {conv.chatCount || 0} {(conv.chatCount === 1) ? "message" : "messages"}
                          </p>
                       </div>
                     </button>
                   ))}
                 </div>
              )}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto w-full pt-8">
              <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                  <FolderGit2 className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight">All Projects</h1>
                  <p className="text-slate-500 mt-1">Your workspace overview</p>
                </div>
              </div>

              {(!projects || projects.length === 0) ? (
                <div className="flex items-center justify-center h-64 flex-col gap-4 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                   <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <FolderGit2 className="w-8 h-8 text-slate-300" />
                   </div>
                   <p className="text-lg font-medium text-slate-500">No projects found</p>
                   <p className="text-sm">Create a new project from the sidebar to organize your chats.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                   {(projects || []).filter(Boolean).map((proj) => (
                     <div 
                       key={proj._id}
                       onClick={() => dispatch(setActiveProjectId(proj._id))}
                       className="group p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col h-36"
                     >
                       <div className="flex items-start justify-between mb-auto">
                          <div className="p-2.5 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                            <FolderGit2 className="w-6 h-6 text-orange-500" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 truncate transition-colors">{proj.title}</h3>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {proj.conversations?.length || 0} {(proj.conversations?.length === 1) ? "Chat" : "Chats"}
                          </p>
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
