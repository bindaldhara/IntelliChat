import Chat from "@/components/chat";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { useSelector } from "@/redux/store";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { isSidebarOpen } = useSelector((state) => state.app);
  const { id: chat_id } = useParams();

  return (
    <div className="w-dvw h-dvh flex font-sans">
      <Sidebar />
      <div
        className={cn(
          "grow flex flex-col",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <Navbar />
        <Chat chat_id={chat_id || "new"} />
      </div>
    </div>
  );
};

export default ChatPage;
