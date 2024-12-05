import { RouteObject } from "react-router-dom";
import HomePage from "./home";
import AppLayout from "./layout";
import ProductPage from "./productPage";
import SellerPage from "./sellerPage";
import Search from "./search";

const appRouter: RouteObject = {
  path: "/",
  element: <AppLayout />,
  children: [
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "product/:id",
      element: <ProductPage />,
    },
    {
      path: "seller/:id",
      element: <SellerPage />,
    },
    {
      path: "search",
      element: <Search />,
    },
  ],
};

export default appRouter
