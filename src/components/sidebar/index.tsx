import { getChatHistory, renameChat } from "@/action/api/chat";
import { cn } from "@/lib/utils";
import { toggleAuthDialog, toggleSidebar } from "@/redux/slice/app";
import { useDispatch, useSelector } from "@/redux/store";
import {
  EllipsisVertical,
  PanelLeftClose,
  SquarePen,
} from "lucide-react"; 
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { logout } from "@/redux/slice/user";
import { clearMessages } from "@/redux/slice/chatbot";
import { deleteChat } from "@/action/api/chat"; 
import { useTheme } from "@/context/themeContext";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const { isSidebarOpen } = useSelector((state) => state.app);
  const chats = useSelector((state) => state.chatbot.chats);
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("");
  
   const { theme } = useTheme();

  const handleClose = () => {
    dispatch(toggleSidebar(false));
  };

  const handleNewChat = () => {
    dispatch(clearMessages());
    navigate("/");
  };

  const handleOpenAuthDialog = () => {
    dispatch(toggleAuthDialog(true));
  };

  const handleDeleteChat = (chat_id : string) => {
    dispatch(deleteChat({chat_id})).then(() => {
      dispatch(getChatHistory());
      if (activeChatId === String(chat_id)) {
        navigate("/"); 
      }
    });
  };

  const handleRenameChat = (chat_id: string) => {
    setSelectedChatId(chat_id);
    setNewTitle(chats.find((chat) => chat.id === chat_id)?.title || ""); 
    setIsRenaming(true);
  };

  const handleSaveRename = () => {
    if (selectedChatId && newTitle) {
      dispatch(renameChat({chat_id : selectedChatId, newTitle})); 
      setIsRenaming(false);
      setNewTitle("");
      setSelectedChatId("");
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getChatHistory());
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    dispatch(toggleSidebar(false));
    return null;
  }

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
          "fixed top-0 left-0 z-50 h-dvh w-64 bg-muted pt-4 overflow-hidden transition-transform duration-300 space-y-5 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4">
          <PanelLeftClose onClick={handleClose} className="cursor-pointer" />
          <SquarePen onClick={handleNewChat} className="cursor-pointer" />
        </div>
        <div className="grow h-0 flex flex-col gap-1 overflow-y-auto">
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
                      isActive
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-200 dark:hover:bg-gray-800"
                    )
                  }
                >
                  {chat.title}
                </NavLink>
                {/* <Button
                  variant="ghost"
                  className="ml-auto p-1"
                  onClick={() => handleDeleteChat(chat.id)}
                >
                  <Trash2 className="h-4 w-4" /> 
                </Button> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <EllipsisVertical className="ml-auto cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-0" align="start">
                    <Button
                      variant="ghost"
                      className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 w-full justify-start"
                      onClick={() => handleDeleteChat(chat.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 w-full justify-start"
                      onClick={() => handleRenameChat(chat.id)}
                    >
                      Rename
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
          {isRenaming && (
            <div className="p-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={`border p-2 rounded w-full ${
                  theme === "dark"
                    ? "bg-black text-white placeholder-black"
                    : "bg-white text-black placeholder-gray-500"
                }`}
                placeholder="New chat title"
              />
              <Button onClick={handleSaveRename} className="mt-2 w-full">
                Save
              </Button>
            </div>
          )}
        </div>
        <div className="bg-muted p-4 border-t">
          {isLoggedIn && !!user ? (
            <div className="flex items-center gap-2 ">
              <div className="flex flex-col text-wrap">
                <p className="text-base font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <EllipsisVertical className="ml-auto min-w-5 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0" align="start">
                  <Button
                    variant="ghost"
                    className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 w-full justify-start"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex items-center justify-center ">
              <p className="text-sm text-muted-foreground">
                New User?{" "}
                <span
                  className="text-gray-950 cursor-pointer"
                  onClick={handleOpenAuthDialog}
                >
                  Register here
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
