import { toggleAuthDialog, toggleSidebar } from "@/redux/slice/app";
import { useDispatch, useSelector } from "@/redux/store";
import { PanelRightClose } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { saveChat } from "@/action/api";
import { useMemo } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const isSidebarOpen = useSelector((state) => state.app.isSidebarOpen);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { chat_id, messages } = useSelector((state) => state.chatbot);

  const showSaveButton = useMemo(() => {
    const isCurrentChatSaved = id === chat_id;
    return messages.length > 0 && !isCurrentChatSaved;
  }, [messages.length, id, chat_id]);

  const handleSidebarOpen = () => {
    dispatch(toggleSidebar(true));
  };

  const handleSaveChat = async () => {
    if (!isLoggedIn) {
      dispatch(toggleAuthDialog(true));
      return;
    }
    await dispatch(saveChat(chat_id));
    navigate(`/${chat_id}`);
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        {!isSidebarOpen && isLoggedIn && (
          <PanelRightClose
            onClick={handleSidebarOpen}
            className="cursor-pointer"
          />
        )}
        <h3 className="text-lg font-semibold">IntelliChat</h3>
      </div>

      {!isLoggedIn && !showSaveButton && (
        <Button onClick={() => dispatch(toggleAuthDialog(true))}>
          Register
        </Button>
      )}
      {showSaveButton && <Button onClick={handleSaveChat}>Save Chat</Button>}
    </div>
  );
};

export default Navbar;
