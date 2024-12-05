import { RouteObject } from "react-router-dom";
import HomePage from "./home";
import SellerLayout from "./layout";
import PrivateRoute from "../../components/privateRoute";
import ProductsPage from "./products";
import OrdersPage from "./orders";
import NewProductPage from "./newProduct";
import UpdateProductPage from "./updateProduct";

const sellerRouter: RouteObject = {
  path: "seller",
  element: <PrivateRoute children={<SellerLayout />} />,
  children: [
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "products",
      element: <ProductsPage />,
    },
    {
      path: "product/new",
      element: <NewProductPage />,
    },
    {
      path: "product/:id",
      element: <UpdateProductPage />,
    },
    {
      path: "orders",
      element: <OrdersPage />,
    },
  ],
};

export default sellerRouter

