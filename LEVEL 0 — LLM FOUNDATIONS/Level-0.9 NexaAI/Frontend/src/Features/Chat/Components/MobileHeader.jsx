import { Menu, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSidebarOpen, setActiveConversationId } from '../Redux/chat.slice.js';
import { useNavigate } from 'react-router-dom';

const MobileHeader = ({ title, showNewChat = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNewChat = () => {
    dispatch(setActiveConversationId(null));
    dispatch(setSidebarOpen(false));
    navigate('/chat');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden shrink-0">
      <button
        onClick={() => dispatch(setSidebarOpen(true))}
        className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
        title="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold text-slate-900">{title}</span>
      {showNewChat ? (
        <button
          onClick={handleNewChat}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          title="New chat"
        >
          <Plus className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-8" />
      )}
    </header>
  );
};

export default MobileHeader;
