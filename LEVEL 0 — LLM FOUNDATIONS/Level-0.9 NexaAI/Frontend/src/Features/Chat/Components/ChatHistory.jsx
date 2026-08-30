import { useEffect, useRef, useState } from "react";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveConversationId, setSidebarOpen } from "../Redux/chat.slice";
import ActionMenu from "../../Projects/Components/ProjectPopUp";
import { createPortal } from "react-dom";

const ChatHistory = () => {
  const dispatch = useDispatch();
  const { conversations } = useSelector(
    (state) => state.chat
  );

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  
  const menuRef = useRef(null);

  const setActiveChat = ({ convoId }) => {
    dispatch(setActiveConversationId(convoId));
    dispatch(setSidebarOpen(false));
  };

  const toggleMenu = (e, convoId) => {
    e.stopPropagation();
    
    if (openMenuId === convoId) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      // Position the menu to the right of the more icon
      setMenuCoords({
        top: rect.top,
        left: rect.right + 15,
      });
      setOpenMenuId(convoId);
    }
  };

  // close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
      {conversations?.map((item) => (
        <div key={item.convoId} className="relative">
          <button
            onClick={() =>
              setActiveChat({
                convoId: item.convoId,
              })
            }
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs font-medium transition-all duration-300 group text-left relative"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="truncate flex-1">
              {item.convo || "Untitled Chat"}
            </span>

            <span
              onClick={(e) =>
                toggleMenu(
                  e,
                  item.convoId
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all p-1 rounded-lg hover:bg-orange-100 text-slate-400 hover:text-orange-500 z-20 cursor-pointer"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </span>
          </button>

          {openMenuId === item.convoId &&
            createPortal(
              <div 
                ref={menuRef}
                className="fixed z-[9999]" 
                style={{ top: menuCoords.top, left: menuCoords.left }}
              >
                <ActionMenu
                  convoId={item.convoId}
                  onClose={() => setOpenMenuId(null)}
                />
              </div>,
              document.body
            )}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
