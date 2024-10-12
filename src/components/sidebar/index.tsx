import { getChatHistory } from "@/action/api/chat";
import { cn } from "@/lib/utils";
import { toggleSidebar } from "@/redux/slice/app";
import { useDispatch, useSelector } from "@/redux/store";
import { PanelLeftClose, SquarePen } from "lucide-react";
import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const { isSidebarOpen } = useSelector((state) => state.app);
  const chats = useSelector((state) => state.chatbot.chats);

  const handleClose = () => {
    dispatch(toggleSidebar(false));
  };

  const handleNewChat = () => {
    navigate("/");
  };

  useEffect(() => {
    dispatch(getChatHistory());
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-40 backdrop-blur-sm bg-gray-600/50 w-0 h-0",
        isSidebarOpen && "w-dvw h-dvh md:w-0 md:h-0"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-dvh w-64 bg-gray-100 py-4 overflow-hidden transition-transform duration-300 space-y-5",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4">
          <PanelLeftClose onClick={handleClose} className="cursor-pointer" />
          <SquarePen onClick={handleNewChat} className="cursor-pointer" />
        </div>
        <div className="flex flex-col gap-1">
          {chats.map((chat) => {
            const isActive = activeChatId === String(chat.id);
            return (
              <div key={chat.id} className="w-full flex items-center relative">
                {isActive && (
                  <div className="h-5 w-2 bg-gray-500 rounded-lg absolute -left-1" />
                )}
                <NavLink
                  to={`/${chat.id}`}
                  className={({ isActive }) =>
                    cn(
                      "p-1 px-4 hover:bg-gray-200 cursor-pointer block w-full rounded-md mx-4",
                      isActive && "bg-gray-200"
                    )
                  }
                >
                  {chat.title}
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
