import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import RequestList from "@/pages/RequestList";
import RequestConfirm from "@/pages/RequestConfirm";
import RequestSuccess from "@/pages/RequestSuccess";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import Profile from "@/pages/Profile";
import MyRequests from "@/pages/MyRequests";
import MyRequestDetails from "@/pages/MyRequestDetails";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminProductForm from "@/pages/admin/ProductForm";
import AdminProductImages from "@/pages/admin/ProductImages";
import AdminProductVariants from "@/pages/admin/ProductVariants";
import AdminTaxonomy from "@/pages/admin/Taxonomy";
import AdminRequests from "@/pages/admin/Requests";
import AdminRequestDetails from "@/pages/admin/RequestDetails";

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
        element: <ProtectedRoute />,
        children: [
          {
            path: "/requests",
            element: <RequestList />,
          },
          {
            path: "/request/confirm",
            element: <RequestConfirm />,
          },
          {
            path: "/request/success",
            element: <RequestSuccess />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/my-requests",
            element: <MyRequests />,
          },
          {
            path: "/my-requests/:id",
            element: <MyRequestDetails />,
          },
          {
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    path: "/admin",
                    element: <AdminDashboard />,
                  },
                  {
                    path: "/admin/products",
                    element: <AdminProducts />,
                  },
                  {
                    path: "/admin/products/new",
                    element: <AdminProductForm />,
                  },
                  {
                    path: "/admin/products/:id/edit",
                    element: <AdminProductForm />,
                  },
                  {
                    path: "/admin/products/:id/images",
                    element: <AdminProductImages />,
                  },
                  {
                    path: "/admin/products/:id/variants",
                    element: <AdminProductVariants />,
                  },
                  {
                    path: "/admin/requests",
                    element: <AdminRequests />,
                  },
                  {
                    path: "/admin/requests/:id",
                    element: <AdminRequestDetails />,
                  },
                  {
                    path: "/admin/taxonomy",
                    element: <AdminTaxonomy />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);
