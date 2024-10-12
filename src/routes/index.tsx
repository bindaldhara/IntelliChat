import ChatPage from "@/pages/chat";
import { createBrowserRouter } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <ChatPage />,
    children: [
      {
        path: "/:id",
        element: <ChatPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
