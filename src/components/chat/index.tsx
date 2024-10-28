import { useEffect, useState } from "react";
import { ChatList } from "./chat-list";
import { UserMessage } from "@/types";
import { useDispatch, useSelector } from "@/redux/store";
import { getChatMessages, sendMessage } from "@/action/api/chat";
// import { removeMessage } from "@/redux/slice/chatbot";

const Chat = ({ chat_id }: { chat_id: string }) => {
  const messages = useSelector((state) => state.chatbot.messages);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageFunction = (message: UserMessage) => {
    dispatch(sendMessage({ chat_id, message }));
  };

  // const deleteMessageFunction = (messageId: string) => {
  //   dispatch(removeMessage(messageId));
  // };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await dispatch(getChatMessages({ chat_id }));
      setIsLoading(false);
    })();
  }, [chat_id, dispatch]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 flex flex-col rounded-md h-96">
        <ChatList
          messages={messages}
          sendMessage={sendMessageFunction}
          // deleteMessage={deleteMessageFunction} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;
