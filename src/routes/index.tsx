import AdminPage from "@/pages/admin";
import ChatPage from "@/pages/chat";
import { createBrowserRouter } from "react-router-dom";
import { adminLoader } from "./loaders/admin-loader";

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
  {
    path: "/admin",
    element: <AdminPage />,
    loader: adminLoader,
  },
];

const router = createBrowserRouter(routes);

export default router;
