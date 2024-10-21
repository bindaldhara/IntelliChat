import { useEffect, useState } from "react";
import { AppDispatch, useDispatch, useSelector } from "@/redux/store";
import {
  fetchUsers,
  fetchChatsOfUser,
  getMessagesOfChat,
} from "@/action/api/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatList } from "@/components/chat/chat-list";
import { setSelectedChatId, setSelectedUserId } from "@/redux/slice/admin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const AdminPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, chats, messages, selectedUserId, selectedChatId } =
    useSelector((state) => state.admin);

  const [tab, setTab] = useState<"chats" | "messages" | "users">("users");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserSelect = (userId: string) => {
    dispatch(setSelectedUserId(userId));
    dispatch(setSelectedChatId(""));
    dispatch(fetchChatsOfUser(userId));
    setTab("chats");
  };

  const handleChatSelect = (chatId: string) => {
    dispatch(setSelectedChatId(chatId));
    dispatch(getMessagesOfChat(chatId));
    setTab("messages");
  };

  const handleBack = () => {
    if (tab === "messages") {
      setTab("chats");
    } else if (tab === "chats") {
      setTab("users");
    }
  };

  return (
    <div className="p-4 space-y-4 flex flex-col h-dvh">
      <div className="flex items-center">
        {tab !== "users" && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-7"
            onClick={handleBack}
          >
          <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h3 className="text-xl font-bold">Track User Activity</h3>
      </div>
      <div className="grow flex gap-4">
        {/* Users Table */}
        <ScrollArea
          className={cn(
            "h-full border rounded-md flex-1",
            tab === "users" ? "flex" : "hidden md:flex"
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className={`cursor-pointer ${
                    selectedUserId === user.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleUserSelect(user.id)}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No users found
            </div>
          )}
        </ScrollArea>

        {/* Chats Table */}
        <ScrollArea
          className={cn(
            "h-full border rounded-md flex-1",
            tab === "chats" ? "flex" : "hidden md:flex"
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.user_id === selectedUserId &&
                chats.chats.map((chat) => (
                  <TableRow
                    key={chat.id}
                    className={`cursor-pointer ${
                      selectedChatId === chat.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <TableCell>{chat.title}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {chats.chats.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {selectedUserId ? "No chats found" : "Select a user first"}
            </div>
          )}
        </ScrollArea>
        <div
          className={cn(
            "h-full flex flex-col rounded-md  border flex-1",
            tab === "messages" ? "flex" : "hidden md:flex"
          )}
        >
          <div className="p-3.5 border-b">
            <p className="text-sm text-muted-foreground ">Chats</p>
          </div>
          {messages.messages.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {selectedChatId ? "No messages found" : "Select a chat first"}
            </div>
          )}
          <ChatList
            messages={
              messages.chat_id === selectedChatId ? messages.messages : []
            }
            showBottombar={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
