import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";

import "./app.css";
import Home from "./pages/home";
import { BaseLayout } from "./components/layout";

let router = createBrowserRouter([
  {
    Component: BaseLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
    ],
  },
]);

createRoot(root).render(<RouterProvider router={router} />);
