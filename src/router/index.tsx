import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import RequestList from "@/pages/RequestList";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/requests",
        element: <RequestList />,
      },
    ],
    
  },
]);
