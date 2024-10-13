import AuthDialog from "@/components/auth";
import Chat from "@/components/chat";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { setChatId } from "@/redux/slice/chatbot";
import { useDispatch, useSelector } from "@/redux/store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChatPage = () => {
  const { isSidebarOpen } = useSelector((state) => state.app);
  const chat_id = useSelector((state) => state.chatbot.chat_id);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setChatId(id || "new"));
  }, [id, dispatch]);

  useEffect(() => {
    if (chat_id === "new") {
      navigate("/");
    }
  }, [chat_id, navigate]);

  return (
    <div className="w-dvw h-dvh flex font-sans">
      <Sidebar />
      <div className={cn("grow flex flex-col", isSidebarOpen && "md:ml-64")}>
        <Navbar />
        <Chat chat_id={id || chat_id || "new"} />
      </div>
      <AuthDialog />
    </div>
  );
};

export default ChatPage;
