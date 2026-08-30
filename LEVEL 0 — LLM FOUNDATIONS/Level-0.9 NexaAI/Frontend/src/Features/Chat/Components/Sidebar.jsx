import { useEffect } from 'react';
import { Sparkles, Plus, BarChart2, LogOut, FolderGit2, ShieldCheck, X } from 'lucide-react';
import ChatHistory from './ChatHistory.jsx';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { setActiveConversationId, setSidebarOpen } from '../Redux/chat.slice.js';
import { logout } from '../../Authentication/Redux/auth.slice.js';
import { useProject } from '../../Projects/Hooks/useProject.jsx';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { getAllProjectsHook } = useProject();

  useEffect(() => {
    getAllProjectsHook();
  }, [getAllProjectsHook]);

  const { user } = useSelector((state) => state.auth);
  const isSidebarOpen = useSelector((state) => state.chat.isSidebarOpen);

  const userName = user?.username || user?.name || user?.email?.split('@')[0] || 'User';
  const userPlan = user?.plan || 'Free Plan';
  const isAdmin = user?.role === "admin";

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  const resetChatId = () => {
    dispatch(setActiveConversationId(null));
    closeSidebar();
    navigate('/chat');
  };

  const handleLogout = () => {
    dispatch(logout());
    closeSidebar();
    navigate('/login');
  };

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────────
          Always rendered (never conditionally mounted) so the CSS opacity
          transition plays on both open AND close.
          pointer-events-none when hidden prevents invisible click capture.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          md:hidden
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* ── Sidebar ──────────────────────────────────────────────────────────
          Mobile:  fixed, slides in from left, layered above backdrop (z-50)
          Desktop: relative flex child — sidebar is always visible, no overlay
      ──────────────────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          bg-slate-50 border-r border-slate-200
          transition-transform duration-300 ease-in-out
          md:relative md:inset-auto md:z-auto md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Header ── */}
        <div className="flex shrink-0 items-center justify-between gap-2 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">NexaAI</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── New Chat ── */}
        <div className="shrink-0 px-4 pb-4">
          <button
            onClick={resetChatId}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
            New Chat
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="mb-3 shrink-0 space-y-1 px-4">
          <NavLink
            to="/chat"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive || location.pathname === '/'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            Chat
          </NavLink>

          <NavLink
            to="/projects"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <FolderGit2 className="h-4 w-4 shrink-0" />
            Workspace
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
              }`
            }
          >
            <BarChart2 className="h-4 w-4 shrink-0" />
            Analytics
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
                }`
              }
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Admin
            </NavLink>
          )}
        </nav>

        {/* ── Chat History (fills remaining space, scrollable internally) ── */}
        <ChatHistory />

        {/* ── User Profile ── */}
        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-100">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-orange-100 shadow-sm">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f97316&color=fff&size=36`
                }
                alt={userName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
              <p className="truncate text-xs capitalize text-slate-500">{userPlan}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="shrink-0 text-slate-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
